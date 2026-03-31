import { create } from 'zustand';

interface NavbarStore {
  customHeading: string | null;
  customSubHeading: string | null;
  setCustomHeadings: (heading: string | null, subHeading: string | null) => void;
}

export const useNavbarStore = create<NavbarStore>((set) => ({
  customHeading: null,
  customSubHeading: null,
  setCustomHeadings:
    (heading: string | null, subHeading: string | null) =>
      set({ customHeading: heading, customSubHeading: subHeading }),
}));
