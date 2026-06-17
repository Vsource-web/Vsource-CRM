import { Skeleton } from "@/components/ui/skeleton";

export default function RoleSidebarSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
