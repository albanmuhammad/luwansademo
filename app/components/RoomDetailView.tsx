"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Room } from "../data/rooms";
import { roomTypeMeta } from "../data/rooms";
import { trackViewItem } from "../../lib/salesforce/track";

export default function RoomDetailView({ room }: { room: Room }) {
  const meta = roomTypeMeta[room.type];

  useEffect(() => {
    trackViewItem({
      id: room.slug,
      name: room.name,
      type: meta.catalogType,
      category: meta.category,
      price: room.price,
    });
    // hanya perlu sekali per kunjungan halaman detail
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.slug]);

  return (
    <div className="flex flex-col gap-6 px-6 sm:px-16 py-10 max-w-3xl">
      <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image src={room.image} alt={room.name} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{room.name}</h1>
        <div className="flex gap-4 text-sm text-zinc-500">
          <span>{room.capacity}</span>
          <span>{room.size}</span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">{room.description}</p>
        <p className="text-xl font-semibold mt-2">
          Rp {room.price.toLocaleString("id-ID")}
          <span className="text-sm font-normal text-zinc-500"> / {room.type === "kamar" ? "malam" : "hari"}</span>
        </p>
      </div>

      <Link
        href={`/reservation/${room.type}/${room.slug}`}
        className="w-fit rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-sm font-medium hover:opacity-90"
      >
        Pesan Sekarang
      </Link>
    </div>
  );
}
