"use client"
import { useEffect, useState } from "react";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function SellerDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    // Simulation des données, idéalement via API
    setTimeout(() => {
      setStats({ products: 12, orders: 34, revenue: 1450 });
    }, 0);
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Vue d&apos;ensemble</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Produits actifs</p>
            <p className="text-2xl font-bold">{stats.products}</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Commandes en cours</p>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Chiffre d&apos;affaires</p>
            <p className="text-2xl font-bold">{stats.revenue} MAD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
