import { auth } from "../../../../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  // Validasi input
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Please fill in all fields" }),
      { status: 400 }
    );
  }

  try {
    // Login dengan Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Token Firebase (opsional jika Anda ingin memverifikasi token di backend)
    const token = await user.getIdToken();

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: { uid: user.uid, email: user.email },
        token, // Token Firebase
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 401 }
    );
  }
}
