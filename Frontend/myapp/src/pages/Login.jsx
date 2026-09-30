import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const ArrowUpRight = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 11.5L11.5 4.5" />
    <path d="M5 4.5H11.5V11" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await API.post("/api/auth/login", form);
      if (response.data?.token) {
        localStorage.setItem("asura_token", response.data.token);
      }
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#ececee] selection:bg-zinc-800 selection:text-white font-sans antialiased flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header Link */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center text-[#09090b] font-mono text-xs font-bold transition-transform group-hover:rotate-6">
            A
          </div>
          <span className="font-semibold tracking-tight text-sm text-zinc-200 group-hover:text-white transition-colors">
            Asura<span className="text-zinc-400 font-normal">GPT</span>
          </span>
        </Link>
      </div>

      <div className="w-full max-w-sm relative z-10 space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[11px] font-mono text-zinc-400">
            <span>Secure Authentication</span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-zinc-100">
            Welcome back.
          </h1>
          <p className="text-sm text-zinc-400 font-normal">
            Sign in to access your persistent chat memory and history.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="name@example.com"
              onChange={handleChange}
              className="w-full p-3 bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-lg text-zinc-100 placeholder-zinc-600 font-sans text-sm transition-all focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full p-3 bg-zinc-950 border border-zinc-800/80 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-lg text-zinc-100 placeholder-zinc-600 font-sans text-sm transition-all focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-zinc-100 text-[#09090b] font-medium hover:bg-white transition-all text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 mt-2"
          >
            {isLoading ? "Signing in..." : "Continue to Workspace"}
            {!isLoading && <ArrowUpRight className="w-4 h-4 opacity-70" />}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-zinc-200 underline underline-offset-4 hover:text-white transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
