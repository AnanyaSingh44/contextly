"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useState } from "react";

import Sidebar from "@/app/components/Sidebar";
import ChatPanel from "@/app/components/ChatPanel";
import Navbar from "@/app/components/Navbar";

export default function HomePage() {
  const [activeSources, setActiveSources] = useState([]);
  const [status, setStatus] = useState("idle");

  return (
    <>
      {/* 🔒 Not logged in → sign in */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      {/* ✅ Logged in → app */}
      <SignedIn>
        <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col">
          <Navbar />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              activeSources={activeSources}
              setActiveSources={setActiveSources}
              status={status}
              setStatus={setStatus}
            />

            <ChatPanel
              activeSources={activeSources}
              status={status}
            />
          </div>
        </div>
      </SignedIn>
    </>
  );
}
