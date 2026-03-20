import Image from "next/image";
import Link from "next/link";
import BestSellers from "../components/BestSellers";
import Catalog from "../components/Catalog";
import TranslatedText from "../components/TranslatedText";

async function getParfums() {
  const res = await fetch("http://localhost:5000/api/parfums", {
    cache: "no-store", // to ensure fresh data
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

interface ParfumType {
  _id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  stock: number;
  description: string;
}

export default async function Home() {
  const parfums: ParfumType[] = await getParfums();

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-20">
      {/* Modern & Artistic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background visual element */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
          <Image 
            src="/images/hero.png" 
            alt="Luxury Perfume" 
            fill 
            className="object-cover object-right opacity-60 scale-105 animate-pulse-slow font-serif" 
            priority
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-20 flex flex-col lg:flex-row items-center gap-12">
          {/* Main Hero Content */}
          <div className="flex-1 lg:max-w-2xl">
            <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-1000">
              <span className="h-px w-12 bg-amber-500/50"></span>
              <span className="text-[10px] uppercase tracking-[0.6em] text-amber-500 font-black">
                <TranslatedText tKey="home.since" />
              </span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-500 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
              <TranslatedText tKey="home.title" />
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-xl font-medium leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
              <TranslatedText tKey="home.subtitle" />
            </p>

            <div className="flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <Link 
                href="/catalog" 
                className="group relative px-10 py-5 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.3em] overflow-hidden transition-all hover:pr-14"
              >
                <span className="relative z-10"><TranslatedText tKey="home.ctaPrimary" /></span>
                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all text-lg">→</span>
              </Link>
            </div>
          </div>

          {/* Integrated Best Sellers Preview (Artistic Sidebar) */}
          <div className="w-full lg:w-80 flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-700">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 rotate-180 [writing-mode:vertical-lr]">Best Sellers</h2>
              <div className="flex flex-col gap-6 flex-1">
                {parfums.slice(0, 3).map((parfum, i) => (
                  <Link 
                    key={parfum._id} 
                    href={`/parfum/${parfum._id}`}
                    className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-md p-4 border border-white/5 hover:border-amber-500/30 transition-all rounded-xl"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-900">
                      <Image src={parfum.image} alt={parfum.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 truncate">{parfum.brand}</h4>
                      <h3 className="text-sm font-bold text-white tracking-tight truncate">{parfum.name}</h3>
                      <p className="text-[10px] font-medium text-neutral-500 mt-1">{parfum.price} MAD</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-30">
          <span className="text-[8px] uppercase tracking-[0.4em] font-black">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Best Sellers Carousel Section */}
      <BestSellers parfums={parfums} />

      {/* Catalog Grid (Interactive) */}
      <Catalog initialParfums={parfums} />
    </main>
  );
}
