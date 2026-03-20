"use client"
import Link from "next/link";
import { useCartStore } from "../store/cartStore";
import { useLangStore } from "../store/langStore";
import { translations } from "../locales";
import { ShoppingBag, User, Globe, LogOut, LayoutDashboard, Store, Heart, Package, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const { setLang } = useLangStore();
  const lang = useLangStore((state: any) => state.lang) as keyof typeof translations;

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'ar' : 'fr');
  };
  const t = translations[lang].nav;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuth(true);
      setUserRole(role);
    }
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/auth/login";
  };

  const getDashboardLink = () => {
    if (userRole === "admin") return "/admin";
    if (userRole === "vendeur") return "/seller";
    return "/account";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-amber-500/30 group-hover:border-amber-500 transition-colors">
                <Image src="/logo.png" alt="ALARWA Logo" fill className="object-cover" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-200 bg-[length:200%_auto] animate-gradient-x">
                {translations[lang].home.title}
              </span>
            </Link>

            <div className="h-6 w-px bg-neutral-800 hidden sm:block"></div>

            <Link href="/localisation" className="flex items-center gap-2 text-neutral-400 hover:text-amber-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-amber-500/10 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:block">{t.location}</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className={`flex items-baseline ${lang === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              <Link href="/" className="text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.home}</Link>
            </div>
          </div>

          <div className="flex items-center space-x-3 gap-3">
            <button onClick={toggleLang} className={`flex items-center text-neutral-300 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-800 text-sm font-bold uppercase ${lang === 'ar' ? 'flex-row-reverse space-x-reverse' : 'space-x-1'}`}>
              <Globe className="w-4 h-4 mr-1" /> {lang}
            </button>

            {isClient && isAuth ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-neutral-300 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-800">
                  <User className="w-5 h-5" />
                </button>
                {menuOpen && (
                  <div className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-52 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl py-2 z-50`}>
                    <Link href={getDashboardLink()} onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition text-sm ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      {userRole === "vendeur" ? <Store className="w-4 h-4" /> : userRole === "admin" ? <LayoutDashboard className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      {userRole === "vendeur" ? t.seller : userRole === "admin" ? t.admin : t.account}
                    </Link>
                    {userRole === "client" && (
                      <Link href="/account" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 transition text-sm ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                        <Package className="w-4 h-4" />
                        {t.orders}
                      </Link>
                    )}
                    <div className="border-t border-neutral-800 my-1" />
                    <button onClick={handleLogout} className={`w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 transition text-sm ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              isClient && (
                <>
                  <Link href="/auth/login" className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-neutral-800">
                    <User className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">{t.login}</span>
                  </Link>
                  <Link href="/auth/register" className="hidden sm:inline-block text-sm font-bold bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition">
                    {t.signup}
                  </Link>
                </>
              )
            )}

            {/* Wishlist icon */}
            {isClient && isAuth && (
              <Link href="/wishlist" className="relative text-neutral-300 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-neutral-800">
                <Heart className="w-5 h-5" />
              </Link>
            )}

            <Link href="/cart" className="relative text-neutral-300 hover:text-yellow-500 transition-colors p-2 rounded-full hover:bg-neutral-800">
              <ShoppingBag className="w-5 h-5" />
              {isClient && totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-black bg-yellow-500 rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
