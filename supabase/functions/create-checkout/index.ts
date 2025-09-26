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

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    // Get user from auth token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

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

    // Find the price by lookup_key
    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    });

    const price = prices.data[0];
    if (!price) {
      return new Response(
        JSON.stringify({ error: 'Price not found' }),
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
        price: price.id,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: success_url || `${req.headers.get('origin')}/app/dashboard`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/pricing`,
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

    // Add trial for Essential plan
    if (lookup_key === 'aeditus_essential_m') {
      sessionParams.subscription_data = {
        trial_period_days: 7,
        metadata: {
          user_id: user.id,
          lookup_key: lookup_key,
        },
      };
    }

    // Add promotion code if provided
    if (promotion_code) {
      // Find promotion code in Stripe
      const promoCodes = await stripe.promotionCodes.list({
        code: promotion_code,
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