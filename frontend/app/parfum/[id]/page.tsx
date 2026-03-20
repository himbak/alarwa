import ParfumDetailClient from "../../../components/ParfumDetailClient";

async function getParfum(id: string) {
  const res = await fetch(`http://127.0.0.1:5000/api/parfums/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getReviews(parfumId: string) {
  const res = await fetch(`http://127.0.0.1:5000/api/reviews/parfum/${parfumId}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getAllParfums() {
  const res = await fetch("http://127.0.0.1:5000/api/parfums", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ParfumDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [parfum, reviews, allParfums] = await Promise.all([getParfum(id), getReviews(id), getAllParfums()]);

  if (!parfum) {
    return <div className="text-center py-20 text-white min-h-screen">Produit introuvable.</div>;
  }

  return <ParfumDetailClient parfum={parfum} initialReviews={reviews} allParfums={allParfums} />;
}
