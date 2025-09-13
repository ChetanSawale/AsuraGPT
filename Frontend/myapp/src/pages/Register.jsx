import { useState } from "react";
import axios from 'axios'; // Import axios directly

// --- SVG Icon --- //
const BotIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg> );

export default function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "" // Added for confirmation
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Password confirmation check
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await axios.post("https://asuragpt-1.onrender.com/api/auth/register", {
        fullname: {
          firstname: form.firstname,
          lastname: form.lastname,
        },
        email: form.email,
        password: form.password,
      }, {
        withCredentials: true
      });
      window.location.href = "/login"; // go to login after success
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="inline-block bg-indigo-600 p-3 rounded-full mb-2">
                <BotIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-gray-400">Join the community and start chatting</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800/50 backdrop-blur-sm shadow-2xl p-8 rounded-2xl w-full"
        >
          {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="firstname">First Name</label>
                <input
                type="text"
                name="firstname"
                id="firstname"
                placeholder="John"
                onChange={handleChange}
                className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                />
            </div>
            <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="lastname">Last Name</label>
                <input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Doe"
                onChange={handleChange}
                className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

           <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-md hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <span 
              onClick={() => window.location.href = '/login'} 
              className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

