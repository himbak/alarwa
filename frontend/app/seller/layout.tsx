"use client"
import Link from "next/link";
import { Package, LayoutDashboard, ShoppingCart, LogOut } from "lucide-react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/auth/login";
  };
  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <Link href="/" className="text-xl font-bold text-yellow-500">
            Espace Vendeur
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/seller" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Tableau de bord</span>
          </Link>
          <Link href="/seller/products" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <Package className="w-5 h-5" />
            <span>Mes Produits</span>
          </Link>
          <Link href="/seller/orders" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span>Mes Commandes</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
