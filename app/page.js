import Messages from "@/components/play/messages";
import PinnedColumns from "@/components/play/pinned-columns";

export const runtime = "edge";

export default async function Page() {
  return (
    <>
      <Messages />
      <PinnedColumns />
    </>
  );
}
