"use client"
import { useEffect, useState } from "react";
import { Tag, Trash2, Plus } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminPromos() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promos, setPromos] = useState<any[]>([]);
  const [newPromo, setNewPromo] = useState({ code: "", discountPercentage: 10, expiryDate: "" });

  const fetchPromos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://127.0.0.1:5000/api/promos", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) setPromos(await res.json());
  };

  useEffect(() => {
    setTimeout(() => fetchPromos(), 0);
  }, []);

  const createPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:5000/api/promos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(newPromo)
    });
    fetchPromos();
    setNewPromo({ code: "", discountPercentage: 10, expiryDate: "" });
  };

  const deletePromo = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:5000/api/promos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchPromos();
  };

  return (
    <div className="p-8 text-white min-h-screen">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <Tag className="w-8 h-8 text-indigo-500" />
        Codes Promo
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Ajouter un code</h2>
        <form onSubmit={createPromo} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Code</label>
            <input type="text" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2" placeholder="Ex: ETE2026"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Réduction (%)</label>
            <input type="number" min="1" max="100" value={newPromo.discountPercentage} onChange={e => setNewPromo({...newPromo, discountPercentage: +e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-24"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Date d&apos;expiration</label>
            <input type="date" value={newPromo.expiryDate} onChange={e => setNewPromo({...newPromo, expiryDate: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2"/>
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition">
            <Plus className="w-4 h-4"/> Ajouter
          </button>
        </form>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50">
              <th className="p-4 text-neutral-400 font-medium">Code</th>
              <th className="p-4 text-neutral-400 font-medium">Réduction</th>
              <th className="p-4 text-neutral-400 font-medium">Expiration</th>
              <th className="p-4 text-neutral-400 font-medium">Statut</th>
              <th className="p-4 text-neutral-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map(p => {
              const isActive = p.isActive && new Date(p.expiryDate) > new Date();
              return (
                <tr key={p._id} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition">
                  <td className="p-4 font-bold tracking-widest text-indigo-400">{p.code}</td>
                  <td className="p-4 font-bold text-yellow-500">-{p.discountPercentage}%</td>
                  <td className="p-4">{new Date(p.expiryDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {isActive ? "Actif" : "Expiré/Inactif"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button onClick={() => deletePromo(p._id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )
            })}
            {promos.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">Aucun code promo créé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
