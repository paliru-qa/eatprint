// Vercel Function: GET/POST a diary's data by id, backed by Upstash Redis
// REST API. No login, no server-side auth check — the id itself IS the
// access token, same as LeafLog's link-based model.
//
// Save model (MVP, intentionally simple): the whole diary is stored as one
// JSON blob per id. POST always overwrites the entire blob — there is no
// merge/diff logic, so if two tabs or devices save around the same time,
// the last write to reach this endpoint silently wins. Fine for a
// single-person MVP diary; would need real conflict handling before
// supporting simultaneous multi-device editing.
export const config = { runtime: "edge" };

// Accepts both crypto.randomUUID() ("8-4-4-4-12" hex with hyphens) and the
// getRandomValues() hex-string fallback used when randomUUID isn't available.
const ID_PATTERN = /^[0-9a-f-]{8,64}$/i;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function upstashConfig(): { baseUrl: string; token: string } | null {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!baseUrl || !token) return null;
  return { baseUrl, token };
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";

  if (!ID_PATTERN.test(id)) {
    return json({ error: "invalid_id" }, 400);
  }

  const config = upstashConfig();
  if (!config) {
    // Storage genuinely isn't available right now — say so honestly (503),
    // rather than a fake 200 "success". The frontend (useDiaryStorage)
    // still degrades gracefully to localStorage; that's a client-side UX
    // choice, not something the API should paper over with a false status.
    return json({ error: "storage_not_configured" }, 503);
  }

  const key = `eatprint:diary:${id}`;
  const headers = { Authorization: `Bearer ${config.token}` };

  if (request.method === "GET") {
    const res = await fetch(`${config.baseUrl}/get/${key}`, { headers });
    if (!res.ok) return json({ error: "storage_error" }, 502);

    const data = await res.json();
    if (!data.result) return json({ entriesByDate: {} }, 200);

    try {
      const entriesByDate = JSON.parse(data.result);
      return json({ entriesByDate }, 200);
    } catch {
      return json({ entriesByDate: {} }, 200);
    }
  }

  if (request.method === "POST" || request.method === "PUT") {
    let body: { entriesByDate?: unknown };
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid_body" }, 400);
    }

    const value = JSON.stringify(body.entriesByDate ?? {});
    const res = await fetch(`${config.baseUrl}/set/${key}`, {
      method: "POST",
      headers,
      body: value,
    });
    if (!res.ok) return json({ error: "storage_error" }, 502);

    return json({ ok: true }, 200);
  }

  return json({ error: "method_not_allowed" }, 405);
}
