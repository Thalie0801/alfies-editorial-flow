import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SETUP-PROMO-CODES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Récupérer les coupons existants
    const coupons = await stripe.coupons.list();
    logStep("Fetched existing coupons", { count: coupons.data.length });

    // Trouver les coupons pour nos codes promo
    const launch25Coupon = coupons.data.find((c: any) => c.name === "LAUNCH25");
    const ambassadeur50Coupon = coupons.data.find((c: any) => c.name === "AMBASSADEUR50");

    logStep("Found coupons", { 
      launch25: !!launch25Coupon, 
      ambassadeur50: !!ambassadeur50Coupon 
    });

    const results = [];

    // Créer le code promo LAUNCH25 si le coupon existe
    if (launch25Coupon) {
      try {
        const promoCode = await stripe.promotionCodes.create({
          coupon: launch25Coupon.id,
          code: "LAUNCH25",
          active: true,
        });
        results.push({ code: "LAUNCH25", status: "created", id: promoCode.id });
        logStep("Created LAUNCH25 promotion code", { id: promoCode.id });
      } catch (error: any) {
        if (error.code === 'resource_already_exists') {
          results.push({ code: "LAUNCH25", status: "already_exists" });
          logStep("LAUNCH25 promotion code already exists");
        } else {
          throw error;
        }
      }
    }

    // Créer le code promo AMBASSADEUR50 si le coupon existe
    if (ambassadeur50Coupon) {
      try {
        const promoCode = await stripe.promotionCodes.create({
          coupon: ambassadeur50Coupon.id,
          code: "AMBASSADEUR50",
          active: true,
        });
        results.push({ code: "AMBASSADEUR50", status: "created", id: promoCode.id });
        logStep("Created AMBASSADEUR50 promotion code", { id: promoCode.id });
      } catch (error: any) {
        if (error.code === 'resource_already_exists') {
          results.push({ code: "AMBASSADEUR50", status: "already_exists" });
          logStep("AMBASSADEUR50 promotion code already exists");
        } else {
          throw error;
        }
      }
    }

    // Lister tous les codes promo existants pour vérification
    const existingPromoCodes = await stripe.promotionCodes.list({ limit: 10 });
    logStep("Existing promotion codes", { 
      codes: existingPromoCodes.data.map((pc: any) => ({ code: pc.code, active: pc.active }))
    });

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      existing_codes: existingPromoCodes.data.map((pc: any) => ({ 
        code: pc.code, 
        active: pc.active,
        coupon_name: pc.coupon.name 
      }))
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in setup-promo-codes", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});