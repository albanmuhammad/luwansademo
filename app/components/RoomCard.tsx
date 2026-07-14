import Link from "next/link";
import Image from "next/image";
import type { Room } from "../data/rooms";
import { roomTypeMeta } from "../data/rooms";

export default function RoomCard({ room }: { room: Room }) {
  const meta = roomTypeMeta[room.type];

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 overflow-hidden bg-white">
      <div className="relative h-48 w-full bg-zinc-100">
        <Image src={room.image} alt={room.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold">{room.name}</h3>
        <p className="text-sm text-zinc-600">{room.shortDescription}</p>
        <div className="flex gap-4 text-xs text-zinc-500 mt-1">
          <span>{room.capacity}</span>
          <span>{room.size}</span>
        </div>
        <p className="text-base font-semibold mt-2">
          Rp {room.price.toLocaleString("id-ID")}
          <span className="text-xs font-normal text-zinc-500"> / {room.type === "kamar" ? "malam" : "hari"}</span>
        </p>

        <div className="flex gap-3 mt-3">
          <Link
            href={`/${room.type === "kamar" ? "rooms" : "meetings"}/${room.slug}`}
            className="flex-1 text-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            View Detail
          </Link>
          <Link
            href={`/reservation/${room.type}/${room.slug}`}
            data-sf-add-to-cart=""
            data-sf-catalog-id={room.slug}
            data-sf-catalog-type={meta.catalogType}
            data-sf-category={meta.category}
            data-sf-name={room.name}
            data-sf-price={room.price}
            className="flex-1 text-center rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}