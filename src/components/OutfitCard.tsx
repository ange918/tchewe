"use client";

import Link from "next/link";
import Image from "next/image";
import { Tenue } from "@/data/tenues";

interface OutfitCardProps {
  tenue: Tenue;
}

export function OutfitCard({ tenue }: OutfitCardProps) {
  return (
    <div className="group bg-[#0B0B0B] border border-[#C9A24D]/30 hover:border-[#C9A24D] transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(201,162,77,0.1)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 border border-[#C9A24D]/30 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-[#C9A24D]/50" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <p className="text-[#C9A24D]/50 text-xs tracking-widest uppercase">
              {tenue.name}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 text-center">
        <h3 className="font-serif text-[#E6C77A] text-lg tracking-[0.15em] uppercase mb-4">
          {tenue.name}
        </h3>
        <Link
          href={`/tenues/${tenue.slug}`}
          className="inline-block px-6 py-3 border border-[#C9A24D] text-[#C9A24D] text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#C9A24D] hover:text-[#0B0B0B]"
        >
          En savoir plus
        </Link>
      </div>
    </div>
  );
}
