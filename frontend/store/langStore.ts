import { create } from 'zustand';

interface LangState {
  lang: 'fr' | 'ar';
  setLang: (lang: 'fr' | 'ar') => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: 'fr',
  setLang: (lang) => set({ lang }),
}));
