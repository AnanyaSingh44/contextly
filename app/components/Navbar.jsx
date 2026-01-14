"use client";

import { Search, Settings, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";


export default function Navbar() {
  return (
    <header className="sticky top-4 z-50 mx-4 rounded-2xl 
      bg-zinc-950/70 backdrop-blur-xl 
      border border-zinc-800/60 
      shadow-[0_8px_30px_rgba(0,0,0,0.6)]
      flex items-center justify-between px-6 py-3.5">

      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl 
          bg-gradient-to-br from-orange-500/20 to-orange-600/10 
          border border-orange-400/30
          shadow-[0_0_20px_rgba(251,146,60,0.15)]">
          <Sparkles className="w-5 h-5 text-orange-400" />
        </div>

      
      </div>

      {/* Center - Brand Name */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 
          bg-clip-text text-transparent
          tracking-tight
          drop-shadow-[0_0_10px_rgba(251,146,60,0.3)]">
          Contextly
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
     

        {/* Avatar */}
     <UserButton
  afterSignOutUrl="/sign-in"
  appearance={{
    elements: {
      avatarBox:
        "w-10 h-10 rounded-full border border-orange-400/30 shadow-[0_0_15px_rgba(251,146,60,0.2)]",
    },
  }}
/>

      </div>

    </header>
  );
}