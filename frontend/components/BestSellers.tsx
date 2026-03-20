"use client"
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { useLangStore } from "../store/langStore";
import { translations } from "../locales";

interface Parfum {
    _id: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    stock: number;
}

export default function BestSellers({ parfums }: { parfums: Parfum[] }) {
    const lang = useLangStore(state => state.lang);
    const t = translations[lang].bestSellers;
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const bestSellers = parfums.slice(0, 5); // Simuler les best-sellers
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % bestSellers.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + bestSellers.length) % bestSellers.length);
    };

    useEffect(() => {
        if (!isPaused) {
            timerRef.current = setInterval(nextSlide, 5000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused]);

    if (!bestSellers.length) return null;

    return (
        <section 
            className="relative w-full overflow-hidden bg-neutral-950 pt-8 pb-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-amber-500/20 flex-1"></div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-amber-500">{t.title}</h2>
                    <div className="h-px bg-amber-500/20 flex-1"></div>
                </div>

                <div className="relative group h-[500px] md:h-[600px] rounded-[48px] overflow-hidden border border-neutral-800 shadow-2xl shadow-black">
                    {/* Slides */}
                    {bestSellers.map((parfum, index) => (
                        <div
                            key={parfum._id}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                                index === currentIndex ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-full scale-110 pointer-events-none"
                            }`}
                        >
                            <div className="relative w-full h-full flex flex-col md:flex-row items-center">
                                {/* Image side */}
                                <div className="w-full md:w-1/2 h-full relative">
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-transparent to-transparent z-10" />
                                    {parfum.image && (
                                        <Image
                                            src={parfum.image}
                                            alt={parfum.name}
                                            fill
                                            className="object-cover object-center"
                                            priority
                                        />
                                    )}
                                </div>

                                {/* Content side */}
                                <div className={`w-full md:w-1/2 h-full bg-neutral-900/40 backdrop-blur-3xl p-12 md:p-20 flex flex-col justify-center items-start ${lang === 'ar' ? 'text-right' : 'text-left'} z-20`}>
                                    <div className="flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        ))}
                                        <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase ml-2">{t.expert}</span>
                                    </div>
                                    
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">{parfum.brand}</h3>
                                    <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                                        {parfum.name}
                                    </h2>
                                    <p className="text-neutral-400 text-lg mb-10 max-w-sm font-medium leading-relaxed animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                                        {t.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-neutral-600 uppercase tracking-widest mb-1">{t.priceTitle}</span>
                                            <span className="text-3xl font-black text-white">{parfum.price} <span className="text-xs text-neutral-500 ml-1">MAD</span></span>
                                        </div>
                                        <Link 
                                            href={`/parfum/${parfum._id}`}
                                            className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-neutral-200 transition-all flex items-center gap-3 transform hover:scale-105"
                                        >
                                            <ShoppingBag className="w-4 h-4" /> {t.buyNow}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    <button 
                        onClick={prevSlide}
                        className={`absolute ${lang === 'ar' ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100`}
                    >
                        {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                    <button 
                        onClick={nextSlide}
                        className={`absolute ${lang === 'ar' ? 'left-8' : 'right-8'} top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100`}
                    >
                        {lang === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>

                    {/* Progress Dots */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                        {bestSellers.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? "w-12 bg-amber-500" : "w-4 bg-white/20 hover:bg-white/40"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
