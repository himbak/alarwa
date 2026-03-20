"use client"
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";

const COLORS = ["#EAB308", "#8B5CF6", "#22C55E", "#3B82F6", "#EC4899", "#F97316", "#14B8A6", "#F43F5E"];

export default function AdminStatsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<number>(0);
  const [products, setProducts] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { "Authorization": `Bearer ${token}` };

    Promise.all([
      fetch("http://127.0.0.1:5000/api/orders", { headers }).then(r => r.json()),
      fetch("http://127.0.0.1:5000/api/users", { headers }).then(r => r.json()),
      fetch("http://127.0.0.1:5000/api/parfums").then(r => r.json()),
    ]).then(([o, u, p]) => {
      setOrders(Array.isArray(o) ? o : []);
      setUsers(Array.isArray(u) ? u.length : 0);
      setProducts(Array.isArray(p) ? p.length : 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Sales by day (last 14 days)
  const salesByDay = (() => {
    const days: Record<string, number> = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      days[key] = 0;
    }
    orders.forEach(o => {
      const d = new Date(o.createdAt);
      const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      if (key in days) days[key] = (days[key] || 0) + (o.totalAmount || 0);
    });
    return Object.entries(days).map(([date, total]) => ({ date, total: Math.round(total) }));
  })();

  // Sales by product
  const salesByProduct: Record<string, { name: string; total: number }> = {};
  orders.forEach(o => {
    o.products?.forEach((p: { parfumId?: { name?: string }; quantity: number; priceAtPurchase: number }) => {
      const name = p.parfumId?.name || "Inconnu";
      if (!salesByProduct[name]) salesByProduct[name] = { name, total: 0 };
      salesByProduct[name].total += (p.quantity || 1) * (p.priceAtPurchase || 0);
    });
  });
  const topProducts = Object.values(salesByProduct).sort((a, b) => b.total - a.total).slice(0, 6);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  if (loading) return <div className="p-8 text-white text-center">Chargement des statistiques...</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-yellow-500" />
        Statistiques & Rapports
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Chiffre d'affaires", value: `${Math.round(totalRevenue).toLocaleString()} MAD`, icon: TrendingUp, color: "text-yellow-500 bg-yellow-500/20" },
          { label: "Commandes totales", value: orders.length, icon: ShoppingBag, color: "text-purple-400 bg-purple-500/20" },
          { label: "Utilisateurs", value: users, icon: Users, color: "text-blue-400 bg-blue-500/20" },
          { label: "Produits", value: products, icon: Package, color: "text-green-400 bg-green-500/20" },
        ].map((kpi, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-neutral-400 text-xs">{kpi.label}</p>
              <p className="text-xl font-bold">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Over Time */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Revenus (14 derniers jours)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesByDay} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px', color: '#fff' }}
                formatter={(v) => [`${v} MAD`, 'Ventes']} />
              <Bar dataKey="total" fill="#EAB308" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Statuts des commandes</h2>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-neutral-500">Aucune commande</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {statusData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Top produits par chiffre d&apos;affaires</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#fff', fontSize: 12 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px', color: '#fff' }}
                formatter={(v) => [`${v} MAD`, 'Revenus']} />
              <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                {topProducts.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
