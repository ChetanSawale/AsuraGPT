import React, { useState } from "react";
import { Link } from "react-router-dom";

// Subtle Minimalist SVG Icons
const ArrowUpRight = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 11.5L11.5 4.5" />
    <path d="M5 4.5H11.5V11" />
  </svg>
);

const SparkleMinimal = (props) => (
  <svg {...props} width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z" />
  </svg>
);

export default function Landing() {
  const [activeTab, setActiveTab] = useState("memory");

  return (
    <div className="min-h-screen bg-[#09090b] text-[#ececee] selection:bg-zinc-800 selection:text-white font-sans antialiased relative overflow-hidden">
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center text-[#09090b] font-mono text-xs font-bold transition-transform group-hover:rotate-6">
              A
            </div>
            <span className="font-semibold tracking-tight text-sm text-zinc-200 group-hover:text-white transition-colors">
              Asura<span className="text-zinc-400 font-normal">GPT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-200 transition-colors">Architecture</a>
            <a href="#memory" className="hover:text-zinc-200 transition-colors">Vector Memory</a>
            <a href="#models" className="hover:text-zinc-200 transition-colors">Engine</a>
          </nav>

          <div className="flex items-center gap-3 text-xs font-medium">
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-md bg-zinc-100 text-[#09090b] font-medium hover:bg-white transition-all shadow-sm flex items-center gap-1.5"
            >
              Open Workspace
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 max-w-5xl mx-auto px-6">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[11px] font-mono text-zinc-400">
            <SparkleMinimal className="text-emerald-400" />
            <span>v2.0 • Persistent RAG Memory Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-zinc-100 leading-[1.08]">
            Thoughtful dialogue, <br />
            <span className="text-zinc-400 italic font-serif">backed by memory.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal max-w-xl">
            A minimalist conversational interface built with vector indexing, sub-second model cascades, and clean editorial design.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/chat"
              className="px-6 py-3 rounded-lg bg-zinc-100 text-[#09090b] font-medium hover:bg-white transition-all flex items-center gap-2 text-sm shadow-md"
            >
              Start Conversation
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 text-zinc-300 font-medium transition-all text-sm"
            >
              Sign In to History
            </Link>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE SHOWCASE --- */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden shadow-2xl backdrop-blur-sm">
          {/* Top Bar */}
          <div className="px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/50 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span>asuragpt.engine / active-session</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-500">
              <button
                onClick={() => setActiveTab("memory")}
                className={`transition-colors ${activeTab === "memory" ? "text-zinc-200 underline underline-offset-4" : "hover:text-zinc-400"}`}
              >
                Vector Context
              </button>
              <button
                onClick={() => setActiveTab("cascade")}
                className={`transition-colors ${activeTab === "cascade" ? "text-zinc-200 underline underline-offset-4" : "hover:text-zinc-400"}`}
              >
                Model Cascade
              </button>
            </div>
          </div>

          {/* Interactive Content Box */}
          <div className="p-6 md:p-8 space-y-6 font-mono text-xs leading-relaxed">
            {activeTab === "memory" ? (
              <div className="space-y-4">
                <div className="text-zinc-500">// Pinecone Vector Retrieval (768D Embedding)</div>
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/60 text-zinc-300 space-y-2">
                  <div className="text-emerald-400 font-sans font-semibold text-sm">Query Context Matched:</div>
                  <p className="text-zinc-400 font-sans text-xs">
                    "User prefers concise executive summaries, dark mode typography, and structural code refactoring over superficial patches."
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/40 text-zinc-200 max-w-lg font-sans text-sm">
                    How should we structure the architecture documentation?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 max-w-xl font-sans text-sm leading-normal">
                    Based on your workspace preferences, here is a 3-part clean architectural overview...
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-zinc-500">// High-Availability Model Cascade Protocol</div>
                <div className="grid sm:grid-cols-3 gap-3 font-sans">
                  <div className="p-3 rounded border border-emerald-500/30 bg-emerald-500/5">
                    <div className="text-xs text-emerald-400 font-mono">Primary</div>
                    <div className="text-sm font-medium text-zinc-200">Gemini 3.8-Flash</div>
                    <div className="text-[11px] text-zinc-500 mt-1">Status: Active</div>
                  </div>
                  <div className="p-3 rounded border border-zinc-800 bg-zinc-950">
                    <div className="text-xs text-zinc-500 font-mono">Standby 1</div>
                    <div className="text-sm font-medium text-zinc-300">Gemini 3.7-Flash</div>
                    <div className="text-[11px] text-zinc-500 mt-1">Status: Ready</div>
                  </div>
                  <div className="p-3 rounded border border-zinc-800 bg-zinc-950">
                    <div className="text-xs text-zinc-500 font-mono">Standby 2</div>
                    <div className="text-sm font-medium text-zinc-300">Gemini 3.6-Flash</div>
                    <div className="text-[11px] text-zinc-500 mt-1">Status: Ready</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- EDITORIAL PHILOSOPHY --- */}
      <section id="features" className="py-24 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Design Philosophy</span>
              <h2 className="text-2xl font-medium text-zinc-100 tracking-tight">
                Crafted for clarity, stripped of noise.
              </h2>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-8 text-sm text-zinc-400 font-normal leading-relaxed">
              <div>
                <h3 className="text-zinc-200 font-medium mb-2 text-base">Persistent Context</h3>
                <p>
                  Every session indexes conversations in real-time. Return days later and pick up right where your thoughts left off.
                </p>
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium mb-2 text-base">Resilient Engine</h3>
                <p>
                  Automatic failover cascades prevent 503 capacity errors, keeping your workflow uninterrupted during peak AI traffic.
                </p>
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium mb-2 text-base">Instant Summaries</h3>
                <p>
                  Condense complex technical discussions into concise, actionable takeaways with a single click.
                </p>
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium mb-2 text-base">Private & Direct</h3>
                <p>
                  HTTP-only cookie auth and end-to-end token verification protect your conversation data from unauthenticated access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA / FOOTER --- */}
      <footer className="py-20 border-t border-zinc-800/40 bg-zinc-950/40">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-medium text-zinc-100 tracking-tight">Experience AsuraGPT today.</h3>
            <p className="text-xs text-zinc-500 mt-1">No setup required. Jump straight into conversation.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-md bg-zinc-100 text-[#09090b] font-medium text-xs hover:bg-white transition-all shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/chat"
              className="px-5 py-2.5 rounded-md border border-zinc-800 text-zinc-300 font-medium text-xs hover:border-zinc-700 transition-all"
            >
              Launch Chat
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-600 font-mono">
          <span>© {new Date().getFullYear()} AsuraGPT</span>
          <span>Crafted with Precision</span>
        </div>
      </footer>
    </div>
  );
}
