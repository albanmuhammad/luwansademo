import { NextResponse } from "next/server";

const API_KEY = process.env.WHATSAPP_API_KEY!;

/**
 * POST /api/whatsapp/update-data
 * Body: { SMS_ID, OUTLET_ID, PATIENT_ID, REG_NO, TEMPLATE_ID, TRX_ID, STATUS }
 * STATUS: "SUCCESS" | "FAILED"
 *
 * Dipanggil Salesforce (Segment-Triggered Flow, setelah kirim WhatsApp)
 * untuk lapor balik status pengiriman.
 *
 * DUMMY — nanti diganti proxy ke API Axway internal (update-data).
 */
export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { SMS_ID, OUTLET_ID, PATIENT_ID, REG_NO, TEMPLATE_ID, TRX_ID, STATUS } =
    body;

  if (!SMS_ID || !STATUS) {
    return NextResponse.json(
      { error: "SMS_ID dan STATUS wajib diisi" },
      { status: 400 },
    );
  }

  if (STATUS !== "SUCCESS" && STATUS !== "FAILED") {
    return NextResponse.json(
      { error: "STATUS harus SUCCESS atau FAILED" },
      { status: 400 },
    );
  }

  // TODO: forward ke API Axway internal (update-data), atau update DB sendiri
  console.log("Update data diterima:", {
    SMS_ID,
    OUTLET_ID,
    PATIENT_ID,
    REG_NO,
    TEMPLATE_ID,
    TRX_ID,
    STATUS,
  });

  return NextResponse.json({ received: true });
}
