"use client"
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      setMessage(`Connexion réussie ! Vous êtes connecté en tant que : ${data.role}`);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      setTimeout(() => {
        if (data.role === "admin") window.location.href = "/admin";
        else if (data.role === "vendeur") window.location.href = "/seller";
        else window.location.href = "/";
      }, 1000);
      
    } catch (err) {
      setMessage("Erreur réseau ou serveur inaccessible");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">Connexion</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="admin@parfum.com" 
              className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Mot de passe</label>
            <input 
              type="password" 
              placeholder="admin123" 
              className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="mt-4 bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            Se connecter
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 text-center mb-4 uppercase tracking-widest">Connexion Rapide (Test)</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: "Client Demo", email: "client@test.com", role: "client" },
              { label: "Vendeur Demo", email: "vendeur@test.com", role: "vendeur" },
              { label: "Admin Demo", email: "admin@test.com", role: "admin" }
            ].map(demo => (
              <button 
                key={demo.role}
                onClick={() => { setEmail(demo.email); setPassword("password123"); }}
                className="text-xs py-2 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700"
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-400">
          Pas encore de compte ? <Link href="/auth/register" className="text-yellow-500 hover:text-yellow-400 font-bold ml-1 transition">Créer un compte</Link>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center font-medium ${message.includes("réussie") ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
