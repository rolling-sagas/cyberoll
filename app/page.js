import PinnedColumns from "@/components/columns/pinned-columns";
import Threads from "@/components/columns/threads/threads";

export const runtime = "edge";

export default async function Page() {
  return (
    <>
      <Threads />
      <PinnedColumns />
    </>
  );
}
