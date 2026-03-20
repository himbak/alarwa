"use client"
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useLangStore } from "../store/langStore";
import { translations } from "../locales";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddToCartButton({ parfum }: { parfum: any }) {
  const addItem = useCartStore(state => state.addItem);
  const { lang } = useLangStore();
  const t = translations[lang].product;

  const handleAdd = () => {
    addItem({
      parfumId: parfum._id,
      name: parfum.name,
      brand: parfum.brand,
      price: parfum.price,
      image: parfum.image,
      quantity: 1
    });
  }

  return (
    <button 
      onClick={handleAdd}
      className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-xl transition-colors duration-200 flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]"
    >
      <ShoppingBag className="w-5 h-5" />
      <span>{t.addToCart}</span>
    </button>
  );
}
