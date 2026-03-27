import { create } from 'zustand';

interface NavbarStore {
  customHeading: string | null;
  setCustomHeading: (heading: string | null) => void;
}

export const useNavbarStore = create<NavbarStore>((set) => ({
  customHeading: null,
  setCustomHeading: (heading: string | null) => set({ customHeading: heading }),
}));
