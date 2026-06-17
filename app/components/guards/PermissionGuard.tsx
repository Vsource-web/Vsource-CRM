// components/guards/PermissionGuard.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/store";
import { routePermissions } from "@/rbac/routePermissions";

export default function PermissionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { canRead, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const matchedRoute = Object.keys(routePermissions)
      .sort((a, b) => b.length - a.length)
      .find((route) => pathname.startsWith(route));

    if (!matchedRoute) return;

    const moduleCode = routePermissions[matchedRoute];

    if (!canRead(moduleCode)) {
      router.replace("/unauthorized");
    }
  }, [pathname, router, canRead, isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
