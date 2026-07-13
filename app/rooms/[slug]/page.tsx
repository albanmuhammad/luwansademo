import { notFound } from "next/navigation";
import Tabs from "../../components/Tabs";
import RoomDetailView from "../../components/RoomDetailView";
import { getRoomBySlug } from "../../data/rooms";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = getRoomBySlug("kamar", slug);
  if (!room) return notFound();

  return (
    <div className="flex flex-col flex-1">
      <Tabs />
      <RoomDetailView room={room} />
    </div>
  );
}