import midtransClient from "midtrans-client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, productName, price, quantity } = req.body;

  // Konfigurasi Midtrans Snap Client
  const snap = new midtransClient.Snap({
    isProduction: false, // Gunakan true jika di production
    serverKey: process.env.NEXT_PUBLIC_SECRET, // Ambil dari .env
  });

  const transactionDetails = {
    order_id: `order-${id}-${Date.now()}`,
    gross_amount: price * quantity,
  };

  const parameter = {
    transaction_details: transactionDetails,
    item_details: [
      {
        id,
        price,
        quantity,
        name: productName,
      },
    ],
    customer_details: {
      first_name: "User", // Ganti sesuai data user
      email: "user@example.com", // Ganti sesuai data user
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    console.error("Midtrans error:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
}