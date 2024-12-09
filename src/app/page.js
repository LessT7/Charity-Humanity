"use client";
import { useState } from 'react';
import Gambar1 from '../../public/images/gambar2.jpg';
import { useRouter } from 'next/navigation';
import { loginWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordResetEmail } from '../../services/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';  // Import Firebase

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const router = useRouter();


  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign-In Successful:", user);
      router.push('/Home');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.log('The popup was closed before authentication was completed.');
        setError('Login with Google was cancelled. Please try again.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(email);
        setError(null);
        alert("Password reset email has been sent!");
        return;
      }
      if (isRegister) {
        const user = await registerWithEmailAndPassword(email, password);
        console.log("Registered:", user);
        setSuccess("Email Anda berhasil terdaftar. Silakan login.");
        setIsRegister(false);
      } else {
        const user = await loginWithEmailAndPassword(email, password);
        console.log("Logged in:", user);
        router.push('/Home');
        
      }
      setError(null);
    } catch (err) {
      console.error("Firebase Error:", err.code, err.message);
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100"
      style={{ backgroundImage: `url(${Gambar1.src})`, backgroundSize: 'cover' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-96 h-auto">
        <form onSubmit={handleSubmit} className="mt-4">
          <h2 className="text-3xl font-bold text-center">
            {isForgotPassword
              ? "Forgot Password"
              : isRegister
              ? "Register"
              : "Login"}
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!isForgotPassword && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            {isForgotPassword
              ? "Send Reset Link"
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600"
        >
          Sign in with Google
        </button>

        <div className="text-center mt-4">
          {!isForgotPassword && (
            <>
              <p
                className="text-sm text-blue-600 hover:underline cursor-pointer"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </p>
              <p
                className="text-sm text-gray-700 mt-2"
              >
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <span
                  className="text-blue-600 hover:underline cursor-pointer ml-1"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? "Login" : "Register"}
                </span>
              </p>
            </>
          )}
          {isForgotPassword && (
            <p
              className="text-sm text-blue-600 hover:underline cursor-pointer"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
