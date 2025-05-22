import SessionSkeleton from "./session-skeleton";

export default function StoryListSkeleton({px = true}) {
  return (
    <div className={`flex flex-col gap-4 my-4 ${px ? 'px-6' : ''}`}>
      <SessionSkeleton px={false}/>
      <SessionSkeleton px={false}/>
      <SessionSkeleton px={false}/>
      <SessionSkeleton px={false} />
    </div>
  )
}
