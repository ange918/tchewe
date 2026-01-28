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
          LE TCHĒ WÊ
        </p>
        <h1 className="font-serif text-[#E6C77A] text-6xl md:text-8xl lg:text-9xl tracking-[0.2em] uppercase mb-8">
          AFFĪN
        </h1>
        <div className="gold-separator" />
        <p className="text-[#B5B5B5] text-sm tracking-[0.3em] uppercase mt-8">
          Présenté par ANDYCHRIS
        </p>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-[#E6C77A] text-3xl md:text-4xl tracking-[0.1em] uppercase mb-4">
          Royauté Africaine & Modernité
        </h2>
        <div className="gold-separator" />
        <div className="mt-12 space-y-8 text-[#B5B5B5] leading-relaxed text-lg">
          <p>
            AFFĪN est une collection de costumes artistiques présentée par <span className="text-[#E6C77A]">ANDYCHRIS</span>, célébrant la royauté africaine aux couleurs de nos origines.
          </p>
          <p>
            Notre style incarne l'authenticité dans le luxe. Chaque pièce est conçue avec une fidélité de plus de 50% aux originaux, utilisant des matériaux typiquement africains, respectant les codes couleurs et intégrant des accessoires et symboles sacrés.
          </p>
          <p>
            L'objectif est de prouver que notre héritage peut être exploité dans le moderne sans paraître "old school", mais au contraire, être préservant et attachant. Nous voulons impacter le domaine socio-culturel en montrant que l'Afrique peut créer des costumes d'envergure hollywoodienne.
          </p>
          <p className="italic text-[#C9A24D] text-xl font-serif">
            "Le TCHĒ WÊ peut traverser des frontières avec toute sa valeur et son authenticité sans paraître vétuste ou dépassé. Il suffit de savoir l'adapter."
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
            La Collection
          </h2>
          <div className="gold-separator" />
          <p className="text-[#B5B5B5] mt-4 max-w-2xl mx-auto">
            Une trentaine de pièces d'exception où l'authenticité africaine rencontre le luxe contemporain.
          </p>
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
      await navigator.clipboard.writeText("contact@affin.com");
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
            Contactez l'Atelier
          </h2>
          <div className="gold-separator" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-[#C9A24D] text-xs tracking-[0.3em] uppercase mb-4">
              Service Client
            </h3>
            <p className="text-[#B5B5B5]">+225 07 00 00 00 00</p>
          </div>
          
          <div>
            <h3 className="text-[#C9A24D] text-xs tracking-[0.3em] uppercase mb-4">
              Email Professionnel
            </h3>
            <button 
              onClick={handleCopyEmail}
              className="text-[#B5B5B5] hover:text-[#E6C77A] transition-colors cursor-pointer"
            >
              contact@affin.com
              <span className="block text-xs text-[#C9A24D]/60 mt-1">
                {copied ? "Copié !" : "Cliquez pour copier"}
              </span>
            </button>
          </div>
          
          <div>
            <h3 className="text-[#C9A24D] text-xs tracking-[0.3em] uppercase mb-4">
              Atelier
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
