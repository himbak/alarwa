"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit, X, Check } from "lucide-react";

export default function SellerProducts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parfums, setParfums] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    name: "", 
    brand: "", 
    description: "Parfum exclusif.", 
    price: 0, 
    stock: 0, 
    image: "", 
    category: "Mixte",
    topNotes: "",
    heartNotes: "",
    baseNotes: ""
  });

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:5000/api/parfums");
    if (res.ok) {
      const data = await res.json();
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setParfums(data.filter((p: { sellerId?: { _id?: string } | string }) => {
          const sid = typeof p.sellerId === "object" ? (p.sellerId as { _id?: string })?._id : p.sellerId;
          return sid === payload.id;
        }));
      } else {
        setParfums(data);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    // Prepare payload with objects {name, image} for notes
    const parseNotes = (str: string) => str.split("\n").map(line => {
      const [name, image] = line.split("|").map(s => s.trim());
      return name ? { name, image: image || "" } : null;
    }).filter(n => n);

    const payload = {
      ...form,
      topNotes: parseNotes(form.topNotes),
      heartNotes: parseNotes(form.heartNotes),
      baseNotes: parseNotes(form.baseNotes)
    };

    const url = editingId ? `http://127.0.0.1:5000/api/parfums/${editingId}` : "http://127.0.0.1:5000/api/parfums";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", brand: "", description: "Parfum exclusif.", price: 0, stock: 0, image: "", category: "Mixte", topNotes: "", heartNotes: "", baseNotes: "" });
    fetchProducts();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startEdit = (p: any) => {
    setEditingId(p._id);
    // Only extract the primitive form fields, avoid nested objects like sellerId
    setForm({
      name: p.name || "",
      brand: p.brand || "",
      description: p.description || "Parfum exclusif.",
      price: p.price || 0,
      stock: p.stock || 0,
      image: p.image || "",
      category: p.category || "Mixte",
      topNotes: (p.topNotes || []).map((n: any) => n.image ? `${n.name} | ${n.image}` : n.name).join("\n"),
      heartNotes: (p.heartNotes || []).map((n: any) => n.image ? `${n.name} | ${n.image}` : n.name).join("\n"),
      baseNotes: (p.baseNotes || []).map((n: any) => n.image ? `${n.name} | ${n.image}` : n.name).join("\n")
    });
    setShowForm(true);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:5000/api/parfums/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchProducts();
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
        const currentVal = form[category];
        const newVal = currentVal ? `${currentVal}\nNouvelle note | ${data.imageUrl}` : `Nouvelle note | ${data.imageUrl}`;
        setForm({ ...form, [category]: newVal });
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Parfums</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: "", brand: "", description: "Parfum exclusif.", price: 0, stock: 0, image: "", category: "Mixte", topNotes: "", heartNotes: "", baseNotes: "" }); }}
          className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400 transition"
        >
          {showForm ? <X className="w-5 h-5"/> : <Plus className="w-5 h-5"/>} {showForm ? "Annuler" : "Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Modifier le produit" : "Nouveau produit"}</h2>
          <form onSubmit={saveProduct} className="flex flex-wrap gap-4">
            <div><label className="block text-xs text-neutral-400 mb-1">Nom</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-36"/></div>
            <div><label className="block text-xs text-neutral-400 mb-1">Marque</label><input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} required className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-32"/></div>
            <div className="w-full"><label className="block text-xs text-neutral-400 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-full h-16 resize-none"/></div>
            <div><label className="block text-xs text-neutral-400 mb-1">Prix (MAD)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} required className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-24"/></div>
            <div><label className="block text-xs text-neutral-400 mb-1">Stock</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})} required className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-20"/></div>
            <div><label className="block text-xs text-neutral-400 mb-1">Image URL</label><input type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-48"/></div>
            <div><label className="block text-xs text-neutral-400 mb-1">Catégorie</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white">
                <option>Mixte</option><option>Homme</option><option>Femme</option>
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
                <textarea value={form.topNotes} onChange={e => setForm({...form, topNotes: e.target.value})} placeholder="Ex: Citron | https://...&#10;Bergamote" className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-full text-sm h-24 resize-none"/>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-rose-400 uppercase tracking-tighter">Notes de cœur (Par ligne)</label>
                  <label className="cursor-pointer text-[10px] bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 px-2 py-0.5 rounded border border-rose-800/50 transition">
                    {uploading === 'heartNotes' ? "..." : "+ Image locale"}
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleNoteUpload(e, 'heartNotes')} disabled={!!uploading}/>
                  </label>
                </div>
                <textarea value={form.heartNotes} onChange={e => setForm({...form, heartNotes: e.target.value})} placeholder="Ex: Rose | https://...&#10;Jasmin" className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-full text-sm h-24 resize-none"/>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-amber-600 uppercase tracking-tighter">Notes de fond (Par ligne)</label>
                  <label className="cursor-pointer text-[10px] bg-amber-900/30 hover:bg-amber-900/50 text-amber-600 px-2 py-0.5 rounded border border-amber-800/50 transition">
                    {uploading === 'baseNotes' ? "..." : "+ Image locale"}
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleNoteUpload(e, 'baseNotes')} disabled={!!uploading}/>
                  </label>
                </div>
                <textarea value={form.baseNotes} onChange={e => setForm({...form, baseNotes: e.target.value})} placeholder="Ex: Santal | https://...&#10;Vanille" className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white w-full text-sm h-24 resize-none"/>
              </div>
            </div>
            <button type="submit" className="self-end bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition">
              <Check className="w-4 h-4"/> {editingId ? "Enregistrer" : "Créer"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50">
              <th className="p-4 text-neutral-400 font-medium">Produit</th>
              <th className="p-4 text-neutral-400 font-medium">Catégorie</th>
              <th className="p-4 text-neutral-400 font-medium">Prix</th>
              <th className="p-4 text-neutral-400 font-medium">Stock</th>
              <th className="p-4 text-neutral-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parfums.map(p => (
              <tr key={p._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition">
                <td className="p-4 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.brand}</p>
                  </div>
                </td>
                <td className="p-4 text-neutral-300">{p.category || "Mixte"}</td>
                <td className="p-4 font-bold text-yellow-500">{p.price} MAD</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {p.stock} en stock
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => startEdit(p)} className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteProduct(p._id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {parfums.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Vous n&apos;avez pas encore de produits. Ajoutez votre premier parfum !</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
