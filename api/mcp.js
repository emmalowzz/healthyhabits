import { getJsonBody, rejectMethod, sendJson } from './_lib/http.js';
import { SMITHERY_ENDPOINT, SMITHERY_RESOURCE, executeLocalMcp } from './_lib/mcp-core.js';

function bearerFrom(req) {
  const token = req.headers.authorization || (process.env.SMITHERY_API_KEY ? `Bearer ${process.env.SMITHERY_API_KEY}` : null);
  if (!token) return null;
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

/**
 * GET  /api/mcp  Connection status and config for the Smithery MCP endpoint
 * POST /api/mcp  JSON-RPC 2.0 forwarded to Smithery, falling back to local tools
 */
export default async function mcpHandler(req, res) {
  if (rejectMethod(req, res, ['GET', 'POST'])) return;
  if (req.method === 'POST') return handleRpc(req, res);
  return handleStatus(res);
}

async function handleStatus(res) {
  let pingStatus = 'unknown';
  let httpCode = null;

  try {
    const pingRes = await fetch(SMITHERY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'probe', method: 'ping' }),
      signal: AbortSignal.timeout(3000)
    });
    httpCode = pingRes.status;
    pingStatus = pingRes.status === 200
      ? 'connected'
      : pingRes.status === 401 || pingRes.status === 403
      ? 'ready_auth_required'
      : 'reachable';
  } catch (err) {
    pingStatus = 'unreachable';
  }

  return sendJson(res, 200, {
    status: 'ok',
    protocol: 'Model Context Protocol (MCP) v1.0.0',
    gateway: 'Smithery.ai',
    endpoint: SMITHERY_ENDPOINT,
    oauthResource: SMITHERY_RESOURCE,
    connectionStatus: pingStatus,
    httpStatus: httpCode,
    scope: 'connections:execute',
    hasEnvironmentToken: !!process.env.SMITHERY_API_KEY
  });
}

async function handleRpc(req, res) {
  const { jsonrpc, method, params, id = Date.now() } = await getJsonBody(req);
  const token = bearerFrom(req);

  if (!jsonrpc || !method) {
    return sendJson(res, 400, {
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: 'Invalid Request: jsonrpc and method are required' }
    });
  }

  // Forward to Smithery when possible
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const upstreamResponse = await fetch(SMITHERY_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ jsonrpc: '2.0', method, params: params || {}, id }),
      signal: AbortSignal.timeout(8000)
    });
    const upstreamBody = await upstreamResponse.json().catch(() => null);

    if (upstreamResponse.ok && upstreamBody) {
      return sendJson(res, 200, upstreamBody);
    }
    if (upstreamResponse.status !== 401 && upstreamResponse.status !== 403 && upstreamBody) {
      return sendJson(res, upstreamResponse.status, upstreamBody);
    }
  } catch (err) {
    console.warn('Smithery proxy error:', err.message);
  }

  // Auth required, unreachable, or empty upstream reply: run the local tools
  try {
    const result = await executeLocalMcp(method, params);
    return sendJson(res, 200, { jsonrpc: '2.0', id, result });
  } catch (err) {
    return sendJson(res, 500, { jsonrpc: '2.0', id, error: { code: -32603, message: err.message } });
  }
}
