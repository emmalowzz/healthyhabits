import { getQuery, rejectMethod, sendJson } from '../_lib/http.js';
import { MEALS_DATABASE } from '../_lib/meals-data.js';

// GET /api/meals/:id (Vercel passes the [id] segment as req.query.id; server.ts does the same)
export default function mealByIdHandler(req, res) {
  if (rejectMethod(req, res, ['GET'])) return;
  const { id } = getQuery(req);
  const meal = MEALS_DATABASE.find((m) => m.id === id);
  if (!meal) {
    return sendJson(res, 404, { error: 'Meal not found' });
  }
  return sendJson(res, 200, { status: 'ok', meal });
}
