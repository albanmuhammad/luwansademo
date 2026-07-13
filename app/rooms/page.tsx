import Tabs from "../components/Tabs";
import RoomCard from "../components/RoomCard";
import { getRoomsByType } from "../data/rooms";

export default function RoomsPage() {
  const kamar = getRoomsByType("kamar");

  return (
    <div className="flex flex-col flex-1">
      <Tabs />
      <main className="flex flex-1 flex-col gap-6 px-6 sm:px-16 py-10">
        <h1 className="text-2xl font-semibold">Pilihan Kamar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kamar.map((room) => (
            <RoomCard key={room.slug} room={room} />
          ))}
        </div>
      </main>
    </div>
  );
}
