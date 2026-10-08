import { getQuery, rejectMethod, sendJson } from './_lib/http.js';
import { MEALS_DATABASE } from './_lib/meals-data.js';

// GET /api/meals?category=&min_protein=
export default function mealsHandler(req, res) {
  if (rejectMethod(req, res, ['GET'])) return;
  const { category, min_protein } = getQuery(req);
  let results = [...MEALS_DATABASE];

  if (category && category !== 'all') {
    results = results.filter((m) => m.category === category);
  }
  if (min_protein) {
    results = results.filter((m) => m.protein >= Number(min_protein));
  }

  return sendJson(res, 200, { status: 'ok', count: results.length, meals: results });
}
