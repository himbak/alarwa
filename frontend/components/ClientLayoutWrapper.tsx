"use client"
import { useEffect } from "react";
import { useLangStore } from "../store/langStore";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const lang = useLangStore(state => state.lang);
  
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return <>{children}</>;
}
