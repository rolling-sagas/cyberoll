import SessionSkeleton from "./session-skeleton";

export default function StoryListSkeleton() {
  return (
    <div className="flex flex-col gap-4 mx-6 my-4">
      <SessionSkeleton />
      <SessionSkeleton />
      <SessionSkeleton />
      <SessionSkeleton />
    </div>
  )
}
