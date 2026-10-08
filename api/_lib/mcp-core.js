export const SMITHERY_ENDPOINT = 'https://mcp.smithery.ai/emmalowzz';
export const SMITHERY_RESOURCE = 'https://mcp.smithery.ai/.well-known/oauth-protected-resource/emmalowzz';

// Local Kinetic Fuel sports recovery MCP tools schema
export const KINETIC_TOOLS = [
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

export async function executeLocalMcp(method, params = {}) {
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
