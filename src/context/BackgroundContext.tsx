"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BackgroundContextType {
  backdrop: string | null;
  setBackdrop: (url: string | null) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [backdrop, setBackdrop] = useState<string | null>(null);

  return (
    <BackgroundContext.Provider value={{ backdrop, setBackdrop }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
