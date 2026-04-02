'use client';
import { create } from 'zustand';
import type { TabKey } from '@/types';

interface UIStore {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  glossarySearch: string;
  setGlossarySearch: (s: string) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  activeTab: 'bigPicture',
  setActiveTab: (tab) => set({ activeTab: tab }),
  navOpen: false,
  setNavOpen: (open) => set({ navOpen: open }),
  glossarySearch: '',
  setGlossarySearch: (s) => set({ glossarySearch: s }),
}));
