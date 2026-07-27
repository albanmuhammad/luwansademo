/**
 * Data Cloud Ingestion API client — Client Credentials Flow.
 *
 * Alur (2 tahap token exchange, wajib urut):
 * 1) Client Credentials -> core Salesforce access token
 * 2) Exchange core token -> Data Cloud token + Data Cloud instance URL
 * 3) POST record ke Ingestion API pakai Data Cloud token
 */

const SF_LOGIN_URL = process.env.SF_LOGIN_URL!; // contoh: https://mydomain.my.salesforce.com
const SF_CLIENT_ID = process.env.SF_CLIENT_ID!;
const SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET!;
const SF_INGEST_CONNECTOR = process.env.SF_INGEST_CONNECTOR!; // nama Ingestion API Connector

interface CoreTokenResponse {
  access_token: string;
  instance_url: string;
  token_type: string;
}

interface DataCloudTokenResponse {
  access_token: string;
  instance_url: string; // domain *.c360a.salesforce.com
  token_type: string;
  expires_in: number;
}

let cachedDcToken: { token: DataCloudTokenResponse; expiresAt: number } | null =
  null;

async function getCoreToken(): Promise<CoreTokenResponse> {
  const res = await fetch(`${SF_LOGIN_URL}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: SF_CLIENT_ID,
      client_secret: SF_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Gagal ambil core token (${res.status}): ${await res.text()}`,
    );
  }

  return res.json();
}

async function exchangeForDataCloudToken(
  core: CoreTokenResponse,
): Promise<DataCloudTokenResponse> {
  const res = await fetch(`${core.instance_url}/services/a360/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:salesforce:grant-type:external:cdp",
      subject_token: core.access_token,
      subject_token_type: "urn:ietf:params:oauth:token-type:access_token",
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Gagal exchange Data Cloud token (${res.status}): ${await res.text()}`,
    );
  }

  return res.json();
}

async function getDataCloudToken(): Promise<DataCloudTokenResponse> {
  if (cachedDcToken && Date.now() < cachedDcToken.expiresAt) {
    return cachedDcToken.token;
  }

  const core = await getCoreToken();
  const dc = await exchangeForDataCloudToken(core);

  cachedDcToken = {
    token: dc,
    // beri buffer 60 detik dari expires_in yang dikirim Salesforce
    expiresAt: Date.now() + (dc.expires_in - 60) * 1000,
  };

  return dc;
}

/**
 * Kirim satu batch record ke Data Cloud lewat Ingestion API (streaming pattern).
 * objectName = nama object yang sudah di-deploy di Ingestion API Connector (mis. "SalesCustomer").
 * records = array of object sesuai schema yang kamu definisikan.
 */
export async function ingestToDataCloud(
  objectName: string,
  records: Record<string, unknown>[],
) {
  const dc = await getDataCloudToken();

  const res = await fetch(
    `https://${dc.instance_url}/api/v1/ingest/sources/${SF_INGEST_CONNECTOR}/${objectName}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dc.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: records }),
    },
  );

  if (!res.ok) {
    throw new Error(`Ingestion gagal (${res.status}): ${await res.text()}`);
  }

  // Berhasil biasanya 202 Accepted, data muncul di Data Cloud setelah data stream refresh (~2-3 menit)
  return res.status;
}
