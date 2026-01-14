import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MapState {
  style: string;
  setStyle: (style: string) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      style: "bing",
      setStyle: (style) => set({ style }),
    }),
    {
      name: "map-controls",
    },
  ),
);
