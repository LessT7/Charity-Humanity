"use client";
import React, { useState, useEffect } from "react";
import { signOutUser } from "../../../services/firebase";
import Image from "next/image";
// import Checkout from "../components/Checkout";
// import '../styles/globals.css'; 

export default function Home() {
  const handleSignOut = async () => {
    try {
      await signOutUser();
      alert("Berhasil keluar!");
      window.location.href = "/";
    } catch (error) {
      alert("Gagal keluar: " + error.message);
    }
  };

  const [eventList, setEventList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Tambahkan script Snap Midtrans
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_CLIENT; // Pastikan ini didefinisikan di .env
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    // Hapus script saat komponen dilepas
    return () => {
      document.body.removeChild(script);
      fetchEvents();
    };
  }, []);

  
  const handlePurchase = async (event) => {
    const data = {
      id: event.id || `event-${Date.now()}`, // Gunakan ID unik jika kosong
      productName: event.title || "Default Event Title",
      price: event.price || 10000, // Harga dari event
      quantity: 1,
    };

    console.log("Data to Send:", data); // Debugging data sebelum dikirim

    try {
      const response = await fetch("../api/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
      }

      const { token } = await response.json();
      console.log("Transaction Token:", token);

      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log("Payment success:", result);
          window.location.href = "/Home?status=success";
        },
        onPending: function (result) {
          console.log("Payment pending:", result);
          window.location.href = "/Home?status=pending";
        },
        onError: function (result) {
          console.error("Payment error:", result);
          alert("Terjadi kesalahan dalam pembayaran. Silakan coba lagi.");
        },
        onClose: function () {
          console.log("Payment popup closed");
        },
      });
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Terjadi kesalahan saat melakukan pembelian. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api"); // Memanggil endpoint API
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEventList(data.data); // Menyimpan data event
    } catch (error) {
      console.error(error);
      setError("Failed to load events. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-2xl font-bold text-gray-800">Humanity Charity</div>
          <nav className="space-x-6">
            <a href="#home" className="text-gray-600 hover:text-gray-800">
              Home
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-800">
              Tentang Kami
            </a>
            <a href="#programs" className="text-gray-600 hover:text-gray-800">
              Program
            </a>
            <a href="#news" className="text-gray-600 hover:text-gray-800">
              News
            </a>
            <a href="#donate" className="text-gray-600 hover:text-gray-800">
              Donasi
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <section
        id="home"
        className="bg-cover bg-center h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/gambar2.jpg')",
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bersama Kita Wujudkan Harapan
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Mari bergabung dalam aksi nyata untuk membantu mereka yang membutuhkan.
          </p>
          <button className="bg-green-500 text-white py-3 px-6 rounded text-lg font-medium hover:bg-green-600 transition" onClick={() => handlePurchase(event)}>Donasi Sekarang</button>
        </div>
      </section>

      <section
  id="about"
  className="py-16 bg-white text-gray-800"
>
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold mb-6">Tentang Kami</h2>
    <p className="text-lg leading-relaxed mb-4">
      Humanity Charity adalah sebuah organisasi nirlaba yang berdedikasi untuk menciptakan perubahan nyata bagi mereka yang membutuhkan. Didirikan dengan visi untuk menyebarkan kebaikan dan kasih sayang, kami percaya bahwa setiap orang berhak mendapatkan kehidupan yang layak, terlepas dari latar belakang, status sosial, atau kondisi ekonomi mereka. 
      Humanity Charity memiliki tujuan utama untuk mengumpulkan donasi dari berbagai lapisan masyarakat guna menyediakan bantuan bagi mereka yang berada dalam situasi sulit. Kami berkomitmen untuk memastikan bahwa setiap donasi yang diterima dikelola dengan transparan, digunakan secara efisien, dan benar-benar sampai ke tangan mereka yang membutuhkan.
    </p>
    <p className="text-lg leading-relaxed">
      Dengan dukungan para donatur, relawan, dan mitra kami, kami telah membantu ribuan keluarga dan individu untuk 
      mencapai kehidupan yang lebih baik. Mari bersama-sama kita bangun dunia yang lebih baik. Kami memahami bahwa kepercayaan adalah hal yang sangat penting dalam sebuah organisasi amal. 
      Oleh karena itu, kami selalu memastikan bahwa seluruh kegiatan dan penggunaan dana donasi dapat dipertanggungjawabkan. Humanity Charity secara rutin mempublikasikan laporan keuangan serta hasil dari program-program kami, sehingga para donatur dapat melihat dampak nyata dari kontribusi mereka.
    </p>
  </div>
</section>

<section
  id="programs"
  className="py-16 bg-white text-gray-800"
>
  <div className="container mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Program Kami</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
        <img src="/images/pendidikan.jpg" className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="text-green-500 text-4xl mb-4">

          <i className="fas fa-school"></i>
        </div>
        <h3 className="text-xl font-semibold mb-3">Pendidikan untuk Semua</h3>
        <p className="text-gray-600">
        Kami menyediakan akses pendidikan bagi anak-anak yang kurang mampu. Melalui program ini, 
        kami mendistribusikan perlengkapan sekolah, mendirikan pusat pembelajaran gratis, dan 
        memberikan beasiswa kepada siswa berprestasi yang berasal dari keluarga kurang mampu. 
        Dengan pendidikan, kami percaya bahwa generasi muda memiliki peluang lebih besar untuk keluar dari lingkaran kemiskinan dan mencapai cita-cita mereka.
        </p>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
      <img src="/images/makanan.jpeg" className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="text-green-500 text-4xl mb-4">
          <i className="fas fa-utensils"></i>
        </div>
        <h3 className="text-xl font-semibold mb-3">Makanan untuk Kehidupan</h3>
        <p className="text-gray-600">
        Humanity Charity aktif dalam menyediakan makanan sehat dan bergizi bagi keluarga yang mengalami kesulitan ekonomi. 
        Program ini tidak hanya mencakup distribusi bahan makanan pokok, tetapi juga edukasi mengenai pentingnya gizi seimbang bagi kesehatan keluarga.
        </p>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
      <img src="/images/gambar1.jpg" className="w-full h-64 object-cover rounded-lg mb-4" />
      
        <div className="text-green-500 text-4xl mb-4">
          <i className="fas fa-heartbeat"></i>
        </div>
        <h3 className="text-xl font-semibold mb-3">Layanan Kesehatan</h3>
        <p className="text-gray-600">
          Memberikan layanan kesehatan gratis dan pengobatan bagi masyarakat yang tidak mampu. 
          Banyak masyarakat yang tidak mampu mendapatkan layanan kesehatan dasar akibat keterbatasan biaya. Kami hadir untuk memberikan akses kesehatan gratis, 
          seperti pemeriksaan medis, pengobatan, hingga bantuan untuk operasi yang mendesak.
        </p>
      </div>
    </div>
  </div>
</section>

<section 
id="news"
className="py-16 bg-white text-gray-800"
>
<div className="bg-gray-100 min-h-screen py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex justify-center">
          Humanity Charity News List
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-12">
          {eventList?.map((event) => (
            <li
              key={event.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition w-[390px] mx-auto"
            >
              <Image
                src={event.image || "/placeholder.png"}
                alt={event.title || "Default Placeholder"}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
</section>


<section
  id="donate"
  className="py-16 bg-green-50 text-gray-800"
>
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">Donasi Sekarang</h2>
    <p className="text-lg leading-relaxed mb-8">
      Setiap kontribusi Anda, sekecil apa pun, memiliki dampak besar bagi mereka yang membutuhkan. 
      Bergabunglah dengan kami untuk menciptakan perubahan nyata.
    </p>

    <div className="flex flex-col md:flex-row justify-center items-center gap-6">

      <a
        href="#"
        className="bg-green-500 text-white py-3 px-6 rounded text-lg font-medium hover:bg-green-600 transition"
      >
        Donasi Sekarang
      </a>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">Transfer Bank</h3>
        <p className="text-gray-600">
          <strong>Bank:</strong> Masih Rahasia <br />
          <strong>Nomor Rekening:</strong> Masih Rahasia <br />
          <strong>Atas Nama:</strong> Masih Rahasia
        </p>
      </div>
    </div>

    <p className="text-sm text-gray-500 mt-8">
      Untuk informasi lebih lanjut, silakan hubungi kami melalui <a href="#contact" className="text-green-500 underline">kontak kami</a>.
    </p>
  </div>
</section>
<footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Humanity Charity Semua Hak Dilindungi.</p>
      </div>
    </footer>
    </div>
  );
}
