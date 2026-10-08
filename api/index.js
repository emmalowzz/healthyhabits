import { rejectMethod, sendJson } from './_lib/http.js';

// GET /api
export default function apiIndexHandler(req, res) {
  if (rejectMethod(req, res, ['GET'])) return;
  return sendJson(res, 200, {
    name: 'Kinetic Fuel API',
    version: '1.1.0',
    endpoints: {
      health: '/api/health',
      meals: '/api/meals',
      meal: '/api/meals/:id',
      pods: '/api/pods',
      reservePod: '/api/pods/reserve',
      mcp: '/api/mcp',
      mcpTools: '/api/mcp/tools'
    }
  });
}
