"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // 🔁 If already logged in, go straight to app
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/home");
    }
  }, [isLoaded, isSignedIn, router]);

  // ⏳ Prevent flicker while Clerk loads
  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
          Contextly
        </h1>

        <p className="text-zinc-400 mb-8">
          Ask questions. Get answers. From your own knowledge.
        </p>

        {/* Show buttons ONLY if user is logged out */}
        {!isSignedIn && (
          <div className="flex justify-center gap-4">
            <Link
              href="/sign-in"
              className="px-6 py-3 rounded-xl bg-orange-500 text-black font-medium hover:bg-orange-400 transition"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-200 hover:border-orange-400 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
