"use client"
import { useCartStore } from "../../store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLangStore } from "../../store/langStore";
import { translations } from "../../locales";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing" | "success">("idle");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });
  const router = useRouter();
  
  const lang = useLangStore((state: any) => state.lang) as keyof typeof translations;
  const t = translations[lang].cart;

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setCheckoutStatus("processing");
    try {
      const orderPayload = {
        products: items.map(item => ({
          parfumId: item.parfumId,
          sellerId: item.sellerId || "000000000000000000000000",
          quantity: item.quantity,
          priceAtPurchase: item.price
        })),
        totalAmount: finalPrice,
        shippingAddress: {
          fullName: "Client",
          address: "Adresse de livraison",
          city: "Casablanca",
          postalCode: "20000",
          country: "Maroc"
        },
        paymentMethod: "Carte Bancaire"
      };

      const res = await fetch("http://127.0.0.1:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        setCheckoutStatus("success");
        clearCart();
      } else {
        const data = await res.json();
        alert(data.message || "Erreur lors de la commande");
        setCheckoutStatus("idle");
      }
    } catch {
      alert("Erreur de connexion au serveur");
      setCheckoutStatus("idle");
    }
  };

  const applyPromo = async () => {
    setPromoMessage({ text: "Vérification...", type: "info" });
    const res = await fetch("http://127.0.0.1:5000/api/promos/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCodeInput })
    });
    const data = await res.json();
    if (res.ok) {
      setDiscount(data.discountPercentage);
      setPromoMessage({ text: `Code appliqué : -${data.discountPercentage}%`, type: "success" });
    } else {
      setDiscount(0);
      setPromoMessage({ text: data.message || "Code invalide", type: "error" });
    }
  };

  const finalPrice = totalPrice() * (1 - discount / 100);

  if (!isClient) return null;

  if (checkoutStatus === "success") {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
          <h1 className="text-3xl font-bold text-white mb-4">{t.success}</h1>
          <p className="text-neutral-400 mb-8">{t.successDesc}</p>
          <Link href="/" className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition">
            {t.backHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-950 text-white py-12 px-4 sm:px-6 md:px-8 ${lang === 'ar' ? 'rtl' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-extrabold mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.title}</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-3xl">
            <p className="text-neutral-400 text-xl mb-6">{t.empty}</p>
            <Link href="/catalog" className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition">
              {t.discover}
            </Link>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div key={item.parfumId} className={`flex gap-6 bg-neutral-900 p-4 rounded-2xl border border-neutral-800 items-center overflow-x-auto ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="relative w-20 h-28 md:w-24 md:h-32 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className={`flex-grow min-w-0 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-bold text-lg text-white truncate">{item.name}</h3>
                    <p className="text-neutral-400 text-sm mb-2">{item.brand}</p>
                    <p className="font-bold text-yellow-500">{item.price} MAD</p>
                  </div>
                  <div className={`flex flex-col md:flex-row items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center bg-neutral-950 rounded-lg border border-neutral-700">
                      <button onClick={() => updateQuantity(item.parfumId, Math.max(1, item.quantity - 1))} className="px-3 py-1 text-neutral-400 hover:text-white">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.parfumId, item.quantity + 1)} className="px-3 py-1 text-neutral-400 hover:text-white">+</button>
                    </div>
                    <button onClick={() => removeItem(item.parfumId)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={`bg-neutral-900 border border-neutral-800 p-8 rounded-3xl h-fit sticky top-24 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <h2 className="text-2xl font-bold mb-6">{t.summary}</h2>
              <div className={`flex justify-between mb-4 text-neutral-400 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{t.subtotal}</span>
                <span>{totalPrice()} MAD</span>
              </div>
              <div className={`flex justify-between mb-6 text-neutral-400 border-b border-neutral-800 pb-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{t.shipping}</span>
                <span className="text-green-500">{t.free}</span>
              </div>

              <div className="mb-6 border-b border-neutral-800 pb-6">
                <div className={`flex gap-2 mb-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <input type="text" value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value)} placeholder={lang === 'ar' ? "كود الخصم" : "Code promo"} className={`w-full bg-neutral-800 border-none rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-yellow-500 ${lang === 'ar' ? 'text-right' : ''}`}/>
                  <button onClick={applyPromo} className="bg-neutral-700 hover:bg-neutral-600 px-4 rounded-lg font-bold transition">{lang === 'ar' ? "تطبيق" : "Appliquer"}</button>
                </div>
                {promoMessage.text && <p className={`text-sm ${promoMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{promoMessage.text}</p>}
              </div>

              <div className={`flex justify-between mb-8 text-xl font-bold text-white ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{t.total}</span>
                <span className="text-yellow-500">{finalPrice.toFixed(0)} MAD</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkoutStatus === "processing"}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition flex justify-center items-center gap-2"
              >
                {checkoutStatus === "processing" ? t.processing : t.checkout}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
