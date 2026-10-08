import { getQuery, rejectMethod, sendJson } from './_lib/http.js';
import { PODS_DATABASE } from './_lib/pods-data.js';

// GET /api/pods?zone=
export default function podsHandler(req, res) {
  if (rejectMethod(req, res, ['GET'])) return;
  const { zone } = getQuery(req);
  let results = [...PODS_DATABASE];
  if (zone && zone !== 'All') {
    results = results.filter((p) => p.zone === zone);
  }
  return sendJson(res, 200, { status: 'ok', count: results.length, pods: results });
}
