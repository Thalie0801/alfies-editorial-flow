import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&dts";

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

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Unauthorized: invalid user token', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    console.log('Checking subscription for user:', user.email);

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      console.log('No customer found in Stripe');
      return new Response(
        JSON.stringify({ 
          hasActiveSubscription: false,
          subscription: null,
          message: 'No customer found'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const customerId = customers.data[0].id;
    console.log('Found customer:', customerId);

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
    });

    console.log('Found subscriptions:', subscriptions.data.length);
    console.log('Subscriptions details:', subscriptions.data.map((sub) => ({
      id: sub.id,
      status: sub.status,
      current_period_end: sub.current_period_end
    })));

    // Find active or trialing subscription
    const activeSubscription = subscriptions.data.find((sub) =>
      ['active', 'trialing'].includes(sub.status)
    );

    if (!activeSubscription) {
      console.log('No active subscription found');
      return new Response(
        JSON.stringify({ 
          hasActiveSubscription: false,
          subscription: null,
          allSubscriptions: subscriptions.data.map((sub) => ({
            id: sub.id,
            status: sub.status,
            current_period_end: sub.current_period_end
          }))
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log('Active subscription found:', activeSubscription.id, activeSubscription.status);

    // Get the price lookup key
    const priceId = activeSubscription.items.data[0]?.price?.id;
    let lookupKey = null;
    
    if (priceId) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        lookupKey = price.lookup_key;
      } catch (error) {
        console.log('Could not get price lookup key:', error);
      }
    }

    // Sync to local database
    try {
      const subscriptionData = {
        id: activeSubscription.id,
        user_id: user.id,
        status: activeSubscription.status,
        price_lookup_key: lookupKey,
        period_start: activeSubscription.current_period_start ? new Date(activeSubscription.current_period_start * 1000).toISOString() : null,
        period_end: activeSubscription.current_period_end ? new Date(activeSubscription.current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: activeSubscription.cancel_at_period_end || false,
        trial_end: activeSubscription.trial_end ? new Date(activeSubscription.trial_end * 1000).toISOString() : null,
        addons: [], // TODO: Handle addons if needed
      };

      // Upsert subscription to local database
      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error('Error upserting subscription:', upsertError);
      } else {
        console.log('Subscription synced to database');
      }
    } catch (syncError) {
      console.error('Error syncing subscription:', syncError);
    }

    return new Response(
      JSON.stringify({ 
        hasActiveSubscription: true,
        subscription: {
          id: activeSubscription.id,
          status: activeSubscription.status,
          price_lookup_key: lookupKey,
          period_end: activeSubscription.current_period_end ? new Date(activeSubscription.current_period_end * 1000).toISOString() : null,
          trial_end: activeSubscription.trial_end ? new Date(activeSubscription.trial_end * 1000).toISOString() : null,
          cancel_at_period_end: activeSubscription.cancel_at_period_end || false,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Subscription check error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check subscription' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});