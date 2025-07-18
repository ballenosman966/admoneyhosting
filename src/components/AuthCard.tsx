import React, { useState } from "react";
import { User, Eye, EyeOff, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userStorage } from "../utils/userStorage";

export default function AuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = userStorage.authenticateUser(username, password);
      userStorage.setCurrentUser(user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
      setShake(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      {/* Go Back Button - fixed position */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-8 flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow text-white font-semibold hover:bg-white/20 transition z-50"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Go Back
      </button>
      <div className="bg-gradient-to-br from-purple-800/80 to-purple-900/80 rounded-3xl p-6 sm:p-10 shadow-lg border border-white/10 relative w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-full font-semibold mr-2 transition ${
              mode === "login"
                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold ml-2 transition ${
              mode === "register"
                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {/* Form Section */}
        {mode === "login" ? (
          <>
            <div className="text-center mb-8">
              <span className="inline-block bg-yellow-600/80 text-yellow-100 font-semibold px-5 py-2 rounded-full mb-4">
                $ Start Earning USDT
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white/80">Sign in to continue earning</p>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <label className="block text-white font-semibold mb-2">Username</label>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-white/80">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-yellow-300 hover:underline text-sm">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-lg shadow hover:from-yellow-500 hover:to-orange-500 transition${shake ? ' shake-horizontal' : ''}`}
                onAnimationEnd={() => setShake(false)}
              >
                Sign In
              </button>
            </form>
            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center text-white/80 text-sm">
              <ShieldCheck className="w-5 h-5 text-green-400 mr-2" />
              Your data is protected with bank-level security. We never share your personal information.
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="inline-block bg-yellow-600/80 text-yellow-100 font-semibold px-5 py-2 rounded-full mb-4">
                $ Start Earning USDT
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-white/80">Sign up to start earning crypto rewards</p>
            </div>
            <form>
              <label className="block text-white font-semibold mb-2">Username</label>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <label className="block text-white font-semibold mb-2">Confirm Password</label>
              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-lg shadow hover:from-yellow-500 hover:to-orange-500 transition"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center text-white/80 text-sm">
              <ShieldCheck className="w-5 h-5 text-green-400 mr-2" />
              Your data is protected with bank-level security. We never share your personal information.
            </div>
          </>
        )}
      </div>
    </div>
  );
} 