import { Skeleton } from "@/components/ui/skeleton";

export default function PermissionMatrixSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-52" />

      <Skeleton className="h-4 w-80" />

      <div className="space-y-3">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
