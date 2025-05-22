import { Skeleton } from "@/components/ui/skeleton"

export default function SessionSkeleton({px = true}) {
  return (
    <div className={`flex flex-col gap-4 my-4 ${px ? 'px-6' : ''}`}>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-6 w-1/4" />
    </div>
  )
}
