import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/Navbar";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALARWA | Le parfum qui parle pour vous",
  description: "Découvrez l'élégance de ALARWA, parfumerie de luxe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-white relative">
        <ClientLayoutWrapper>
          <Navbar />
          {children}
          <footer className="border-t border-neutral-800 bg-neutral-950 py-12 px-4">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-8 h-8 opacity-70">
                  <Image src="/logo.png" alt="ALARWA" fill className="object-cover" />
                </div>
                <span className="text-xl font-black tracking-tight text-neutral-300">ALARWA</span>
              </div>
              <p className="text-neutral-500 text-sm mb-6">Le parfum qui parle pour vous.</p>
              <div className="text-neutral-600 text-[10px] uppercase tracking-widest">
                &copy; {new Date().getFullYear()} ALARWA. Tous droits réservés.
              </div>
            </div>
          </footer>
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
