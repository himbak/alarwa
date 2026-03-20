"use client"
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useLangStore } from "../store/langStore";
import { translations } from "../locales";
import { Heart, Search, SlidersHorizontal, ShoppingBag } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Catalog({ initialParfums }: { initialParfums: any[] }) {
  const lang = useLangStore((state: any) => state.lang) as keyof typeof translations;
  const t = translations[lang].catalog;
  const tHome = translations[lang].home;
  const [parfums] = useState(initialParfums);
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minPrice, setMinPrice] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [selectedBrand, setSelectedBrand] = useState("Tous");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => ["Tous", ...Array.from(new Set(parfums.map((p: { brand: string }) => p.brand))).sort()], [parfums]);
  const globalMaxPrice = useMemo(() => Math.max(...parfums.map((p: { price: number }) => p.price), 5000), [parfums]);

  const addItem = useCartStore(state => state.addItem);
  const { toggle, isWishlisted } = useWishlistStore();

  const filteredParfums = useMemo(() => {
    let result = parfums.filter((p: { category: string; price: number; name: string; brand: string; description: string; stock: number }) => {
      if (categoryFilter !== "Tous" && p.category !== categoryFilter) return false;
      if (selectedBrand !== "Tous" && p.brand !== selectedBrand) return false;
      if (p.price > maxPrice) return false;
      if (p.price < minPrice) return false;
      if (inStockOnly && p.stock === 0) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
      }
      return true;
    });
    if (sortBy === "price_asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [parfums, categoryFilter, searchQuery, maxPrice, minPrice, sortBy, selectedBrand, inStockOnly]);

  const resetFilters = () => { setSearchQuery(""); setCategoryFilter("Tous"); setMaxPrice(globalMaxPrice); setMinPrice(0); setSortBy("default"); setSelectedBrand("Tous"); setInStockOnly(false); };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {/* Search & Filter Bar */}
      <div className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-8 ${lang === 'ar' ? 'rtl' : ''}`}>
        <div className={`flex flex-col md:flex-row gap-3 items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1 relative w-full">
            <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400`} />
            <input
              type="text"
              placeholder={t.search || "Rechercher..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full ${lang === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors text-sm`}
            />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={`bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 cursor-pointer ${lang === 'ar' ? 'text-right' : ''}`}>
            <option value="default">{t.sortDefault || "Trier par défaut"}</option>
            <option value="price_asc">{t.sortPriceAsc || "Prix croissant ↑"}</option>
            <option value="price_desc">{t.sortPriceDesc || "Prix décroissant ↓"}</option>
            <option value="name">{t.sortName || "Nom A-Z"}</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'} ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <SlidersHorizontal className="w-4 h-4" />
            {t.filters || "Filtres"}
          </button>
        </div>
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Prix Min/Max */}
              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-400 mb-3 block uppercase tracking-wider">💰 Fourchette de prix</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500 mb-1">Min : <span className="text-yellow-500 font-bold">{minPrice} MAD</span></p>
                    <input type="range" min={0} max={globalMaxPrice} step={50} value={minPrice}
                      onChange={e => setMinPrice(Math.min(+e.target.value, maxPrice - 50))}
                      className="w-full accent-yellow-500 cursor-pointer" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500 mb-1">Max : <span className="text-yellow-500 font-bold">{maxPrice} MAD</span></p>
                    <input type="range" min={0} max={globalMaxPrice} step={50} value={maxPrice}
                      onChange={e => setMaxPrice(Math.max(+e.target.value, minPrice + 50))}
                      className="w-full accent-yellow-500 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Marque */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 mb-3 block uppercase tracking-wider">🏷️ Marque</label>
                <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 cursor-pointer">
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Stock & Reset */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 mb-3 block uppercase tracking-wider">📦 Stock</label>
                <label className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 cursor-pointer hover:border-yellow-500/50 transition-colors">
                  <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-yellow-500 w-4 h-4 cursor-pointer" />
                  <span className="text-sm text-white">En stock uniquement</span>
                </label>
                <button onClick={resetFilters} className="mt-2 w-full text-xs text-yellow-500 hover:text-yellow-400 underline underline-offset-2 py-1 transition-colors">
                  ↺ Réinitialiser les filtres
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-800/50 flex items-center justify-between">
              <p className="text-xs text-neutral-500"><span className="text-white font-bold">{filteredParfums.length}</span> résultat(s) trouvé(s)</p>
              {(selectedBrand !== "Tous" || inStockOnly || minPrice > 0 || maxPrice < globalMaxPrice) && (
                <div className="flex gap-2 flex-wrap">
                  {selectedBrand !== "Tous" && <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">{selectedBrand}</span>}
                  {inStockOnly && <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">En stock</span>}
                  {(minPrice > 0 || maxPrice < globalMaxPrice) && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">{minPrice}–{maxPrice} MAD</span>}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <div className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-3xl font-bold">{tHome.collection}</h2>
        <div className={`flex gap-2 flex-wrap justify-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          {[
            { id: "Tous", label: t.all },
            { id: "Homme", label: t.men },
            { id: "Femme", label: t.women },
            { id: "Mixte", label: t.unisex }
          ].map(cat => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredParfums.map((parfum) => (
          <div key={parfum._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] flex flex-col">
            <div className="relative h-72 w-full overflow-hidden bg-neutral-800">
              <Link href={`/parfum/${parfum._id}`} className="block absolute inset-0">
                <Image src={parfum.image} alt={parfum.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </Link>
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-200 z-10">
                {parfum.brand}
              </div>
              <button
                onClick={() => toggle({ parfumId: parfum._id, name: parfum.name, brand: parfum.brand, price: parfum.price, image: parfum.image })}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart className={`w-4 h-4 transition-colors ${isWishlisted(parfum._id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <Link href={`/parfum/${parfum._id}`} className="flex justify-between items-start mb-2 hover:text-yellow-500 transition-colors">
                <h3 className="text-xl font-bold pr-2">{parfum.name}</h3>
                <span className="text-xl font-bold text-yellow-500 shrink-0">{parfum.price} MAD</span>
              </Link>
              <p className="text-neutral-400 text-sm mb-4 flex-grow line-clamp-2">{parfum.description}</p>
              <button
                onClick={() => addItem({ parfumId: parfum._id, name: parfum.name, brand: parfum.brand, price: parfum.price, image: parfum.image, quantity: 1 })}
                disabled={parfum.stock === 0}
                className={`w-full font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex justify-center items-center gap-2 ${parfum.stock > 0 ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{parfum.stock > 0 ? t.addToCart : t.outOfStock}</span>
                {parfum.stock > 0 && <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full ml-auto">{t.inStock} ({parfum.stock})</span>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredParfums.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-xl">{t.noResults || "Aucun parfum trouvé"}</p>
          <button onClick={resetFilters} className="mt-4 text-yellow-500 underline text-sm">
            {t.resetFilters || "Réinitialiser les filtres"}
          </button>
        </div>
      )}
    </section>
  )
}
