import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiIndexHandler from './api/index.js';
import healthHandler from './api/health.js';
import mealsHandler from './api/meals.js';
import mealByIdHandler from './api/meals/[id].js';
import podsHandler from './api/pods.js';
import reservePodHandler from './api/pods/reserve.js';
import mcpHandler from './api/mcp.js';
import mcpToolsHandler from './api/mcp/tools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Each api/*.js file exports a plain (req, res) handler so the same file also runs
  // as a serverless function on file-based hosts. Mirror that file layout here.
  const run = (handler: (req: any, res: any) => unknown): express.RequestHandler => (req, res, next) => {
    Promise.resolve(handler(req, res)).catch(next);
  };
  app.all('/api', run(apiIndexHandler));
  app.all('/api/health', run(healthHandler));
  app.all('/api/meals', run(mealsHandler));
  app.all('/api/meals/:id', (req, res, next) => {
    // Serverless hosts pass the [id] path segment as a query param
    (req.query as Record<string, unknown>).id = req.params.id;
    run(mealByIdHandler)(req, res, next);
  });
  app.all('/api/pods', run(podsHandler));
  app.all('/api/pods/reserve', run(reservePodHandler));
  app.all('/api/mcp', run(mcpHandler));
  app.all('/api/mcp/tools', run(mcpToolsHandler));
  app.all('/api/*', (req, res) => {
    res.status(404).json({ status: 'error', message: `No API route for ${req.method} ${req.path}` });
  });

  if (!isProd) {
    // Mount Vite middlewares in development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kinetic Fuel full-stack server running on http://0.0.0.0:${PORT}`);
    console.log(`- Health Check API: http://localhost:${PORT}/api/health`);
  });
}

startServer();
