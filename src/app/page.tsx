"use client";

import { tenues } from "@/data/tenues";
import { OutfitCard } from "@/components/OutfitCard";
import { SocialIcons } from "@/components/SocialIcons";
import { useState } from "react";

function HeroSection() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center texture-bg relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0B0B]/50 to-[#0B0B0B]" />
      <div className="relative z-10 text-center px-6 py-20">
        <p className="text-[#C9A24D] text-sm tracking-[0.4em] uppercase mb-8">
          TCHÉ WÊ
        </p>
        <h1 className="font-serif text-[#E6C77A] text-6xl md:text-8xl lg:text-9xl tracking-[0.2em] uppercase mb-8">
          AFFIN
        </h1>
        <div className="gold-separator" />
        <p className="text-[#B5B5B5] text-sm tracking-[0.3em] uppercase mt-8">
          Présenté par : TCHÉ WÊ
        </p>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-[#E6C77A] text-3xl md:text-4xl tracking-[0.1em] uppercase mb-4">
          À propos d'AFFIN
        </h2>
        <div className="gold-separator" />
        <div className="mt-12 space-y-6 text-[#B5B5B5] leading-relaxed">
          <p>
            AFFIN est une collection née d'un dialogue entre héritage et modernité.
          </p>
          <p>
            Chaque tenue incarne une identité culturelle affirmée, traduite dans un langage contemporain.
          </p>
          <p className="italic text-[#C9A24D]">
            AFFIN ne suit pas les tendances, elle affirme une vision.
          </p>
        </div>
        <div className="gold-separator mt-12" />
      </div>
    </section>
  );
}

function CollectionSection() {
  return (
    <section className="py-24 px-6" id="collection">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-[#E6C77A] text-3xl md:text-4xl tracking-[0.1em] uppercase mb-4">
            Les tenues
          </h2>
          <div className="gold-separator" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tenues.map((tenue) => (
            <OutfitCard key={tenue.slug} tenue={tenue} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [copied, setCopied] = useState(false);
  
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("contact@tchewe.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email");
    }
  };

  return (
    <section className="py-32 px-6 border-t border-[#C9A24D]/20" id="contact">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-[#E6C77A] text-3xl md:text-4xl tracking-[0.1em] uppercase mb-4">
            Contact
          </h2>
          <div className="gold-separator" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-[#C9A24D] text-xs tracking-[0.3em] uppercase mb-4">
              Téléphone
            </h3>
            <p className="text-[#B5B5B5]">+225 07 00 00 00 00</p>
            <p className="text-[#B5B5B5]">+225 05 00 00 00 00</p>
          </div>
          
          <div>
            <h3 className="text-[#C9A24D] text-xs tracking-[0.3em] uppercase mb-4">
              Email
            </h3>
            <button 
              onClick={handleCopyEmail}
              className="text-[#B5B5B5] hover:text-[#E6C77A] transition-colors cursor-pointer"
            >
              contact@tchewe.com
              <span className="block text-xs text-[#C9A24D]/60 mt-1">
                {copied ? "Copié !" : "Cliquez pour copier"}
              </span>
            </button>
          </div>
          
          <div>
            <h3 className="text-[#C9A24D] text-xs tracking-[0.3em] uppercase mb-4">
              Localisation
            </h3>
            <p className="text-[#B5B5B5]">Abidjan — Côte d'Ivoire</p>
          </div>
        </div>
        
        <div className="mt-16 flex justify-center">
          <SocialIcons size={24} />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CollectionSection />
      <ContactSection />
    </>
  );
}
