import { rejectMethod, sendJson } from './_lib/http.js';
import { MEALS_DATABASE } from './_lib/meals-data.js';
import { PODS_DATABASE } from './_lib/pods-data.js';

const SERVICE_VERSION = '1.1.0';

/**
 * GET /api/health
 * Liveness check for the Kinetic Fuel API. It only checks things this server
 * owns, with no outbound network calls, so it answers fast and its status
 * reflects this service rather than a third party.
 */
export default function healthHandler(req, res) {
  if (rejectMethod(req, res, ['GET'])) return;

  const startTime = Date.now();
  const checks = {
    mealsCatalog: MEALS_DATABASE.length > 0 ? 'ok' : 'empty',
    podsNetwork: PODS_DATABASE.length > 0 ? 'ok' : 'empty'
  };
  const healthy = Object.values(checks).every((c) => c === 'ok');

  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return sendJson(res, healthy ? 200 : 503, {
    status: healthy ? 'ok' : 'degraded',
    service: 'Kinetic Fuel API Server',
    version: SERVICE_VERSION,
    timestamp: new Date().toISOString(),
    responseDurationMs: Date.now() - startTime,
    uptimeSeconds,
    uptimeHuman: formatUptime(uptimeSeconds),
    checks,
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      }
    }
  });
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
}
