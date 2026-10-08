import { Router } from 'express';

const router = Router();
const SMITHERY_ENDPOINT = 'https://mcp.smithery.ai/emmalowzz';
const SMITHERY_RESOURCE = 'https://mcp.smithery.ai/.well-known/oauth-protected-resource/emmalowzz';

// Local Kinetic Fuel sports recovery MCP tools schema
const KINETIC_TOOLS = [
  {
    name: 'search_recovery_meals',
    description: 'Query sports recovery meals filtered by macronutrients, sport focus, and dietary preference.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter category: all, high-protein, glycogen-refuel, lean-cut, plant-power, anti-inflammatory',
          enum: ['all', 'high-protein', 'glycogen-refuel', 'lean-cut', 'plant-power', 'anti-inflammatory']
        },
        min_protein_grams: {
          type: 'number',
          description: 'Minimum grams of bioavailable protein'
        },
        sport_focus: {
          type: 'string',
          description: 'Sport discipline (e.g. Hyrox, Marathon, CrossFit, Powerlifting)'
        }
      }
    }
  },
  {
    name: 'locate_smart_vending_pods',
    description: 'Find active automated smart locker pods near ActiveSG sports hubs with live chamber telemetry.',
    parameters: {
      type: 'object',
      properties: {
        zone: {
          type: 'string',
          description: 'Geographic zone in Singapore: Central, West, North-East, East, South',
          enum: ['Central', 'West', 'North-East', 'East', 'South']
        },
        requires_hot_ready: {
          type: 'boolean',
          description: 'Whether the athlete needs immediately dispensed 65°C hot meals'
        }
      }
    }
  },
  {
    name: 'reserve_smart_locker',
    description: 'Instantaneously reserve a smart locker chamber bay (Hot 65°C or Chilled 3°C) and issue access token.',
    parameters: {
      type: 'object',
      properties: {
        meal_id: { type: 'string', description: 'Meal identifier' },
        pod_id: { type: 'string', description: 'Pod identifier' },
        temperature: { type: 'string', enum: ['hot', 'chill'], description: 'Dispense temperature' }
      },
      required: ['meal_id', 'pod_id', 'temperature']
    }
  },
  {
    name: 'calculate_cooking_opportunity_cost',
    description: 'Compute time saved, grocery spoilage avoided, and extra recovery sleep compared to home cooking.',
    parameters: {
      type: 'object',
      properties: {
        meals_per_week: { type: 'number', description: 'Meals eaten per week' },
        hourly_rate_sgd: { type: 'number', description: 'Value of 1 hour in SGD' }
      },
      required: ['meals_per_week']
    }
  }
];

/**
 * GET /api/mcp
 * Returns connection and metadata for Smithery MCP endpoint
 */
router.get('/', async (req, res) => {
  let pingStatus = 'unknown';
  let httpCode = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const pingRes = await fetch(SMITHERY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'probe', method: 'ping' }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    httpCode = pingRes.status;
    pingStatus = pingRes.status === 200 ? 'connected' : pingRes.status === 401 ? 'ready_auth_required' : 'reachable';
  } catch (err) {
    pingStatus = 'unreachable';
  }

  return res.json({
    status: 'ok',
    protocol: 'Model Context Protocol (MCP) v1.0.0',
    gateway: 'Smithery.ai',
    endpoint: SMITHERY_ENDPOINT,
    oauthResource: SMITHERY_RESOURCE,
    connectionStatus: pingStatus,
    httpStatus: httpCode,
    scope: 'connections:execute',
    hasEnvironmentToken: !!process.env.SMITHERY_API_KEY,
    instructions: {
      curl: `curl -X POST ${SMITHERY_ENDPOINT} -H "Authorization: Bearer <SMITHERY_TOKEN>" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`,
      agentConfig: {
        mcpServers: {
          "kinetic-fuel-smithery": {
            url: SMITHERY_ENDPOINT,
            headers: {
              Authorization: "Bearer <YOUR_SMITHERY_API_KEY>"
            }
          }
        }
      }
    }
  });
});

/**
 * GET /api/mcp/tools
 * Lists tools available via MCP
 */
