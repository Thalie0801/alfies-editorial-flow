import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const body = await req.json();
    const { lookup_key, promotion_code, success_url, cancel_url, addons } = body;
    logStep("Request body parsed", { lookup_key, promotion_code, addons });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No customer found, will create during checkout");
    }

    // Map lookup_key to price_id
    const priceMapping: { [key: string]: string } = {
      'aeditus_essential_m': 'price_1QQTCTRr5lOHcXj67Rjy6bAJ',
      'aeditus_starter_m': 'price_1QQTDBRr5lOHcXj6LzxQq4gx',
      'aeditus_pro_m': 'price_1QQTDVRr5lOHcXj6MqUgwUNN',
      'fynk_basic_m': 'price_1QQTDhRr5lOHcXj6W0xQ8OLX',
      'fynk_pro_m': 'price_1QQTDtRr5lOHcXj60kF6o0dZ'
    };

    const price_id = priceMapping[lookup_key];
    if (!price_id) {
      throw new Error(`Invalid lookup_key: ${lookup_key}`);
    }
    logStep("Price ID mapped", { lookup_key, price_id });

    // Build line items
    const line_items = [{ price: price_id, quantity: 1 }];

    // Add addons if provided
    if (addons && Array.isArray(addons)) {
      for (const addon of addons) {
        const addon_price_id = priceMapping[addon];
        if (addon_price_id) {
          line_items.push({ price: addon_price_id, quantity: 1 });
          logStep("Added addon", { addon, addon_price_id });
        }
      }
    }

    // Session parameters
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items,
      mode: "subscription",
      success_url: success_url || `${req.headers.get("origin")}/dashboard`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        lookup_key: lookup_key
      }
    };

    // Add trial for Essential plan
    if (lookup_key === 'aeditus_essential_m') {
      sessionParams.subscription_data = {
        trial_period_days: 7,
        metadata: {
          user_id: user.id,
          plan: 'essential'
        }
      };
      logStep("Added 7-day trial for Essential plan");
    }

    // Apply promotion code if provided
    if (promotion_code) {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: promotion_code,
          active: true,
          limit: 1
        });

        if (promotionCodes.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: promotionCodes.data[0].id }];
          logStep("Applied promotion code", { promotion_code });
        } else {
          logStep("Promotion code not found or inactive", { promotion_code });
        }
      } catch (promoError) {
        logStep("Error applying promotion code", { error: promoError });
      }
    }

    // Create checkout session
    logStep("Creating checkout session", sessionParams);
    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});