import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-pastel-dark mb-4">About Us</h1>
        <div className="mb-6">
          <img
            src="public/sunibmakan.png"
            alt="Logo"
            className="mx-auto h-32 w-32 object-contain mb-4"
          />
        </div>
        <p className="text-xl text-justify text-pastel-dark max-w-screen-lg">
          <strong>SunibMakan</strong> adalah platform sekaligus forum untuk
          review makanan ataupun tempat makan di sekitar Universitas Bina
          Nusantara. Platform ini dibuat untuk memudahkan mahasiswa Universitas
          Bina Nusantara dalam mencari makanan yang lezat dan terjangkau di
          sekitar kampus. <strong>SunibMakan</strong> juga menjadi platform
          untuk promosi restoran maupun UMKM yang sedang berkembang. Mahasiswa
          yang sedang menjalankan kegiatan entrepreneur juga dapat melakukan
          promosi pada platform SunibMakan.
        </p>

        <div className="pt-10">
          <h1 className="text-2xl text-pastel-dark max-w-screen-xl">
            <strong>Tertarik untuk melakukan promosi?</strong>
          </h1>
          <div className="flex items-center justify-center mt-6">
            <a
              href="mailto:sunibmakan@gmail.com"
              className="bg-pastel-dark text-white px-6 py-2 rounded-md hover:bg-pastel-light transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
          <div className="flex items-center justify-center mt-6">
            <a
              href="https://instagram.com/sunibmakan"
              className="ml-4 text-pastel-dark hover:text-pastel-light transition-colors duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@sunibmakan?is_from_webapp=1&sender_device=pc"
              className="ml-4 text-pastel-dark hover:text-pastel-light transition-colors duration-300"
            >
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
