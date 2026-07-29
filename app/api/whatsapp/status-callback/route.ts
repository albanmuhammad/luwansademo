import { NextResponse } from "next/server";

const API_KEY = process.env.WHATSAPP_API_KEY!;

/**
 * POST /api/whatsapp/status-callback
 * Dipanggil oleh Salesforce Flow (Flow A saat kirim, atau Flow B saat status berubah)
 * untuk melaporkan status pengiriman WhatsApp per SMS_ID.
 *
 * Body contoh:
 * {
 *   "SMS_ID": "260728LKBJ",
 *   "REG_NO": "2511140005",
 *   "PATIENT_ID": "0040230400013",
 *   "OUTLET_ID": "0040",
 *   "HP": "6281233339921",
 *   "STATUS": "SENT",           // SENT | DELIVERED | READ | NOT_SENT | FAILED
 *   "MESSAGE_ID": "wamid.HBgL...",
 *   "ERROR_CODE": null,
 *   "ERROR_MESSAGE": null,
 *   "EVENT_TIME": "2026-07-28T10:05:00.000Z"
 * }
 */
export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      SMS_ID,
      REG_NO,
      PATIENT_ID,
      OUTLET_ID,
      HP,
      STATUS,
      MESSAGE_ID,
      ERROR_CODE,
      ERROR_MESSAGE,
      EVENT_TIME,
    } = body;

    if (!SMS_ID || !STATUS) {
      return NextResponse.json(
        { error: "SMS_ID dan STATUS wajib diisi" },
        { status: 400 },
      );
    }

    // TODO: update status di sistem/database kamu berdasarkan SMS_ID atau REG_NO.
    // Kalau list & detail endpoint tadi datangnya dari sistem lain (bukan Next.js ini),
    // mungkin kamu perlu forward update ini ke sistem itu juga (call API mereka di sini).

    console.log("WhatsApp status callback:", {
      SMS_ID,
      REG_NO,
      PATIENT_ID,
      OUTLET_ID,
      HP,
      STATUS,
      MESSAGE_ID,
      ERROR_CODE,
      ERROR_MESSAGE,
      EVENT_TIME,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
