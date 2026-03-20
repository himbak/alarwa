"use client"
import Image from "next/image";
import { MapPin, Target, ShieldCheck, Zap, ArrowRight, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useLangStore } from "../../store/langStore";
import { translations } from "../../locales";

export default function LocalisationPage() {
    const lang = useLangStore(state => state.lang);
    const t = translations[lang].localisation;

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Hero Section */}
            <section className="relative py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8 animate-in fade-in slide-in-from-bottom-4">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">{t.title}</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-400 to-neutral-600">
                        {t.hero}
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                        {t.subtitle}
                    </p>
                </div>
            </section>

            {/* Interactive Map Section */}
            <section className="px-4 md:px-8 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-[48px] overflow-hidden border border-neutral-800 shadow-2xl h-[500px] md:h-[600px] group transition-all hover:border-amber-500/20">
                        {/* Custom Google Maps Embed */}
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.382635954497!2d-6.766085!3d34.023963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAxJzI2LjMiTiA2wrA0NSc1Ny45Ilc!5e0!3m2!1sfr!2sma!4v1710834000000!5m2!1sfr!2sma" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale contrast-125"
                        ></iframe>
                        
                        <div className={`absolute bottom-8 ${lang === 'ar' ? 'right-8 left-auto' : 'left-8 right-auto'} md:w-96 bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl animate-in slide-in-from-${lang === 'ar' ? 'right' : 'left'}-8 duration-700`}>
                            <h3 className="text-xl font-black text-white mb-4">Maison ALARWA</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-5 h-5 text-amber-500 mt-1" />
                                    <p className="text-neutral-400 text-sm font-bold">{t.address}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{t.hours}</span>
                                    <button className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group">
                                        {t.directions} {lang === 'ar' ? <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values Section */}
            <section className="py-24 bg-neutral-900/30 border-y border-neutral-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
                
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className={`lg:w-1/2 space-y-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-amber-500">{t.heritage}</h4>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
                                    {t.soul}
                                </h2>
                            </div>
                            <p className="text-neutral-400 text-lg leading-relaxed font-bold">
                                {t.missionDesc}
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h5 className="text-3xl font-black text-white">500+</h5>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{t.statFragrances}</p>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="text-3xl font-black text-white">24h</h5>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{t.statSupport}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { 
                                    icon: Target, 
                                    title: t.mission, 
                                    desc: t.missionDetail 
                                },
                                { 
                                    icon: ShieldCheck, 
                                    title: t.values, 
                                    desc: t.valuesDetail 
                                },
                                { 
                                    icon: Zap, 
                                    title: t.activity, 
                                    desc: t.activityDetail 
                                },
                                { 
                                    icon: MessageSquare, 
                                    title: t.engagement, 
                                    desc: t.engagementDetail 
                                }
                            ].map((item, idx) => (
                                <div key={idx} className={`p-8 bg-neutral-900 border border-neutral-800 rounded-[32px] hover:border-amber-500/20 transition-all group ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                    <div className={`w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${lang === 'ar' ? 'mr-0 ml-auto' : 'mr-auto ml-0'}`}>
                                        <item.icon className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h3 className="text-lg font-black text-white mb-3 tracking-tight">{item.title}</h3>
                                    <p className="text-neutral-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter/Contact CTA */}
            <section className="py-24 px-4 text-center">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-500 to-amber-600 rounded-[56px] p-12 md:p-20 shadow-2xl shadow-amber-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black leading-none">
                            {t.ctaTitle}
                        </h2>
                        <p className="text-black/70 text-lg font-bold max-w-xl mx-auto">
                            {t.ctaDesc}
                        </p>
                        <button className="bg-black text-white px-12 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:scale-105 transition-transform shadow-2xl">
                            {t.ctaButton}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
