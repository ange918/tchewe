"use client";

import Link from "next/link";
import { SocialIcons } from "./SocialIcons";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

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
        <div className="flex items-center gap-8">
          <SocialIcons />
          <div className="h-6 w-px bg-[#C9A24D]/20 hidden md:block" />
          <button className="text-[#C9A24D] hover:text-[#E6C77A] transition-colors relative">
            <ShoppingBagIcon className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-[#C9A24D] text-[#0B0B0B] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
