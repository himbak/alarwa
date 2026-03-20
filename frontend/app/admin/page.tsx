"use client"
import { useEffect, useState } from "react";
import { Users, Coins, ShoppingBag, TrendingUp, PackageSearch, ShoppingCart, Package } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, revenue: 0, orders: 0, products: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    const fetchStats = async () => {
      try {
        // Simulation API for stats
        setStats({ users: 156, products: 45, orders: 320, revenue: 14500 });

        const parfumsRes = await fetch("http://127.0.0.1:5000/api/parfums");
        if (parfumsRes.ok) {
          const parfumsData = await parfumsRes.json();
          setTopProducts(parfumsData.slice(0, 5));
        }

      } catch (err) {
        console.error("Erreur stats:", err);
      }
    };
    
    setTimeout(() => fetchStats(), 0);
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-black mb-8">Statistiques Globales</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4 hover:border-indigo-500/50 transition">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Utilisateurs Inscrits</p>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4 hover:border-emerald-500/50 transition">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Chiffre d&apos;affaires Total</p>
            <p className="text-3xl font-bold">{stats.revenue} €</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4 hover:border-purple-500/50 transition">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Commandes Traitées</p>
            <p className="text-3xl font-bold">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4 hover:border-amber-500/50 transition">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Produits sur la plateforme</p>
            <p className="text-3xl font-bold">{stats.products}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
