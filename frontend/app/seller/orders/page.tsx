"use client"
import { useEffect, useState } from "react";
import { PackageOpen } from "lucide-react";

export default function SellerOrders() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if(!token) return;
      const res = await fetch("http://127.0.0.1:5000/api/orders/seller-orders", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if(res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <PackageOpen className="w-8 h-8 text-yellow-500" />
        Commandes Clients
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50">
              <th className="p-4 text-neutral-400 font-medium">Commande ID</th>
              <th className="p-4 text-neutral-400 font-medium">Client</th>
              <th className="p-4 text-neutral-400 font-medium">Produits vendus</th>
              <th className="p-4 text-neutral-400 font-medium">Statut</th>
              <th className="p-4 text-neutral-400 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition">
                <td className="p-4 text-sm font-mono text-neutral-300">{o._id.slice(-8)}</td>
                <td className="p-4">
                  <p className="font-bold">{o.userId?.name || "Client Externe"}</p>
                  <p className="text-xs text-neutral-400">{o.userId?.email || "..."}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {o.products.map((p: { _id: string, quantity: number, parfumId: { name: string } }) => (
                      <span key={p._id} className="text-sm">
                        {p.quantity}x {p.parfumId?.name || "Produit supprimé"}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <select 
                    className="bg-neutral-950 border border-neutral-700 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block p-2"
                    defaultValue={o.status}
                  >
                    <option value="En attente">En attente</option>
                    <option value="Expédiée">Expédiée</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </td>
                <td className="p-4">
                  <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded-lg text-sm transition">Mettre à jour</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">Aucune commande pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
