import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_PUBLIC_SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT,
});

export async function POST(req) {
  try {
    const { id, productName, price, quantity } = await req.json();

    if (!id || !productName || typeof price !== "number" || !quantity) {
      throw new Error("Missing or invalid parameters: id, productName, price, or quantity");
    }

    console.log("Incoming Request Data:", { id, productName, price, quantity });

    const parameter = {
      transaction_details: {
        order_id: `${id}-${Date.now()}`,
        gross_amount: price * quantity,
      },
      item_details: [
        {
          id,
          name: productName,
          price,
          quantity,
        },
      ],
      customer_details: {
        email: "customer@example.com",
        phone: "08123456789",
      },
    };

    const token = await snap.createTransactionToken(parameter);
    console.log("Generated Transaction Token:", token);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: "Failed to create transaction token: " + error.message }, { status: 500 });
  }
}