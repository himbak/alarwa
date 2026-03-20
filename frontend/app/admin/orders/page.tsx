"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { ListOrdered } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminOrders() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://127.0.0.1:5000/api/orders", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) setOrders(await res.json());
  };

  useEffect(() => {
    setTimeout(() => fetchOrders(), 0);
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <div className="p-8 text-white min-h-screen">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <ListOrdered className="w-8 h-8 text-indigo-500" />
        Toutes les Commandes
      </h1>
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50">
              <th className="p-4 text-neutral-400 font-medium">Client</th>
              <th className="p-4 text-neutral-400 font-medium">Produits</th>
              <th className="p-4 text-neutral-400 font-medium">Total</th>
              <th className="p-4 text-neutral-400 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition">
                <td className="p-4">
                  <p className="font-bold">{o.userId?.name || "Client inconnu"}</p>
                  <p className="text-xs text-neutral-400">{o.userId?.email}</p>
                  <p className="text-xs text-neutral-500 mt-1">{new Date(o.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-4">
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {o.products.map((p: any, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        {p.parfumId?.image && (
                          <div className="w-8 h-8 relative rounded overflow-hidden">
                            <Image src={p.parfumId.image} alt={p.parfumId.name} fill className="object-cover" />
                          </div>
                        )}
                        <span className="text-sm">{p.quantity}x {p.parfumId?.name || "Produit supprimé"}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 font-bold text-yellow-500">{o.totalAmount} MAD</td>
                <td className="p-4">
                  <select 
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                  >
                    <option value="En attente">En attente</option>
                    <option value="Expédiée">Expédiée</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500">Aucune commande.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
