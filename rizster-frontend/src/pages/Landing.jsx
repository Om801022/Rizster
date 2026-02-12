import React from "react";

export default function Landing({ setShowAuth }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center flex-1 px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Connect. Share. Build.
        </h1>
        <p className="text-gray-400 max-w-xl mb-8">
          A modern social platform built for meaningful conversations and real interaction.
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
            Get Started
          </button>
          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
            Login
          </button>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-white text-black px-6 py-3 rounded-lg"
            >
            Get Started
        </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-neutral-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-3">Post & Share</h3>
            <p className="text-gray-400">
              Share your thoughts instantly with a clean and distraction-free interface.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Save Content</h3>
            <p className="text-gray-400">
              Bookmark posts and revisit your favorite content anytime.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Engage</h3>
            <p className="text-gray-400">
              Like, comment, and interact in real time with your community.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to join the conversation?
        </h2>
        <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
          Create Account
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-900 text-gray-400 text-center py-6 text-sm">
        © 2026 YourApp. All rights reserved.
      </footer>

    </div>
  );
}
