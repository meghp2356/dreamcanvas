"use client";

import React from "react";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { openSignIn, openSignUp, signOut, user } = useClerk();
  const route = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-800 text-white font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Dreamboard
            </span>
          </div>
          <span className="text-sm text-gray-400">
            Visualize. Plan. Create.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm hover:text-indigo-300 transition">
            Features
          </a>
          <a href="#" className="text-sm hover:text-indigo-300 transition">
            Pricing
          </a>
          <a href="#" className="text-sm hover:text-indigo-300 transition">
            FAQ
          </a>
          <div className="flex gap-3">
            {user?.id ? (
              <button
                className="text-sm px-4 py-2 rounded-full border border-indigo-500 hover:bg-indigo-500/20 transition"
                onClick={() => {
                  signOut();
                }}
              >
                Log Out
              </button>
            ) : (
              <button
                className="text-sm px-4 py-2 rounded-full border border-indigo-500 hover:bg-indigo-500/20 transition"
                onClick={() => {
                  openSignIn({ signInUrl: "/dashboard" });
                }}
              >
                Log in
              </button>
            )}
            {user?.id ? (
              <button
                className="text-sm px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 font-semibold transition"
                onClick={() => {
                  route.push("/dashboard");
                }}
              >
                DashBoard
              </button>
            ) : (
              <button
                className="text-sm px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 font-semibold transition"
                onClick={() => {
                  openSignUp({ signInFallbackRedirectUrl: "/dashboard" });
                }}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row gap-12 items-center">
          {/* Text */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-bold leading-tight"
            >
              Capture your ideas, craft your vision.
              <br />
              <span className="text-indigo-400">Dreamboard</span> makes it real.
            </motion.h1>
            <p className="mt-6 text-lg text-gray-300 max-w-prose">
              A hybrid canvas and note workspace to brainstorm, sketch, and keep
              every spark of inspiration organized — all in one dark, elegant
              interface.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-400 font-semibold shadow-lg transition">
                Start Dreaming (Free)
              </button>
              <button className="px-6 py-3 rounded-full border border-gray-600 hover:border-indigo-400 transition text-sm">
                See Demo
              </button>
            </div>
          </div>

          {/* Illustration / mockup */}
          <div className="flex-1 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-700 bg-gradient-to-br from-neutral-800 to-slate-800">
              <div className="p-6">
                <div className="bg-neutral-900 rounded-xl p-4 flex flex-col gap-4">
                  <div className="h-2 w-24 bg-indigo-500 rounded-full" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-40 bg-slate-800 rounded-lg flex items-center justify-center text-sm text-gray-400">
                    {/* placeholder for app screenshot */}
                    Dreamboard Canvas + Notes Preview
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-3 bg-gray-700 rounded" />
                    <div className="flex-1 h-3 bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
            {/* subtle glow */}
            <div className="pointer-events-none absolute inset-0 blur-3xl mix-blend-overlay" />
          </div>
        </div>
        {/* Decorative wave */}
        <div className="mt-10">
          <svg
            viewBox="0 0 1440 80"
            className="w-full block"
            preserveAspectRatio="none"
          >
            <path
              fill="rgba(15,23,42,0.8)"
              d="M0,32L48,48C96,64,192,96,288,101.3C384,107,480,85,576,74.7C672,64,768,64,864,74.7C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"
            ></path>
          </svg>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Why Dreamboard?</h2>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
            Merge visual thinking and notes seamlessly. Designed for creators,
            planners, and dreamers who want focus without clutter.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          <FeatureCard
            title="Infinite Canvas"
            desc="Sketch, drag, and organize ideas with no boundaries. Your thoughts flow freely."
            emoji="🖼️"
          />
          <FeatureCard
            title="Quick Notes"
            desc="Jot down insights, to-dos, and reminders beside your visuals without losing context."
            emoji="✍️"
          />
          <FeatureCard
            title="Dark Mode First"
            desc="Gentle on eyes, bold in contrast. Designed for late-night creators and thinkers."
            emoji="🌙"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-800/60 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">How it works</h2>
            <p className="mt-2 text-gray-300">
              Get started in three simple steps.
            </p>
          </div>
          <div className="grid gap-10 grid-cols-1 md:grid-cols-3">
            <StepCard
              step="1"
              title="Create a Dreamboard"
              desc="Open your canvas and start sketching ideas visually. No constraints."
            />
            <StepCard
              step="2"
              title="Add Context"
              desc="Attach notes, thoughts, and todos to parts of your board. Keep everything linked."
            />
            <StepCard
              step="3"
              title="Refine & Share"
              desc="Edit seamlessly, organize, and export or collaborate whenever you're ready."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ scale: 0.97, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-1"
        >
          <div className="bg-slate-900 rounded-3xl px-10 py-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-2">
              Ready to build your dreams?
            </h3>
            <p className="text-gray-300 mb-6">
              Sign up now and keep all your ideas in one fluid space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-7 py-3 rounded-full bg-indigo-500 hover:bg-indigo-400 font-semibold transition">
                Get Started Free
              </button>
              <button className="px-7 py-3 rounded-full border border-gray-600 hover:border-indigo-400 transition">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-black via-slate-900 to-transparent pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="text-xl font-bold mb-2">Dreamboard</div>
            <p className="text-gray-400">
              The place where ideas breathe. Visual & written in harmony.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">Product</div>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-indigo-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-300">
                  Docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Community</div>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-indigo-300">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-300">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-300">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Dreamboard. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  emoji,
}: {
  title: string;
  desc: string;
  emoji: string;
}) {
  return (
    <div className="bg-gradient-to-br from-neutral-800 to-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4 shadow-md hover:shadow-lg transition">
      <div className="text-3xl">{emoji}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-300 flex-grow">{desc}</p>
      <div>
        <span className="text-indigo-400 font-medium">Learn more →</span>
      </div>
    </div>
  );
}

function StepCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5 items-start bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500 font-bold">
          {step}
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-gray-300 mt-1">{desc}</p>
      </div>
    </div>
  );
}
