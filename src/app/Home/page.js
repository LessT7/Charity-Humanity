"use client";
import React from "react";
import { signOutUser } from "../../../services/firebase";
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

  return (
    <div>
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
            <a href="#donate" className="text-gray-600 hover:text-gray-800">
              Donasi
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-800">
              Hubungi Kami
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <a
              href="#donate"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Donasi Sekarang
            </a>
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
          <a
            href="#donate"
            className="bg-green-500 text-white py-3 px-6 rounded text-lg hover:bg-green-600"
          >
            Donasi Sekarang
          </a>
        </div>
      </section>

      <section
  id="about"
  className="py-16 bg-white text-gray-800"
>
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold mb-6">Tentang Kami</h2>
    <p className="text-lg leading-relaxed mb-4">
      Humanity Charity adalah organisasi yang berfokus pada membantu komunitas yang membutuhkan dengan memberikan akses 
      ke pendidikan, makanan, dan kesehatan. Kami percaya bahwa kebersamaan dapat membawa perubahan besar untuk masa depan.
    </p>
    <p className="text-lg leading-relaxed">
      Dengan dukungan para donatur, relawan, dan mitra kami, kami telah membantu ribuan keluarga dan individu untuk 
      mencapai kehidupan yang lebih baik. Mari bersama-sama kita bangun dunia yang lebih baik.
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
        <div className="text-green-500 text-4xl mb-4">

          <i className="fas fa-school"></i>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">Pendidikan untuk Semua</h3>
        <p className="text-gray-600">
          Memberikan akses pendidikan gratis untuk anak-anak yang kurang mampu, 
          membantu mereka mencapai cita-cita.
        </p>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
        <div className="text-green-500 text-4xl mb-4">
          <i className="fas fa-utensils"></i>
        </div>
        <h3 className="text-xl font-semibold mb-3">Makanan untuk Kehidupan</h3>
        <p className="text-gray-600">
          Menyediakan makanan sehat dan bergizi bagi keluarga yang membutuhkan, 
          terutama di wilayah terdampak bencana.
        </p>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
        <div className="text-green-500 text-4xl mb-4">
          <i className="fas fa-heartbeat"></i>
        </div>
        <h3 className="text-xl font-semibold mb-3">Layanan Kesehatan</h3>
        <p className="text-gray-600">
          Memberikan layanan kesehatan gratis dan pengobatan bagi masyarakat yang tidak mampu.
        </p>
      </div>
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
