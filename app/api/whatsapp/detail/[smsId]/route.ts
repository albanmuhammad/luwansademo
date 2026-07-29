import { NextResponse } from "next/server";

const API_KEY = process.env.WHATSAPP_API_KEY!;

/**
 * GET /api/whatsapp/detail/:smsId
 * Dipanggil Salesforce Flow untuk ambil detail data & parameter template
 * WhatsApp buat satu SMS_ID tertentu (hasil loop dari /api/whatsapp/pending).
 *
 * DUMMY DATA — nanti diganti query ke database/sistem asli berdasarkan smsId.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ smsId: string }> },
) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { smsId } = await params;

  // Dummy: dua kemungkinan data, sisanya fallback generik biar tetap bisa dites
  const dummyDetails: Record<string, unknown> = {
    "2607285XXJ": {
      SMS_ID: "2607285XXJ",
      REG_NO: "CDG260000259",
      IMAGE_HEADER: "https://placehold.co/600x300/FFC907/000000?text=Prodia",
      PATIENT_ID: "0012170600301",
      TO: "6281233339921",
      OUTLET_ID: "0040",
      TEMPLATE_ID: "1",
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
      SMS_ID: "260728LKBJ",
      REG_NO: "2511140005",
      IMAGE_HEADER: "https://placehold.co/600x300/FFC907/000000?text=Prodia",
      PATIENT_ID: "0040230400013",
      TO: "6281233339921",
      OUTLET_ID: "0040",
      TEMPLATE_ID: "1",
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

  const detail = dummyDetails[smsId];

  if (!detail) {
    return NextResponse.json(
      { error: `Data untuk SMS_ID ${smsId} tidak ditemukan` },
      { status: 404 },
    );
  }

  return NextResponse.json(detail);
}
