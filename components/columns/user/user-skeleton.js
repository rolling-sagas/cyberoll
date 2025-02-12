import { Skeleton } from "@/components/ui/skeleton"

export default function UserSkeleton() {
  return (
    <div className="flex w-full gap-12">
      <div className="w-full flex-shrink gap-4">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
    </div>
  )
}
