import SessionSkeleton from "@/components/skeleton/session-skeleton"

export default function Loading() {
  return (
    <div className="mt-40 w-full max-w-[640px] mx-auto">
      <SessionSkeleton />
    </div>
  )
}
