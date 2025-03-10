import { Skeleton } from "@/components/ui/skeleton"

export default function ColumnSkeleton() {
  return (
    <div className="mt-40 w-full max-w-[640px] mx-auto flex flex-col gap-4 my-4">
      <Skeleton className="h-6 w-1/5" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-6 w-1/5" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-6 w-1/4" />
    </div>
  )
}
