import { tenues, getTenueBySlug, getAllSlugs } from "@/data/tenues";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenue = getTenueBySlug(slug);
  
  if (!tenue) {
    return {
      title: "Tenue non trouvée — TCHÉ WÊ",
    };
  }
  
  return {
    title: `${tenue.name} — Collection AFFIN | TCHÉ WÊ`,
    description: tenue.description,
  };
}

export default async function TenueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenue = getTenueBySlug(slug);
  
  if (!tenue) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <section className="relative">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-[#1a1a1a] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 border border-[#C9A24D]/30 flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-[#C9A24D]/50" 
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
              <p className="text-[#C9A24D]/50 text-sm tracking-widest uppercase">
                {tenue.name}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/#collection"
            className="inline-flex items-center text-[#C9A24D] text-xs tracking-[0.2em] uppercase hover:text-[#E6C77A] transition-colors mb-12"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la collection
          </Link>

          <h1 className="font-serif text-[#E6C77A] text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] uppercase mb-8">
            {tenue.name}
          </h1>
          
          <div className="gold-separator mb-12" style={{ margin: '0 0 3rem 0' }} />

          <p className="text-[#B5B5B5] text-lg leading-relaxed mb-16">
            {tenue.description}
          </p>

          <div className="border-t border-[#C9A24D]/20 pt-12">
            <h2 className="font-serif text-[#C9A24D] text-xl tracking-[0.1em] uppercase mb-8">
              Matières utilisées
            </h2>
            <ul className="space-y-4">
              {tenue.materials.map((material, index) => (
                <li 
                  key={index}
                  className="flex items-start text-[#B5B5B5]"
                >
                  <span className="text-[#C9A24D] mr-4 mt-1">—</span>
                  <span className="italic">{material}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 pt-12 border-t border-[#C9A24D]/20">
            <Link 
              href="/#collection"
              className="inline-block px-8 py-4 border border-[#C9A24D] text-[#C9A24D] text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#C9A24D] hover:text-[#0B0B0B]"
            >
              Découvrir les autres tenues
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
