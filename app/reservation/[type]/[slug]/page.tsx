import { notFound } from "next/navigation";
import Tabs from "../../../components/Tabs";
import ReservationForm from "../../../components/ReservationForm";
import { getRoomBySlug, type RoomType } from "../../../data/rooms";

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type: rawType, slug } = await params;
  const type = rawType as RoomType;
  if (type !== "kamar" && type !== "meeting") return notFound();

  const room = getRoomBySlug(type, slug);
  if (!room) return notFound();

  return (
    <div className="flex flex-col flex-1">
      <Tabs />
      <main className="flex flex-col gap-6 px-6 sm:px-16 py-10 max-w-2xl">
        <div>
          <h1 className="text-2xl font-semibold">Reservasi: {room.name}</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Lengkapi data di bawah ini untuk menyelesaikan reservasi Anda.
          </p>
        </div>
        <ReservationForm room={room} />
      </main>
    </div>
  );
}