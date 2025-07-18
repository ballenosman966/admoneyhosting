import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-green-700 px-4 py-12">
      {/* Go Back Button - fixed position */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-8 flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow text-white font-semibold hover:bg-white/20 transition z-50"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Go Back
      </button>
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12 flex flex-col items-center text-center">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-green-300 to-pink-400 bg-clip-text text-transparent">
            About CryptoRewards
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            CryptoRewards is building the future of decentralized earning. Our mission is to empower everyone to earn crypto effortlessly, securely, and globally—no matter your background or experience.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Our Mission</h2>
          <p className="text-white/80 max-w-xl mx-auto">
            We believe in financial inclusion and the power of blockchain to create new opportunities. By connecting users with innovative earning methods, we make crypto accessible, transparent, and rewarding for all.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Our Vision & Team</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-4">
            Our team is a diverse group of crypto enthusiasts, engineers, and designers passionate about Web3. We are committed to building a safe, user-friendly, and rewarding platform for the next generation of digital earners.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white/90 font-semibold shadow-lg">🌍 Global Team</div>
            <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white/90 font-semibold shadow-lg">🔒 Security First</div>
            <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white/90 font-semibold shadow-lg">🚀 Web3 Innovators</div>
          </div>
        </div>
      </div>
    </div>
  );
} 