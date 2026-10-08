import { rejectMethod, sendJson } from '../_lib/http.js';
import { KINETIC_TOOLS, SMITHERY_ENDPOINT } from '../_lib/mcp-core.js';

// GET /api/mcp/tools
export default async function mcpToolsHandler(req, res) {
  if (rejectMethod(req, res, ['GET'])) return;
  const token = req.headers.authorization || (process.env.SMITHERY_API_KEY ? `Bearer ${process.env.SMITHERY_API_KEY}` : null);

  if (token) {
    try {
      const upstream = await fetch(SMITHERY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ jsonrpc: '2.0', id: 'tools-list', method: 'tools/list', params: {} }),
        signal: AbortSignal.timeout(8000)
      });
      if (upstream.ok) {
        const data = await upstream.json();
        return sendJson(res, 200, { source: 'smithery_upstream', endpoint: SMITHERY_ENDPOINT, tools: data.result?.tools || [] });
      }
    } catch (err) {
      console.warn('Upstream Smithery query failed:', err.message);
    }
  }

  return sendJson(res, 200, {
    source: 'kinetic_recovery_catalog',
    endpoint: SMITHERY_ENDPOINT,
    upstreamStatus: token ? 'upstream_unauthorized' : 'anonymous_mode',
    tools: KINETIC_TOOLS
  });
}
