import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Database {
  public: {
    Tables: {
      stripe_customers: {
        Row: { user_id: string; customer_id: string; created_at: string };
        Insert: { user_id: string; customer_id: string };
        Update: Partial<{ user_id: string; customer_id: string }>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          price_lookup_key: string | null;
          period_start: string | null;
          period_end: string | null;
          cancel_at_period_end: boolean;
          trial_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          status: string;
          price_lookup_key?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          cancel_at_period_end?: boolean;
          trial_end?: string | null;
        };
        Update: Partial<{
          status: string;
          price_lookup_key: string | null;
          period_start: string | null;
          period_end: string | null;
          cancel_at_period_end: boolean;
          trial_end: string | null;
        }>;
      };
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeWebhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('No stripe signature');
      return new Response('No stripe signature', { status: 400 });
    }

    // Import Stripe webhook verification
    const { Stripe } = await import('https://esm.sh/stripe@14.21.0');
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16',
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook signature verification failed', { status: 400 });
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const clientReferenceId = session.client_reference_id; // user_id

        if (clientReferenceId && customerId) {
          // Create/update stripe customer
          const { error: customerError } = await supabase
            .from('stripe_customers')
            .upsert(
              { user_id: clientReferenceId, customer_id: customerId },
              { onConflict: 'user_id' }
            );

          if (customerError) {
            console.error('Error upserting stripe customer:', customerError);
          }

          // If there's a subscription, fetch and store it
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
            
            const { error: subError } = await supabase
              .from('subscriptions')
              .upsert({
                id: subscription.id,
                user_id: clientReferenceId,
                status: subscription.status,
                price_lookup_key: price.lookup_key,
                period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
                trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              });

            if (subError) {
              console.error('Error upserting subscription:', subError);
            }
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        
        // Find user by customer ID
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('user_id')
          .eq('customer_id', subscription.customer)
          .single();

        if (customerData) {
          const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
          
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              id: subscription.id,
              user_id: customerData.user_id,
              status: subscription.status,
              price_lookup_key: price.lookup_key,
              period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            });

          if (error) {
            console.error('Error upserting subscription:', error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('id', subscription.id);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});