router.get('/tools', async (req, res) => {
  const token = req.headers.authorization || (process.env.SMITHERY_API_KEY ? `Bearer ${process.env.SMITHERY_API_KEY}` : null);

  // If client provided a Bearer token or SMITHERY_API_KEY is configured, try querying Smithery upstream
  if (token) {
    try {
      const upstream = await fetch(SMITHERY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: 'tools-list', method: 'tools/list', params: {} })
      });

      if (upstream.ok) {
        const data = await upstream.json();
        return res.json({
          source: 'smithery_upstream',
          endpoint: SMITHERY_ENDPOINT,
          tools: data.result?.tools || []
        });
      }
    } catch (err) {
      console.warn('Upstream Smithery query failed:', err.message);
    }
  }

  // Return Kinetic Fuel recovery tools
  return res.json({
    source: 'kinetic_recovery_catalog',
    endpoint: SMITHERY_ENDPOINT,
    upstreamStatus: token ? 'upstream_unauthorized' : 'anonymous_mode',
    tools: KINETIC_TOOLS
  });
});

/**
 * POST /api/mcp
 * JSON-RPC 2.0 handler forwarding to Smithery endpoint or executing local tools
 */
router.post('/', async (req, res) => {
  const { jsonrpc, method, params, id = Date.now() } = req.body || {};
  const token = req.headers.authorization || (process.env.SMITHERY_API_KEY ? `Bearer ${process.env.SMITHERY_API_KEY}` : null);

  if (!jsonrpc || !method) {
    return res.status(400).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: 'Invalid Request: jsonrpc and method are required' }
    });
  }

  // Attempt to forward to Smithery MCP endpoint
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const upstreamResponse = await fetch(SMITHERY_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ jsonrpc: '2.0', method, params: params || {}, id })
    });

    const upstreamBody = await upstreamResponse.json().catch(() => null);

    if (upstreamResponse.ok && upstreamBody) {
      return res.status(200).json(upstreamBody);
    }

    // If 401 Unauthorized from Smithery, provide helpful response with fallback
    if (upstreamResponse.status === 401) {
      // Execute with local engine and return result accompanied by Smithery metadata
      const fallbackResult = await executeLocalMcp(method, params);
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: fallbackResult,
        _smitheryStatus: {
          endpoint: SMITHERY_ENDPOINT,
          status: 'auth_required',
          notice: 'Smithery endpoint requires a Bearer token. To authenticate upstream, pass Authorization: Bearer <SMITHERY_API_KEY>.'
        }
      });
    }

    if (upstreamBody) {
      return res.status(upstreamResponse.status).json(upstreamBody);
    }
  } catch (err) {
    console.warn('Smithery proxy error:', err.message);
  }

  // Local handler execution fallback
  try {
    const result = await executeLocalMcp(method, params);
    return res.json({
      jsonrpc: '2.0',
      id,
      result
    });
  } catch (err) {
    return res.status(500).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: err.message }
    });
  }
});

async function executeLocalMcp(method, params = {}) {
  if (method === 'tools/list') {
    return { tools: KINETIC_TOOLS };
  }

  if (method === 'ping') {
    return { pong: true, timestamp: new Date().toISOString() };
  }

  if (method === 'initialize') {
    return {
      protocolVersion: '1.0.0',
      serverInfo: { name: 'kinetic-fuel-smithery', version: '1.0.0' },
      capabilities: { tools: {} }
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args = {} } = params;
    const reservationId = `KF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (name === 'reserve_smart_locker') {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'confirmed',
            reservation_id: reservationId,
            chamber_bay: `BAY-${Math.floor(Math.random() * 8) + 1}0${Math.floor(Math.random() * 4) + 1}`,
            dispense_temperature: args.temperature === 'hot' ? 'HOT_65C' : 'CHILL_3C',
            token: `mcp-smithery-${reservationId}`
          })
        }]
      };
    }

    if (name === 'calculate_cooking_opportunity_cost') {
      const meals = Number(args.meals_per_week) || 7;
      const hoursSaved = Math.round((meals * 50 * 4.3) / 60);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            monthly_hours_saved: hoursSaved,
            extra_recovery_sleep_mins_per_night: Math.round((hoursSaved * 60) / 30),
            food_waste_saved_sgd: Math.round(meals * 4.2 * 4.3)
          })
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ status: 'success', method_invoked: name, args })
      }]
    };
  }

  throw new Error(`Method not supported: ${method}`);
}

export default router;
