import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
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
    let user: any = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      if (token && token.split('.').length === 3) {
        try {
          logStep("Authorization header found");
          logStep("Authenticating user with token");
          const { data: userData } = await supabaseClient.auth.getUser(token);
          user = userData.user;
          if (user?.email) {
            logStep("User authenticated", { userId: user.id, email: user.email });
          } else {
            logStep("Token valid but no email on user; proceeding as guest");
            user = null;
          }
        } catch (e) {
          logStep("Invalid token; proceeding as guest");
          user = null;
        }
      } else {
        logStep("Auth header present but token is not a JWT; proceeding as guest");
      }
    } else {
      logStep("No auth header, proceeding as guest");
    }

    // Parse request body
    const body = (await req.json()) as {
      price_id: string;
      promotion_code?: string;
      success_url?: string;
      cancel_url?: string;
      addons?: string[];
    };
    const { price_id, promotion_code, success_url, cancel_url, addons } = body;
    logStep("Request body parsed", { price_id, promotion_code, addons });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists for authenticated user
    let customerId: string | undefined;
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing customer", { customerId });
      } else {
        logStep("No customer found, will create during checkout");
      }
    } else {
      logStep("Guest checkout - customer will be created by Stripe Checkout");
    }

    // Validate and normalize price_id (handle legacy IDs)
    const legacyPriceMap: Record<string, string> = {
      // Ambassadeur ancien prix 49,90€ -> nouveau 149€
      'price_1SBwTLJsCoQneASNfkAjlOD7': 'price_1SByRBJsCoQneASN8ouw2Zrt',
    };
    const normalized_price_id = legacyPriceMap[price_id] || price_id;

    // Validate price exists in Stripe
    try {
      await stripe.prices.retrieve(normalized_price_id);
      logStep("Price ID validated", { requested: price_id, normalized: normalized_price_id });
    } catch (error) {
      throw new Error(`Invalid price_id: ${price_id}`);
    }

    // Map addon names to price_ids if needed
    const addonPriceMapping: { [key: string]: string } = {
      'fynk_basic_m': 'price_1SBeXYJsCoQneASNGAQ2F6lf', // 29€
      'fynk_pro_m': 'price_1SBeXqJsCoQneASNOQzr6yja'  // 69€
    };

    // Build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: normalized_price_id, quantity: 1 }
    ];

    // Add addons if provided
    if (addons && Array.isArray(addons)) {
      for (const addon of addons) {
        const addon_price_id = addonPriceMapping[addon];
        if (addon_price_id) {
          line_items.push({ price: addon_price_id, quantity: 1 });
          logStep("Added addon", { addon, addon_price_id });
        }
      }
    }

    // Session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items,
      mode: "subscription",
      success_url: success_url || `${req.headers.get("origin")}/dashboard`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/`,
      allow_promotion_codes: true,
      metadata: {
        price_id: normalized_price_id,
        requested_price_id: price_id,
      },
    };

    if (user?.id) {
      sessionParams.client_reference_id = user.id;
      sessionParams.metadata = { ...sessionParams.metadata, user_id: user.id };
    }

    if (user?.email) {
      if (customerId) {
        sessionParams.customer = customerId;
      } else {
        sessionParams.customer_email = user.email;
      }
    }

    // Add trial for Essential plan
    const essentialPriceIds = new Set<string>([
      'price_1SBwSvJsCoQneASNaDNsm22b', // Essential mensuel (79€)
      'price_1SBeX0JsCoQneASNtGQ0LpIf'   // Ancien ID (compat)
    ]);
    if (essentialPriceIds.has(price_id)) {
      sessionParams.subscription_data = {
        trial_period_days: 7,
        metadata: {
          ...(user?.id ? { user_id: user.id } : {}),
          plan: 'essential'
        }
      };
      logStep("Added 7-day trial for Essential plan");
    }

    // Note: Avec allow_promotion_codes: true, l'utilisateur peut saisir le code sur Stripe
    // On ne peut pas combiner allow_promotion_codes avec discounts automatiques

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