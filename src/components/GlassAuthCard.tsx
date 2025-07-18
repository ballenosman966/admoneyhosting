import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function GlassAuthCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7b2ff2] to-[#f357a8]">
      <div className="relative w-full max-w-sm p-8 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-8">{mode === "login" ? "Login" : "Register"}</h2>
        <form className="w-full">
          <div className="mb-5 relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full py-3 pl-5 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
          <div className="mb-5 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full py-3 pl-5 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hidden" />
          </div>
          {mode === "register" && (
            <div className="mb-5 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full py-3 pl-5 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
            </div>
          )}
          <div className="flex items-center justify-between mb-6 text-white/80 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-purple-400" />
              Remember me
            </label>
            <a href="#" className="text-white/80 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-white/80 text-purple-700 font-bold text-lg shadow hover:bg-white transition"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="mt-8 text-white/80 text-center">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                className="text-white font-bold underline hover:text-purple-200"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-white font-bold underline hover:text-purple-200"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 