"use client"
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        setStatus("error");
        setMessage("Aucun jeton de vérification fourni.");
      }, 0);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/auth/verify/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch (err) {
        setStatus("error");
        setMessage("Erreur de connexion au serveur.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="bg-neutral-900/80 backdrop-blur-md p-10 rounded-3xl w-full max-w-md shadow-2xl border border-neutral-800 text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
          <h1 className="text-2xl font-black text-white">Vérification en cours...</h1>
          <p className="text-neutral-400 mt-2">Veuillez patienter pendant que nous validons votre email.</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-black text-white">Compte Vérifié !</h1>
          <p className="text-neutral-400 mt-2">{message}</p>
          <Link href="/auth/login" className="mt-8 inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition w-full">
            Se connecter
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-black text-white">Lien Invalide</h1>
          <p className="text-neutral-400 mt-2">{message}</p>
          <Link href="/auth/register" className="mt-8 inline-block bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white font-bold py-3 px-8 rounded-xl transition w-full">
            S&apos;inscrire à nouveau
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<p className="text-white text-center">Chargement...</p>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
