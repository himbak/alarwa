"use client"
import React, { useState, useEffect } from 'react';
import { Wind, Heart, Flower, TreeDeciduous, Info, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NoteData {
  name: string;
  image?: string;
}

interface NoteProps {
  note: NoteData;
  type: 'top' | 'heart' | 'base';
}

const NoteIcon = ({ type }: { type: 'top' | 'heart' | 'base' }) => {
  switch (type) {
    case 'top': return <Wind className="w-5 h-5 text-sky-400" />;
    case 'heart': return <Flower className="w-5 h-5 text-rose-400" />;
    case 'base': return <TreeDeciduous className="w-5 h-5 text-amber-600" />;
    default: return <Info className="w-5 h-5 text-neutral-400" />;
  }
};

const NoteItem = ({ note, type }: NoteProps) => {
  const noteName = typeof note === 'string' ? note : note.name;
  const noteImage = typeof note === 'object' ? note.image : undefined;

  return (
    <div className="group relative flex flex-col items-center gap-2 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-yellow-500/50 hover:bg-neutral-800 transition-all duration-300 transform hover:-translate-y-1 min-w-[100px]">
      <div className="relative w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700 group-hover:border-yellow-500/30 transition-colors">
        {noteImage ? (
          <Image src={noteImage} alt={noteName} fill unoptimized className="object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <NoteIcon type={type} />
        )}
      </div>
      <span className="text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors text-center">{noteName}</span>
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-yellow-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none" />
    </div>
  );
};

interface OlfactoryNotesProps {
  topNotes?: NoteData[];
  heartNotes?: NoteData[];
  baseNotes?: NoteData[];
  similarParfums: any[];
}

export default function OlfactoryNotes({ topNotes = [], heartNotes = [], baseNotes = [] , similarParfums = [] }: OlfactoryNotesProps) {
  useEffect(() => {
    console.log("OlfactoryNotes data:", { topNotes, heartNotes, baseNotes });
  }, [topNotes, heartNotes, baseNotes]);

  const [showSimilar, setShowSimilar] = useState(false);

  return (
    <div className="mt-16 bg-neutral-950/30 rounded-3xl border border-neutral-900 p-8 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            Notes olfactives
          </h2>
          <p className="text-neutral-500 text-sm mt-1">L'architecture sensorielle de votre fragrance</p>
        </div>
        
        <button 
          onClick={() => setShowSimilar(!showSimilar)}
          className="group flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-900 border border-neutral-800 hover:border-yellow-500/50 text-neutral-300 hover:text-white transition-all duration-300 shadow-lg"
        >
          <Wind className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">{showSimilar ? "Cacher les suggestions" : "Senteurs similaires"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Notes de tête</span>
            <span className="text-[10px] text-neutral-500 pt-0.5">(L'envolée)</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {topNotes.length > 0 ? topNotes.map((note, idx) => <NoteItem key={typeof note === 'string' ? note + idx : note.name + idx} note={note} type="top" />) : <span className="text-neutral-600 italic text-sm">Non spécifié</span>}
          </div>
        </div>

        {/* Heart Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Notes de cœur</span>
            <span className="text-[10px] text-neutral-500 pt-0.5">(L'âme)</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {heartNotes.length > 0 ? heartNotes.map((note, idx) => <NoteItem key={typeof note === 'string' ? note + idx : note.name + idx} note={note} type="heart" />) : <span className="text-neutral-600 italic text-sm">Non spécifié</span>}
          </div>
        </div>

        {/* Base Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Notes de fond</span>
            <span className="text-[10px] text-neutral-500 pt-0.5">(Le sillage)</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {baseNotes.length > 0 ? baseNotes.map((note, idx) => <NoteItem key={typeof note === 'string' ? note + idx : note.name + idx} note={note} type="base" />) : <span className="text-neutral-600 italic text-sm">Non spécifié</span>}
          </div>
        </div>
      </div>

      {/* Similar Scents Sidebar/Slider Container */}
      {showSimilar && (
        <div className="mt-12 pt-10 border-t border-neutral-900 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-neutral-200">
            <ShoppingBag className="w-5 h-5 text-yellow-500" />
            Parfums aux notes similaires
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {similarParfums.length > 0 ? similarParfums.slice(0, 5).map((p: any) => (
              <Link key={p._id} href={`/parfum/${p._id}`} className="group relative block rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-yellow-500/30 transition-all duration-300">
                <div className="aspect-[4/5] relative overflow-hidden bg-neutral-800">
                  <Image 
                    src={p.image} 
                    alt={p.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-tighter mb-0.5">{p.brand}</p>
                  <p className="text-xs font-bold text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-neutral-400 font-medium mt-1">{p.price} MAD</p>
                </div>
              </Link>
            )) : (
              <p className="text-neutral-500 text-sm italic col-span-full py-10 text-center bg-neutral-900/20 rounded-2xl">
                Recherche de fragrances partageant le même caractère...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
