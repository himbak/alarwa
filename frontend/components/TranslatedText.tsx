"use client"
import { useLangStore } from "../store/langStore";
import { translations } from "../locales";

export default function TranslatedText({ tKey }: { tKey: string }) {
  const lang = useLangStore(state => state.lang);
  const keys = tKey.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let text: any = translations[lang];
  keys.forEach(k => { 
    if(text) text = text[k]; 
  });
  return <>{text || tKey}</>;
}
