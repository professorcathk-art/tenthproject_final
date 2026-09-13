"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { JoinModal } from "@/components/membership/join-modal";

interface JoinLifetimeContextValue {
  openJoinLifetime: () => void;
}

const JoinLifetimeContext = createContext<JoinLifetimeContextValue | null>(null);

export function JoinLifetimeProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({
      openJoinLifetime: () => setOpen(true),
    }),
    [],
  );

  return (
    <JoinLifetimeContext.Provider value={value}>
      {children}
      <JoinModal open={open} onOpenChange={setOpen} />
    </JoinLifetimeContext.Provider>
  );
}

export function useJoinLifetime() {
  const context = useContext(JoinLifetimeContext);
  if (!context) {
    throw new Error("useJoinLifetime must be used within JoinLifetimeProvider");
  }
  return context;
}
