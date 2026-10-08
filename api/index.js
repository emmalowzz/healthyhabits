import { Router } from 'express';
import healthRouter from './health.js';
import mcpRouter from './mcp.js';
import mealsRouter from './meals.js';
import podsRouter from './pods.js';

const api = Router();

api.use('/health', healthRouter);
api.use('/mcp', mcpRouter);
api.use('/meals', mealsRouter);
api.use('/pods', podsRouter);

// Root /api info
api.get('/', (req, res) => {
  res.json({
    name: 'Kinetic Fuel API & Smithery MCP Gateway',
    version: '1.0.0',
    documentation: '/api/health',
    mcpEndpoint: 'https://mcp.smithery.ai/emmalowzz',
    endpoints: {
      health: '/api/health',
      mcp: '/api/mcp',
      mcpTools: '/api/mcp/tools',
      meals: '/api/meals',
      pods: '/api/pods'
    }
  });
});

export default api;
