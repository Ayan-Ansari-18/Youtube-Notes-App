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

    const { plan } = await req.json();

    let amount = 0;
    if (plan === "PRO") {
      amount = 1200 * 100; // ₹1200 in paise
    } else if (plan === "ENTERPRISE") {
      amount = 4900 * 100; // ₹4900 in paise
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

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
