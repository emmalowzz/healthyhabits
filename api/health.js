import { Router } from 'express';

const router = Router();
const SMITHERY_ENDPOINT = 'https://mcp.smithery.ai/emmalowzz';

/**
 * GET /api/health
 * Health check monitor for Kinetic Fuel APIs and external Smithery MCP connection
 */
router.get('/', async (req, res) => {
  const startTime = Date.now();
  let mcpStatus = {
    endpoint: SMITHERY_ENDPOINT,
    reachable: false,
    latencyMs: null,
    httpStatus: null,
    message: null,
    authRequired: true
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    
    const pingStart = Date.now();
    // Test Smithery MCP endpoint with options/post
    const response = await fetch(SMITHERY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'health-ping', method: 'ping' }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const pingDuration = Date.now() - pingStart;
    mcpStatus.reachable = true;
    mcpStatus.latencyMs = pingDuration;
    mcpStatus.httpStatus = response.status;

    if (response.status === 200) {
      mcpStatus.message = 'Smithery MCP gateway fully connected and operational';
      mcpStatus.authRequired = false;
    } else if (response.status === 401) {
      mcpStatus.message = 'Smithery MCP gateway online and responsive (Bearer authentication protected)';
      mcpStatus.authRequired = true;
    } else {
      mcpStatus.message = `Smithery MCP gateway responded with HTTP ${response.status}`;
    }
  } catch (error) {
    mcpStatus.reachable = false;
    mcpStatus.message = error.name === 'AbortError' 
      ? 'Smithery MCP gateway ping timed out' 
      : `Connection error: ${error.message}`;
  }

  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  const healthPayload = {
    status: 'ok',
    service: 'Kinetic Fuel API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    responseDurationMs: Date.now() - startTime,
    uptimeSeconds,
    uptimeHuman: formatUptime(uptimeSeconds),
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      }
    },
    integrations: {
      smitheryMcp: mcpStatus
    },
    endpoints: [
      { path: '/api/health', method: 'GET', description: 'API health and MCP gateway monitoring' },
      { path: '/api/mcp', method: 'GET', description: 'Smithery MCP status and configuration' },
      { path: '/api/mcp', method: 'POST', description: 'JSON-RPC dispatch to Smithery MCP /emmalowzz' },
      { path: '/api/mcp/tools', method: 'GET', description: 'Available MCP tools catalog' },
      { path: '/api/meals', method: 'GET', description: 'Sports recovery meals catalog' },
      { path: '/api/pods', method: 'GET', description: 'ActiveSG smart locker pod telemetry' }
    ]
  };

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json(healthPayload);
});

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
}

export default router;
