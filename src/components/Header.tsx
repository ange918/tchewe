"use client";

import Link from "next/link";
import { SocialIcons } from "./SocialIcons";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B] border-b border-[#C9A24D]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-serif text-[#C9A24D] text-xl tracking-[0.3em] hover:text-[#E6C77A] transition-colors"
        >
          TCHÉ WÊ
        </Link>
        <SocialIcons />
      </div>
    </header>
  );
}
