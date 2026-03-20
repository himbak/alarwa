"use client"
import { useEffect, useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useLangStore } from "../../store/langStore";
import { translations } from "../../locales";

export default function WishlistPage() {
  const [isClient, setIsClient] = useState(false);
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore(state => state.addItem);
  const lang = useLangStore((state: any) => state.lang) as keyof typeof translations;
  const t = translations[lang].account; 
  const tp = translations[lang].product;

  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) return null;

  return (
    <div className={`min-h-screen bg-neutral-950 text-white py-12 px-4 ${lang === 'ar' ? 'rtl' : ''}`}>
      <div className="max-w-5xl mx-auto">
        <div className={`flex items-center gap-3 mb-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold">{t.wishlist}</h1>
          <span className="bg-neutral-800 text-neutral-400 text-sm px-3 py-1 rounded-full">
            {items.length} {lang === 'ar' ? 'منتجات' : 'article(s)'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
            <p className="text-neutral-400 text-lg mb-4">{t.noWishlist}</p>
            <Link href="/catalog" className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition inline-block">
              {translations[lang].cart.discover}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.parfumId} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-all group flex flex-col">
                <Link href={`/parfum/${item.parfumId}`} className="relative h-52 block overflow-hidden bg-neutral-800">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
                </Link>
                <div className={`p-5 flex flex-col flex-grow ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{item.brand}</p>
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-yellow-500 font-bold text-xl mb-4">{item.price} MAD</p>
                  <div className={`mt-auto flex gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <button
                      onClick={() => { addItem({ ...item, quantity: 1 }); removeItem(item.parfumId); }}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {tp.addToCart}
                    </button>
                    <button
                      onClick={() => removeItem(item.parfumId)}
                      className="p-2.5 text-red-500 hover:bg-red-500/20 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
