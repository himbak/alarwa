"use client"
import { useEffect, useState } from "react";
import { Users, Trash2, Plus, ShieldAlert, Shield } from "lucide-react";

export default function AdminUsers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "client" });

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://127.0.0.1:5000/api/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchUsers(), 0);
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:5000/api/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    });
    fetchUsers();
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("http://127.0.0.1:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(newUser)
    });
    setNewUser({ name: "", email: "", password: "", role: "client" });
    fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchUsers();
  };

  return (
    <div className="p-8 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <Users className="w-8 h-8 text-indigo-500" />
        Gestion des Utilisateurs
      </h1>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Ajouter un utilisateur</h2>
        <form onSubmit={createUser} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Nom</label>
            <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-40"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Email</label>
            <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-48"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Mot de passe</label>
            <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2 w-40"/>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Rôle</label>
            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="bg-neutral-800 border border-neutral-700 text-white rounded-lg p-2">
              <option value="client">Client</option>
              <option value="vendeur">Vendeur</option>
              <option value="admin">Admin</option>
            </select>
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
              <th className="p-4 text-neutral-400 font-medium">Nom d&apos;utilisateur</th>
              <th className="p-4 text-neutral-400 font-medium">Email</th>
              <th className="p-4 text-neutral-400 font-medium">Rôle (Permissions)</th>
              <th className="p-4 text-neutral-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition">
                <td className="p-4 font-bold">{u.name}</td>
                <td className="p-4 text-neutral-300">{u.email}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {u.role === "admin" && <ShieldAlert className="w-4 h-4 text-red-500" />}
                    {u.role === "vendeur" && <Shield className="w-4 h-4 text-indigo-500" />}
                    {u.role === "client" && <span className="w-4 h-4 rounded-full bg-neutral-700" />}
                    
                    <select 
                      className="bg-neutral-950 border border-neutral-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-1.5"
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                    >
                      <option value="client">Client</option>
                      <option value="vendeur">Vendeur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  <button onClick={() => deleteUser(u._id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500">Aucun utilisateur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
