"use client"
import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useLangStore } from "../store/langStore";
import { translations } from "../locales";

export default function ReviewForm({ parfumId, onSubmitted }: { parfumId: string; onSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const lang = useLangStore((state: any) => state.lang) as keyof typeof translations;
  const t = translations[lang].product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setMessage("Veuillez choisir une note."); return; }
    setStatus("loading");
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Vous devez être connecté pour laisser un avis.");
      setStatus("error");
      return;
    }
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ parfumId, rating, comment })
    });
    if (res.ok) {
      setStatus("success");
      setMessage("Merci pour votre avis !");
      setComment("");
      setRating(0);
      setTimeout(() => { setStatus("idle"); setMessage(""); onSubmitted(); }, 2000);
    } else {
      const data = await res.json();
      setMessage(data.message || "Erreur lors de la soumission.");
      setStatus("error");
    }
  };

  return (
    <div className="mt-10 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-6">{t.leaveReview}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Star Rating */}
        <div>
          <p className="text-sm text-neutral-400 mb-2">Note :</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star className={`w-8 h-8 transition-colors ${(hovered || rating) >= star ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-600'}`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-neutral-400 mb-2 block">{t.comment} :</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
            rows={3}
            placeholder={t.shareExperience}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
          />
        </div>
        {message && (
          <p className={`text-sm px-3 py-2 rounded-lg ${status === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message}</p>
        )}
        <button type="submit" disabled={status === "loading" || status === "success"}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start">
          <Send className="w-4 h-4" />
          {status === "loading" ? t.sending : status === "success" ? t.published : t.publish}
        </button>
      </form>
    </div>
  );
}
