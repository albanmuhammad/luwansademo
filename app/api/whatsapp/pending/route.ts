import { NextResponse } from "next/server";

const API_KEY = process.env.WHATSAPP_API_KEY!;

/**
 * GET /api/whatsapp/pending
 * Dipanggil Salesforce (Apex/Flow HTTP Callout) untuk ambil daftar
 * notifikasi WhatsApp yang siap dikirim.
 *
 * DUMMY DATA — nanti diganti proxy ke API Axway internal (get-data).
 */
export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dummyList = {
    LIST_DATA: [
      {
        SMS_TYPE: "1",
        EXTERNAL_ID: "2607285XXJ-0040-0012170600301-CDG260000259-1",
        SMS_ID: "2607285XXJ",
        REG_NO: "CDG260000259",
        HP: "6281298672616",
        PATIENT_ID: "0012170600301",
        OUTLET_ID: "0040",
      },
      {
        SMS_TYPE: "1",
        EXTERNAL_ID: "260728LKBJ-0040-0040230400013-2511140005-1",
        SMS_ID: "260728LKBJ",
        REG_NO: "2511140005",
        HP: "6287738249181",
        PATIENT_ID: "0040230400013",
        OUTLET_ID: "0040",
      },
    ],
  };

  return NextResponse.json(dummyList);
}
