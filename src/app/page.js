"use client";
import { useState } from 'react';
import Gambar1 from '../../public/images/gambar2.jpg';
import { useRouter } from 'next/navigation';
import { loginWithEmailAndPassword } from '../../services/firebase';

export default function Login()  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const handleSubmit= async (e) => {
    e.preventDefault();
    try {
      const user = await loginWithEmailAndPassword(email, password);
      console.log("Logged in:", user);
      router.push('/Home');
      
    } catch (err) {
      console.error("Firebase Error:", err.code, err.message);
      setError("Login failed: " + err.message);
    }
    
    
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100"
      style={{ backgroundImage: `url(${Gambar1.src})`, backgroundSize: 'cover' }}>
      <div className="bg-white p-8 rounded-lg shadow-md w-96 h-96">
        <form onSubmit={handleSubmit} className="mt-4">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" >Kata Sandi</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Login</button>
        </form>
      </div>
    </div>
  );
}

