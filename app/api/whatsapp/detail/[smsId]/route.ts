import { NextResponse } from "next/server";

const API_KEY = process.env.WHATSAPP_API_KEY!;

/**
 * POST /api/whatsapp/detail
 * Body: { SMS_ID, OUTLET_ID, PATIENT_ID, REG_NO, TEMPLATE_ID }
 * Dipanggil Salesforce buat ambil detail & parameter template WhatsApp
 * untuk satu SMS_ID tertentu (hasil loop dari /api/whatsapp/pending).
 *
 * DUMMY DATA — nanti diganti proxy ke API Axway internal (get-detail).
 */
export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { SMS_ID } = body;

  if (!SMS_ID) {
    return NextResponse.json({ error: "SMS_ID wajib diisi" }, { status: 400 });
  }

  // Dummy: dua kemungkinan data, sisanya fallback 404 biar gampang ketauan kalau salah SMS_ID
  const dummyDetails: Record<string, unknown> = {
    "2607285XXJ": {
      EXTERNAL_ID: "2607285XXJ-0040-0012170600301-CDG260000259-1",
      SMS_ID: "2607285XXJ",
      REG_NO: "CDG260000259",
      IMAGE_HEADER: "https://placehold.co/600x300/FFC907/000000?text=Prodia",
      PATIENT_ID: "0012170600301",
      TO: "6281298672616",
      OUTLET_ID: "0040",
      TEMPLATE_ID: "1",
      PARAM_BUTTON: "Home",
      PARAMETER: [
        { VALUE: "0012170600301", PARAMETER_ID: "1" },
        { VALUE: "CDG260000259", PARAMETER_ID: "2" },
        {
          VALUE:
            "U by Prodia link.prodia.co.id/ubyprodia atau web hasil.prodia.co.id.",
          PARAMETER_ID: "3",
        },
        { VALUE: "Terima kasih dan salam sehat selalu!", PARAMETER_ID: "4" },
      ],
    },
    "260728LKBJ": {
      EXTERNAL_ID: "260728LKBJ-0040-0040230400013-2511140005-1",
      SMS_ID: "260728LKBJ",
      REG_NO: "2511140005",
      IMAGE_HEADER: "https://placehold.co/600x300/FFC907/000000?text=Prodia",
      PATIENT_ID: "0040230400013",
      TO: "6287738249181",
      OUTLET_ID: "0040",
      TEMPLATE_ID: "1",
      PARAM_BUTTON: "Home",
      PARAMETER: [
        { VALUE: "0040230400013", PARAMETER_ID: "1" },
        { VALUE: "2511140005", PARAMETER_ID: "2" },
        {
          VALUE:
            "U by Prodia link.prodia.co.id/ubyprodia atau web hasil.prodia.co.id.",
          PARAMETER_ID: "3",
        },
        { VALUE: "Terima kasih dan salam sehat selalu!", PARAMETER_ID: "4" },
      ],
    },
  };

  const detail = dummyDetails[SMS_ID];

  if (!detail) {
    return NextResponse.json(
      { error: `Data untuk SMS_ID ${SMS_ID} tidak ditemukan` },
      { status: 404 },
    );
  }

  return NextResponse.json(detail);
}
