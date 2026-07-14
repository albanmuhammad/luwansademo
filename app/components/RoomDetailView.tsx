import Image from "next/image";
import Link from "next/link";
import type { Room } from "../data/rooms";
import { roomTypeMeta } from "../data/rooms";

export default function RoomDetailView({ room }: { room: Room }) {
  const meta = roomTypeMeta[room.type];

  return (
    <div
      className="flex flex-col gap-6 px-6 sm:px-16 py-10 max-w-3xl"
      data-sf-catalog-id={room.slug}
      data-sf-catalog-type={meta.catalogType}
      data-sf-category={meta.category}
      data-sf-name={room.name}
      data-sf-price={room.price}
    >
      <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-zinc-100">
        <Image src={room.image} alt={room.name} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{room.name}</h1>
        <div className="flex gap-4 text-sm text-zinc-500">
          <span>{room.capacity}</span>
          <span>{room.size}</span>
        </div>
        <p className="text-zinc-600">{room.description}</p>
        <p className="text-xl font-semibold mt-2">
          Rp {room.price.toLocaleString("id-ID")}
          <span className="text-sm font-normal text-zinc-500"> / {room.type === "kamar" ? "malam" : "hari"}</span>
        </p>
      </div>

      <Link
        href={`/reservation/${room.type}/${room.slug}`}
        data-sf-add-to-cart=""
        data-sf-catalog-id={room.slug}
        data-sf-catalog-type={meta.catalogType}
        data-sf-category={meta.category}
        data-sf-name={room.name}
        data-sf-price={room.price}
        className="w-fit rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:opacity-90"
      >
        Pesan Sekarang
      </Link>
    </div>
  );
}