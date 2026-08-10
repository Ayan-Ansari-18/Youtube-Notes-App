import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
    });

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, isYearly } = await req.json();

    // Pricing matches the pricing page exactly
    const PRICES: Record<string, { monthly: number; yearly: number }> = {
      PRO:        { monthly: 1500, yearly: 1200 },
      ENTERPRISE: { monthly: 5900, yearly: 4900 },
    };

    if (!PRICES[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const pricePerMonth = isYearly ? PRICES[plan].yearly : PRICES[plan].monthly;
    const amount = pricePerMonth * 100; // Convert to paise

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${crypto.randomBytes(10).toString("hex")}`,
    };

    const order = await razorpay.orders.create(options);

    // Save transaction to database as PENDING
    await prisma.transaction.create({
      data: {
        userId,
        amount: order.amount as number,
        currency: order.currency,
        razorpayOrderId: order.id,
        plan: plan as "PRO" | "ENTERPRISE",
        status: "PENDING",
      },
    });

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
