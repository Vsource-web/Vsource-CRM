"use client";

import { useEffect } from "react";
import { useAuth } from "@/store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasHydrated = useAuth((s) => s.hasHydrated);

  const hydrateUser = useAuth((s) => s.hydrateUser);

  useEffect(() => {
    if (hasHydrated) {
      hydrateUser();
    }
  }, [hasHydrated]);

  return <>{children}</>;
}
