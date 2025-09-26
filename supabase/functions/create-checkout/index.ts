import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;

    // Check for Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Unauthorized: Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: missing Authorization header' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Use anon client with Authorization header for RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user from token (pass JWT explicitly to avoid AuthSessionMissingError)
    const token = authHeader.replace('Bearer ', '');
    let user: any = null;
    let authError: any = null;

    try {
      const res = await supabase.auth.getUser(token);
      user = res.data.user;
      authError = res.error ?? null;
    } catch (e) {
      authError = e;
    }

    // Fallback: try without passing token but relying on global Authorization header
    if (!user) {
      try {
        const res2 = await supabase.auth.getUser();
        user = res2.data.user;
        authError = res2.error ?? authError;
      } catch (_) {}
    }
    
    if (!user) {
      console.error('Unauthorized: could not resolve user from token', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    console.log('Proceeding to checkout for user:', user.email, user.id);

    const { lookup_key, success_url, cancel_url, promotion_code, addons } = await req.json();

    const { Stripe } = await import('https://esm.sh/stripe@14.21.0');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Get or create customer
    let customerId: string;
    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      
      await supabase
        .from('stripe_customers')
        .insert({ user_id: user.id, customer_id: customerId });
    }

    // Map lookup_keys to price_ids
    const priceMapping: { [key: string]: string } = {
      'aeditus_essential_m': 'price_1SBeW9JsCoQneASNUaKERe1V',
      'aeditus_starter_m': 'price_1SBeWOJsCoQneASNQS5Nx5D5', 
      'aeditus_pro_m': 'price_1SBeWiJsCoQneASNK3sNE2mZ',
      'aeditus_amb_m': 'price_1SBeX0JsCoQneASNtGQ0LpIf',
      'aeditus_boost_m': 'price_1SBeXIJsCoQneASNLkfZ7D80',
      'fynk_basic_m': 'price_1SBeXYJsCoQneASNGAQ2F6lf',
      'fynk_pro_m': 'price_1SBeXqJsCoQneASNOQzr6yja'
    };

    const priceId = priceMapping[lookup_key];
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Price not found for lookup key: ' + lookup_key }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Setup session params
    const sessionParams: any = {
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: success_url || `${req.headers.get('origin')}/signin?payment=success`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/signin?payment=cancelled`,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      metadata: {
        user_id: user.id,
        lookup_key: lookup_key,
      },
    };

    if (Array.isArray(addons) && addons.length > 0) {
      const addonLookupKeys = Array.from(
        new Set(
          addons.filter((addon): addon is string =>
            typeof addon === 'string' && addon.trim().length > 0,
          ),
        ),
      );

      for (const addonLookupKey of addonLookupKeys) {
        const addonPriceId = priceMapping[addonLookupKey];

        if (!addonPriceId) {
          return new Response(
            JSON.stringify({ error: `Add-on price not found for ${addonLookupKey}` }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 404,
            },
          );
        }

        sessionParams.line_items.push({
          price: addonPriceId,
          quantity: 1,
        });
      }
    }

    // Add trial for Essential plan (7 days - publication blocked)
    if (lookup_key === 'aeditus_essential_m') {
      sessionParams.subscription_data = {
        trial_period_days: 7,
        metadata: {
          user_id: user.id,
          lookup_key: lookup_key,
        },
      };
    }

    // Handle promotion codes based on plan
    let finalPromotionCode = promotion_code;
    
    // Pre-fill AMBASSADEURS49 for Ambassadors plan
    if (lookup_key === 'aeditus_amb_m' && !finalPromotionCode) {
      finalPromotionCode = 'AMBASSADEURS49';
    }
    
    // Validate promotion codes per plan
    if (finalPromotionCode) {
      // LAUNCH25 only for Starter & Pro
      if (finalPromotionCode === 'LAUNCH25' && !['aeditus_starter_m', 'aeditus_pro_m'].includes(lookup_key)) {
        return new Response(
          JSON.stringify({ error: 'Le code LAUNCH25 est uniquement valide pour les plans Starter et Pro' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
      
      // AMBASSADEURS49 only for Ambassadors
      if (finalPromotionCode === 'AMBASSADEURS49' && lookup_key !== 'aeditus_amb_m') {
        return new Response(
          JSON.stringify({ error: 'Le code AMBASSADEURS49 est uniquement valide pour le plan Ambassadeurs' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
      
      // Find promotion code in Stripe
      const promoCodes = await stripe.promotionCodes.list({
        code: finalPromotionCode,
        active: true,
        limit: 1,
      });
      
      if (promoCodes.data.length > 0) {
        sessionParams.discounts = [{
          promotion_code: promoCodes.data[0].id,
        }];
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Checkout creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});