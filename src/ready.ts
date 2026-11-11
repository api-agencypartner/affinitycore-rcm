'use client';
import { createContext, useContext } from 'react';
/** false while the intro loader is on screen; pages use it to start their entrance animations after it. */
export const ReadyContext = createContext(true);
export const useReady = () => useContext(ReadyContext);
