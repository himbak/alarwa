"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { Database, Trash2, Plus, Edit2, X } from "lucide-react";

export default function AdminCatalog() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parfums, setParfums] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newParfum, setNewParfum] = useState({ 
    name: "", 
    brand: "", 
    description: "Description classique.", 
    price: 0, 
    stock: 0, 
    image: "", 
    category: "Mixte",
    topNotes: "",
    heartNotes: "",
    baseNotes: ""
  });

  const fetchCatalog = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/parfums");
    if (res.ok) setParfums(await res.json());
  };

  useEffect(() => {
    setTimeout(() => fetchCatalog(), 0);
  }, []);

  const deleteParfum = async (id: string) => {
    if (!confirm("Voulez-vous supprimer ce parfum de la plateforme entière ?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:5000/api/parfums/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchCatalog();
  };

  const createOrUpdateParfum = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingId ? `http://127.0.0.1:5000/api/parfums/${editingId}` : "http://127.0.0.1:5000/api/parfums";
    const method = editingId ? "PUT" : "POST";

    const parseNotes = (str: any) => {
      if (typeof str !== "string") return str;
      return str.split("\n").map(line => {
        const [name, image] = line.split("|").map(s => s.trim());
        return name ? { name, image: image || "" } : null;
      }).filter(n => n);
    };

    const payload = {
      ...newParfum,
      topNotes: parseNotes(newParfum.topNotes),
      heartNotes: parseNotes(newParfum.heartNotes),
      baseNotes: parseNotes(newParfum.baseNotes)
    };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    fetchCatalog();
    resetForm();
  };

  const [uploading, setUploading] = useState<string | null>(null);

  const handleNoteUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: 'topNotes' | 'heartNotes' | 'baseNotes') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(category);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const currentVal = newParfum[category];
        const newVal = currentVal ? `${currentVal}\nNouvelle note | ${data.imageUrl}` : `Nouvelle note | ${data.imageUrl}`;
        setNewParfum({ ...newParfum, [category]: newVal });
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(null);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewParfum({ name: "", brand: "", description: "Description classique.", price: 0, stock: 0, image: "", category: "Mixte", topNotes: "", heartNotes: "", baseNotes: "" });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startEdit = (p: any) => {
    setEditingId(p._id);
    setNewParfum({
      ...p,
      topNotes: (p.topNotes || []).map((n: any) => n.image ? `${n.name} | ${n.image}` : n.name).join("\n"),
      heartNotes: (p.heartNotes || []).map((n: any) => n.image ? `${n.name} | ${n.image}` : n.name).join("\n"),
      baseNotes: (p.baseNotes || []).map((n: any) => n.image ? `${n.name} | ${n.image}` : n.name).join("\n")
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-8 text-white min-h-screen">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <Database className="w-8 h-8 text-indigo-500" />
        Catalogue Global
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingId ? "Modifier le produit" : "Ajouter un produit (Global)"}</h2>
          {editingId && <button onClick={resetForm} className="text-neutral-500 hover:text-white transition"><X className="w-5 h-5"/></button>}
        </div>
        <form onSubmit={createOrUpdateParfum} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Nom</label>
            <input type="text" value={newParfum.name} onChange={e => setNewParfum({...newParfum, name: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-40"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Marque</label>
            <input type="text" value={newParfum.brand} onChange={e => setNewParfum({...newParfum, brand: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-32"/>
          </div>
          <div className="w-full">
            <label className="block text-sm text-neutral-400 mb-1">Description</label>
            <textarea value={newParfum.description} onChange={e => setNewParfum({...newParfum, description: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-full h-20 resize-none"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Prix (MAD)</label>
            <input type="number" value={newParfum.price} onChange={e => setNewParfum({...newParfum, price: +e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-24"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Stock</label>
            <input type="number" value={newParfum.stock} onChange={e => setNewParfum({...newParfum, stock: +e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-24"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Image (URL)</label>
            <input type="url" value={newParfum.image} onChange={e => setNewParfum({...newParfum, image: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-48"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Catégorie</label>
            <select value={newParfum.category} onChange={e => setNewParfum({...newParfum, category: e.target.value})} className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2">
              <option value="Mixte">Mixte</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-800 pt-4 mt-2">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-sky-400 uppercase tracking-tighter">Notes de tête (Par ligne)</label>
                <label className="cursor-pointer text-[10px] bg-sky-900/30 hover:bg-sky-900/50 text-sky-400 px-2 py-0.5 rounded border border-sky-800/50 transition">
                  {uploading === 'topNotes' ? "..." : "+ Image locale"}
                  <input type="file" className="hidden" accept="image/*" onChange={e => handleNoteUpload(e, 'topNotes')} disabled={!!uploading}/>
                </label>
              </div>
              <textarea value={newParfum.topNotes} onChange={e => setNewParfum({...newParfum, topNotes: e.target.value})} placeholder="Nom | ImageURL" className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-full text-sm h-20 resize-none"/>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-rose-400 uppercase tracking-tighter">Notes de cœur (Par ligne)</label>
                <label className="cursor-pointer text-[10px] bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 px-2 py-0.5 rounded border border-rose-800/50 transition">
                  {uploading === 'heartNotes' ? "..." : "+ Image locale"}
                  <input type="file" className="hidden" accept="image/*" onChange={e => handleNoteUpload(e, 'heartNotes')} disabled={!!uploading}/>
                </label>
              </div>
              <textarea value={newParfum.heartNotes} onChange={e => setNewParfum({...newParfum, heartNotes: e.target.value})} placeholder="Nom | ImageURL" className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-full text-sm h-20 resize-none"/>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-amber-600 uppercase tracking-tighter">Notes de fond (Par ligne)</label>
                <label className="cursor-pointer text-[10px] bg-amber-900/30 hover:bg-amber-900/50 text-amber-600 px-2 py-0.5 rounded border border-amber-800/50 transition">
                  {uploading === 'baseNotes' ? "..." : "+ Image locale"}
                  <input type="file" className="hidden" accept="image/*" onChange={e => handleNoteUpload(e, 'baseNotes')} disabled={!!uploading}/>
                </label>
              </div>
              <textarea value={newParfum.baseNotes} onChange={e => setNewParfum({...newParfum, baseNotes: e.target.value})} placeholder="Nom | ImageURL" className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-full text-sm h-20 resize-none"/>
            </div>
          </div>
          <button type="submit" className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${editingId ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
            {editingId ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} 
            {editingId ? "Enregistrer" : "Ajouter"}
          </button>
        </form>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50">
              <th className="p-4 text-neutral-400 font-medium">Produit</th>
              <th className="p-4 text-neutral-400 font-medium">Vendeur</th>
              <th className="p-4 text-neutral-400 font-medium">Prix</th>
              <th className="p-4 text-neutral-400 font-medium">Stock</th>
              <th className="p-4 text-neutral-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parfums.map(p => (
              <tr key={p._id} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition">
                <td className="p-4 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-800">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.brand}</p>
                  </div>
                </td>
                <td className="p-4 text-neutral-300">{p.sellerId?.name || "Vendeur inconnu"}</td>
                <td className="p-4 font-bold text-yellow-500">{p.price} €</td>
                <td className="p-4">{p.stock}</td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button onClick={() => startEdit(p)} className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteParfum(p._id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                  </td>
              </tr>
            ))}
            {parfums.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">Aucun parfum trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
