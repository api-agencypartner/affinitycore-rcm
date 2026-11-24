'use client';
import { createContext, useContext } from 'react';

/** Optional home-page copy overrides, for copy previews. Empty on the live home page, so every section keeps its own text. */
export type HomeCopy = {
  heroTitle?: string[]; heroBold?: string[]; heroSub?: string;
  specialtiesLines?: string[]; servicesLines?: string[]; statesLines?: string[];
};
export const HomeCopyCtx = createContext<HomeCopy>({});
export const useHomeCopy = () => useContext(HomeCopyCtx);
