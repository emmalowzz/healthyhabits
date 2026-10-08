import { getJsonBody, rejectMethod, sendJson } from '../_lib/http.js';
import { PODS_DATABASE } from '../_lib/pods-data.js';

// POST /api/pods/reserve { pod_id, meal_id, temperature }
export default async function reservePodHandler(req, res) {
  if (rejectMethod(req, res, ['POST'])) return;
  const { pod_id, temperature } = await getJsonBody(req);
  const pod = PODS_DATABASE.find((p) => p.id === pod_id) || PODS_DATABASE[0];
  const bay = `BAY-${Math.floor(Math.random() * 8) + 1}0${Math.floor(Math.random() * 4) + 1}`;
  const pin = Math.floor(100000 + Math.random() * 900000).toString();

  return sendJson(res, 200, {
    status: 'confirmed',
    reservationId: `KF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    podName: pod.name,
    bayNumber: bay,
    pickupPin: pin,
    temperature: temperature || 'hot',
    instructions: 'Scan QR at pod or enter 6-digit PIN on locker touch screen.'
  });
}
