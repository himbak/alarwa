"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Database, FileText, LayoutDashboard, ListOrdered, Tag, LogOut, Bell, BarChart2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://127.0.0.1:5000/api/orders", { headers: { "Authorization": `Bearer ${token}` }});
      if (res.ok) {
        const data = await res.json();
        setRecentOrders(data.slice(0, 3));
      }
    };
    fetchRecentOrders();
    const interval = setInterval(fetchRecentOrders, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-neutral-950 flex text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-neutral-800">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Administration
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Tableau de bord</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <Users className="w-5 h-5" />
            <span>Utilisateurs</span>
          </Link>
          <Link href="/admin/catalog" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <Database className="w-5 h-5" />
            <span>Catalogue Global</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <ListOrdered className="w-5 h-5" />
            <span>Commandes</span>
          </Link>
          <Link href="/admin/promos" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <Tag className="w-5 h-5" />
            <span>Promotions</span>
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span>Rapports</span>
          </Link>
          <Link href="/admin/stats" className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">
            <BarChart2 className="w-5 h-5" />
            <span>📊 Statistiques</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); window.location.href = "/auth/login"; }} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-neutral-950 min-h-screen flex flex-col">
        {/* Top Header for Notifications */}
        <header className="h-20 border-b border-neutral-800 bg-neutral-900/50 flex justify-end items-center px-8 relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-neutral-800 rounded-full hover:bg-neutral-700 transition relative"
          >
            <Bell className="w-6 h-6 text-neutral-300" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-neutral-900"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute top-20 right-8 w-80 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-4 z-50">
              <h4 className="font-bold text-white mb-4 border-b border-neutral-700 pb-2">Notifications récentes</h4>
              {recentOrders.length === 0 ? <p className="text-neutral-400 text-sm">Aucune activité récente.</p> : null}
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order._id} className="text-sm border-b border-neutral-700/50 pb-2 last:border-0">
                    <p className="font-bold text-yellow-500">Nouvelle commande ({order.totalAmount} MAD)</p>
                    <p className="text-neutral-400">Par: {order.userId?.name || "Inconnu"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
