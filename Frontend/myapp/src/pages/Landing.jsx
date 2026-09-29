import React from "react";
import { Link } from "react-router-dom";

// --- SVG ICONS ---
const BotIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);

const SparklesIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

const MemoryIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h6" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);

const ZapIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ArrowRightIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <BotIcon className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Asura<span className="text-indigo-500">GPT</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="relative group px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-cyan-500/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-md mb-8 shadow-inner">
            <SparklesIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold tracking-wide uppercase text-zinc-300">
              Powered by Multi-Model AI & Pinecone RAG Memory
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
            Conversational Intelligence <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
              Reimagined with Memory.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Experience sub-second AI responses, persistent conversation memory, and automated chat summaries. Designed for professionals and creators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-semibold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 text-base"
            >
              Launch AsuraGPT
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 font-semibold flex items-center justify-center transition-all hover:scale-105 text-base"
            >
              Sign In to Account
            </Link>
          </div>
        </div>

        {/* --- APP MOCKUP PREVIEW --- */}
        <div className="max-w-5xl mx-auto px-6 mt-16 relative z-10">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 md:p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-zinc-500 font-mono ml-2">asuragpt.internal.app</span>
            </div>

            <div className="bg-black/90 rounded-xl p-6 border border-zinc-800/80 space-y-4">
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-none text-sm max-w-md">
                  Can you recall our previous project guidelines and summarize key takeaways?
                </div>
              </div>

              <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <BotIcon className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-800 text-zinc-200 px-4 py-3 rounded-2xl rounded-bl-none text-sm max-w-lg leading-relaxed border border-zinc-700/50">
                  ✨ <strong>RAG Memory Matched:</strong> Using context retrieved from your past conversations:
                  <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-300">
                    <li>Maintain strict API validation across endpoints</li>
                    <li>Ensure 100% uptime with model fallback fallback cascades</li>
                    <li>Utilize persistent vector storage for seamless retrieval</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-zinc-950/60 border-t border-b border-zinc-900 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Engineered for Speed & Precision
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Built on modern fullstack architecture with intelligent vector retrieval and instant Socket streaming.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-indigo-500/50 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <MemoryIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Long-Term RAG Memory</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Integrated Pinecone vector index ensures AsuraGPT remembers past interactions across sessions.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-indigo-500/50 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <ZapIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Model Fallback Cascade</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Zero downtime with automatic model failovers across Gemini 3.8-flash, 3.7-flash, and 3.6-flash.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-indigo-500/50 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <ShieldIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                HTTP-only cookie authentication, JWT token verification, and password encryption out of the box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 relative shadow-2xl">
            <div className="absolute inset-0 bg-indigo-600/10 blur-3xl rounded-3xl pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">
              Ready to Upgrade Your AI Experience?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto relative z-10">
              Start chatting immediately with intelligent RAG memory and real-time streaming.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 relative z-10"
            >
              Create Free Account
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-zinc-800/80 text-center text-zinc-500 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BotIcon className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-zinc-300">AsuraGPT</span>
          </div>
          <p>© {new Date().getFullYear()} AsuraGPT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
