import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "TCHÉ WÊ — Collection AFFIN",
  description: "AFFIN est une collection née d'un dialogue entre héritage et modernité. Chaque tenue incarne une identité culturelle affirmée, traduite dans un langage contemporain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-[#0B0B0B] text-[#B5B5B5] antialiased" suppressHydrationWarning>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
