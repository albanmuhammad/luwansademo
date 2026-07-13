export type RoomType = "kamar" | "meeting";

export interface Room {
  slug: string;
  type: RoomType;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  price: number;
  capacity: string; // "2 org" atau "80 org (theater)"
  size: string; // "28 m2"
}

export const rooms: Room[] = [
  {
    slug: "deluxe-room",
    type: "kamar",
    name: "Deluxe Room",
    shortDescription: "Kamar nyaman dengan pemandangan kota Jakarta.",
    description:
      "Deluxe Room menawarkan kenyamanan modern dengan tempat tidur king-size, smart TV, dan pemandangan kota Jakarta yang luas. Cocok untuk perjalanan bisnis maupun liburan singkat.",
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2024/11/JS-Luwansa-Deluxe-Twin-Room.jpg",
    price: 950000,
    capacity: "2 dewasa",
    size: "28 m2",
  },
  {
    slug: "premiere-room",
    type: "kamar",
    name: "Premiere Room",
    shortDescription: "Suite luas dengan ruang tamu terpisah.",
    description:
      "Premiere Room menghadirkan ruang tamu terpisah, akses Executive Lounge, dan fasilitas premium untuk tamu yang mengutamakan privasi dan kenyamanan ekstra.",
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2024/11/JS-Luwansa-Premier-Room-1-2200x1200.jpg",
    price: 1650000,
    capacity: "2 dewasa, 1 anak",
    size: "45 m2",
  },
  {
    slug: "ambassador-room",
    type: "kamar",
    name: "Ambassador Room",
    shortDescription: "Ideal untuk liburan keluarga dengan dua tempat tidur.",
    description:
      "Ambassador Room Dirancang untuk wisatawan yang menginginkan pengalaman menginap yang lebih maksimal, Ambassador Club memadukan akomodasi elegan dengan akses ke berbagai manfaat eksklusif.",
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2024/11/JS-Luwansa-Ambassador-Room-2-1-2200x1200.jpg",
    price: 1250000,
    capacity: "4 orang",
    size: "38 m2",
  },
  {
    slug: "grand-ballroom",
    type: "meeting",
    name: "Grand Ballroom",
    shortDescription:
      "Ruang serbaguna untuk konvensi & gala dinner skala besar.",
    description:
      "Grand Ballroom adalah ruang meeting terbesar di JS Luwansa, dapat dibagi menjadi beberapa section, cocok untuk konferensi, wedding, dan gala dinner hingga 800 orang.",
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2025/04/Ballroom-resize.jpg",
    price: 25000000,
    capacity: "800 org (theater)",
    size: "600 m2",
  },
  {
    slug: "board-room",
    type: "meeting",
    name: "Board Room",
    shortDescription: "Ruang rapat eksklusif untuk pertemuan tingkat direksi.",
    description:
      "Board Room dirancang untuk rapat formal dan diskusi strategis, dilengkapi meja konferensi premium, sistem video conference, dan privasi penuh.",
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2025/04/Rapha-_-Nissi-12-2-2200x1200.jpg",
    price: 3500000,
    capacity: "16 org (boardroom)",
    size: "50 m2",
  },
  {
    slug: "meeting-room-2",
    type: "meeting",
    name: "Meeting Room 2",
    shortDescription: "Ruang meeting fleksibel untuk workshop dan training.",
    description:
      "Meeting Room 2 cocok untuk workshop, training, maupun rapat kelompok menengah dengan tata letak yang fleksibel sesuai kebutuhan acara Anda.",
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2025/04/Rapha_-Nissi-5-6-1-2200x1200.jpg",
    price: 4500000,
    capacity: "120 org (theater)",
    size: "150 m2",
  },
];

export function getRoomsByType(type: RoomType) {
  return rooms.filter((room) => room.type === type);
}

export function getRoomBySlug(type: RoomType, slug: string) {
  return rooms.find((room) => room.type === type && room.slug === slug);
}

/** type -> label & category yang dipakai untuk Salesforce (b2c vs b2b) */
export const roomTypeMeta = {
  kamar: {
    label: "Kamar",
    catalogType: "Kamar" as const,
    category: "b2c" as const,
  },
  meeting: {
    label: "Ruang Meeting",
    catalogType: "RuangMeeting" as const,
    category: "b2b" as const,
  },
};
