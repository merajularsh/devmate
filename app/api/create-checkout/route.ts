import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    if (!secretKey.startsWith("sk_test_")) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is invalid - doesn't start with sk_test_" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
