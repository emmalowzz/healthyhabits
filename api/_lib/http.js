// Shared helpers for api/* handlers. Files under api/_lib are not exposed as routes on
// file-based serverless hosts (e.g. Vercel ignores paths starting with an underscore).
// Handlers only use core Node http APIs so they run the same under Express (server.ts)
// and as standalone serverless functions.

export function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

// Returns true (and responds 405) when the request method is not allowed
export function rejectMethod(req, res, allowed) {
  const method = req.method || 'GET';
  const allowAll = allowed.includes('GET') ? [...allowed, 'HEAD'] : allowed;
  if (allowAll.includes(method)) return false;
  res.setHeader('Allow', allowAll.join(', '));
  sendJson(res, 405, { status: 'error', message: `Method ${method} not allowed` });
  return true;
}

// Express and Vercel populate req.query; plain Node does not
export function getQuery(req) {
  if (req.query && typeof req.query === 'object') return req.query;
  const url = new URL(req.url || '/', 'http://localhost');
  return Object.fromEntries(url.searchParams);
}

// Express (with express.json) and Vercel populate req.body; plain Node needs reading
export async function getJsonBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch { return {}; }
    }
    return req.body || {};
  }
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
