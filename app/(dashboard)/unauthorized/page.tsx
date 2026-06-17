// app/unauthorized/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">403</h1>

      <p className="text-muted-foreground mt-2">
        You do not have permission to access this page.
      </p>

      <Button
        onClick={() => router.back()}
        className="mt-4 px-4 py-2 rounded-md border"
      >
        Go Back
      </Button>
    </div>
  );
}
