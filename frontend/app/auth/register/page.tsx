"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [message, setMessage] = useState({ text: "", type: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage({ text: "Inscription réussie ! Veuillez vérifier votre boîte mail pour activer votre compte.", type: "success" });
    } else {
      setMessage({ text: data.message || "Erreur d'inscription.", type: "error" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">Créer un compte</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Nom complet</label>
            <input 
              type="text" 
              placeholder="Votre nom" 
              className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              value={name} onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="votre@email.com" 
              className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Mot de passe</label>
            <input 
              type="password" 
              placeholder="********" 
              className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Type de compte</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors cursor-pointer"
            >
              <option value="client">Client (Acheteur)</option>
              <option value="vendeur">Vendeur (Boutique)</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] hidden sm:block"
          >
            S'inscrire
          </button>
          
          <button
            type="submit"
            className="mt-4 bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] sm:hidden"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-400">
          Déjà un compte ? <Link href="/auth/login" className="text-yellow-500 hover:text-yellow-400 font-bold ml-1 transition">Se connecter</Link>
        </div>

        {message.text && (
          <div className={`mt-6 p-4 rounded-xl text-center font-medium ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
