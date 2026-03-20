"use client"
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import TranslatedText from "./TranslatedText";
import ReviewForm from "./ReviewForm";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useWishlistStore } from "../store/wishlistStore";
import { useLangStore } from "../store/langStore";
import { translations } from "../locales";
import { Heart, Star } from "lucide-react";
import OlfactoryNotes from "./OlfactoryNotes";

interface NoteData {
  name: string;
  image?: string;
}

interface ParfumType {
  _id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  notes?: string[];
  topNotes?: NoteData[];
  heartNotes?: NoteData[];
  baseNotes?: NoteData[];
  category?: string;
}

interface ReviewType {
  _id: string;
  userId: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ParfumDetailClient({ parfum, initialReviews, allParfums }: { parfum: ParfumType; initialReviews: ReviewType[]; allParfums: ParfumType[] }) {
  const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
  const { toggle, isWishlisted } = useWishlistStore();
  const lang = useLangStore((state: any) => state.lang) as keyof typeof translations;
  const t = translations[lang].product;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const refreshReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/parfum/${parfum._id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  // Advanced similar products logic
  const similar = useMemo(() => {
    return allParfums
      .filter(p => p._id !== parfum._id)
      .map(p => {
        let score = 0;
        // Same category is a strong base
        if (p.category === parfum.category) score += 5;
        // Same brand is interesting
        if (p.brand === parfum.brand) score += 2;
        
        // Deep note comparison if structured notes exist
        const extractNames = (arr?: any[]) => (arr || []).map(n => typeof n === 'string' ? n : n.name);
        
        const pAllNotes = [
          ...extractNames(p.topNotes), 
          ...extractNames(p.heartNotes), 
          ...extractNames(p.baseNotes), 
          ...(p.notes || [])
        ];
        const currentAllNotes = [
          ...extractNames(parfum.topNotes), 
          ...extractNames(parfum.heartNotes), 
          ...extractNames(parfum.baseNotes), 
          ...(parfum.notes || [])
        ];
        
        const commonNotes = pAllNotes.filter(n => currentAllNotes.includes(n));
        score += commonNotes.length * 3;
        
        return { ...p, similarityScore: score };
      })
      .sort((a, b) => (b as any).similarityScore - (a as any).similarityScore)
      .slice(0, 5);
  }, [parfum, allParfums]);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white bg-neutral-950 min-h-screen ${lang === 'ar' ? 'rtl' : ''}`}>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
        {/* Image */}
        <div className="relative h-[500px] w-full bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
          <Image src={parfum.image} alt={parfum.name} fill className="object-cover" />
          {/* Wishlist */}
          {isClient && (
            <button
              onClick={() => toggle({ parfumId: parfum._id, name: parfum.name, brand: parfum.brand, price: parfum.price, image: parfum.image })}
              className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} w-11 h-11 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10`}
            >
              <Heart className={`w-5 h-5 transition-colors ${isWishlisted(parfum._id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          )}
        </div>

        {/* Details */}
        <div className={`flex flex-col justify-center ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <h4 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-2">{parfum.brand}</h4>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{parfum.name}</h1>

          {/* Rating summary */}
          {isClient && reviews.length > 0 && (
            <div className={`flex items-center gap-2 mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="flex">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-600'}`} />)}
              </div>
              <span className="text-neutral-400 text-sm">({reviews.length} {t.reviewsCount || "avis"})</span>
            </div>
          )}

          <p className="text-2xl font-bold mb-6">{parfum.price} MAD</p>
          <p className="text-neutral-400 mb-8 leading-relaxed">{parfum.description}</p>

          {parfum.notes && parfum.notes.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2 text-neutral-300"><TranslatedText tKey="product.notes" /></h3>
              <div className={`flex flex-wrap gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                {parfum.notes.map((note: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300 border border-neutral-700">{note}</span>
                ))}
              </div>
            </div>
          )}

          <AddToCartButton parfum={parfum} />
        </div>
      </div>

      {/* Olfactory Notes Section */}
      <OlfactoryNotes 
        topNotes={parfum.topNotes} 
        heartNotes={parfum.heartNotes} 
        baseNotes={parfum.baseNotes} 
        similarParfums={similar}
      />

      {/* Reviews Section */}
      <div className={`mt-20 border-t border-neutral-800 pt-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-bold mb-8">
          <TranslatedText tKey="product.reviews" /> {isClient && `(${reviews.length})`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reviews.map(r => (
            <div key={r._id} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
              <div className={`flex items-center justify-between mb-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {r.userId?.name?.[0]?.toUpperCase() || "C"}
                  </div>
                  <span className="font-bold">{r.userId?.name || (t.client || "Client")}</span>
                </div>
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-600'}`} />)}
                </div>
              </div>
              <p className="text-neutral-300">{r.comment}</p>
              <p className={`text-xs text-neutral-500 mt-2 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>
                {new Date(r.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR')}
              </p>
            </div>
          ))}
          {isClient && reviews.length === 0 && (
            <p className="text-neutral-500 col-span-2">
              <TranslatedText tKey="product.noReviews" />
            </p>
          )}
        </div>

        <ReviewForm parfumId={parfum._id} onSubmitted={refreshReviews} />
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div className={`mt-20 border-t border-neutral-800 pt-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <h2 className="text-3xl font-bold mb-8">{t.similar || "Vous aimerez aussi..."}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map(p => (
              <Link key={p._id} href={`/parfum/${p._id}`} className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all">
                <div className="relative h-40 overflow-hidden bg-neutral-800">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-neutral-500">{p.brand}</p>
                  <p className="font-bold text-sm truncate">{p.name}</p>
                  <p className="text-yellow-500 font-bold mt-1">{p.price} MAD</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
