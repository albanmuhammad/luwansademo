"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Room } from "../data/rooms";
import { roomTypeMeta } from "../data/rooms";

interface FormState {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  country: string;
  checkIn: string;
  checkOut: string;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  phone: "",
  country: "",
  checkIn: "",
  checkOut: "",
};

export default function ReservationForm({ room }: { room: Room }) {
  const router = useRouter();
  const meta = roomTypeMeta[room.type];
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tunda unmount form sedikit supaya listener sitemap (yang mendengarkan
    // native "submit" event di form ini) sempat selesai memproses & mengirim
    // event ke Salesforce sebelum form-nya dicabut dari DOM oleh React.
    setTimeout(() => {
      setSubmitted(true);
    }, 150);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-zinc-200 p-8 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Reservasi Berhasil!</h2>
        <p className="text-zinc-600 max-w-md">
          Terima kasih {form.firstName}, reservasi Anda untuk {room.name} telah kami terima.
          Detail konfirmasi akan dikirim ke {form.email}.
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium"
        >
          Kembali ke Home
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-200 p-6 sm:p-8"
      data-sf-catalog-id={room.slug}
      data-sf-catalog-type={meta.catalogType}
      data-sf-category={meta.category}
      data-sf-name={room.name}
      data-sf-price={room.price}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nama Depan">
          <input required data-sf-field="firstName" value={form.firstName} onChange={update("firstName")} className={inputClass} />
        </Field>
        <Field label="Nama Belakang">
          <input required data-sf-field="lastName" value={form.lastName} onChange={update("lastName")} className={inputClass} />
        </Field>
        <Field label="Gender">
          <select required data-sf-field="gender" value={form.gender} onChange={update("gender")} className={inputClass}>
            <option value="">Pilih</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </Field>
        <Field label="Email">
          <input required type="email" data-sf-field="email" value={form.email} onChange={update("email")} className={inputClass} />
        </Field>
        <Field label="Nomor Telepon">
          <input required data-sf-field="phone" value={form.phone} onChange={update("phone")} className={inputClass} />
        </Field>
        <Field label="Negara Asal">
          <input required data-sf-field="country" value={form.country} onChange={update("country")} className={inputClass} />
        </Field>
        <Field label="Tanggal Check-in">
          <input required type="date" data-sf-field="checkIn" value={form.checkIn} onChange={update("checkIn")} className={inputClass} />
        </Field>
        <Field label="Tanggal Check-out">
          <input required type="date" data-sf-field="checkOut" value={form.checkOut} onChange={update("checkOut")} className={inputClass} />
        </Field>
      </div>

      <button id="beli-sekarang-btn" type="submit" data-sf-purchase-cta="" className="mt-2 rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:opacity-90">
        Beli Sekarang
      </button>
    </form>
  );
}

const inputClass =
  "rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-black";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-zinc-600">{label}</span>
      {children}
    </label>
  );
}