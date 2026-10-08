import { MEALS_DATA, POD_LOCATIONS } from '../data/mockData';

export const SMITHERY_ENDPOINT = 'https://mcp.smithery.ai/emmalowzz';

export interface McpToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export const KINETIC_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'search_recovery_meals',
    description: 'Query sports recovery meals filtered by macronutrient requirements, sport focus, and dietary preference.',
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
          description: 'Minimum grams of bioavailable protein required'
        },
        sport_focus: {
          type: 'string',
          description: 'Sport discipline (e.g., Hyrox, Marathon, CrossFit, Powerlifting)'
        }
      },
      required: []
    }
  },
  {
    name: 'locate_smart_vending_pods',
    description: 'Find active automated smart locker pods near ActiveSG sports hubs and MRT stations with live telemetry.',
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
      },
      required: []
    }
  },
  {
    name: 'reserve_smart_locker',
    description: 'Instantaneously reserve a smart locker chamber bay (Hot 65°C or Chilled 3°C) and issue access token.',
    parameters: {
      type: 'object',
      properties: {
        meal_id: {
          type: 'string',
          description: 'Unique meal identifier (e.g. meal-salmon-quinoa)'
        },
        pod_id: {
          type: 'string',
          description: 'Target pod identifier (e.g. pod-activesg-delta)'
        },
        temperature: {
          type: 'string',
          description: 'Dispense temperature: hot or chill',
          enum: ['hot', 'chill']
        }
      },
      required: ['meal_id', 'pod_id', 'temperature']
    }
  },
  {
    name: 'calculate_cooking_opportunity_cost',
    description: 'Compute exact time saved, grocery spoilage avoided, and extra recovery sleep compared to home cooking.',
    parameters: {
      type: 'object',
      properties: {
        meals_per_week: {
          type: 'number',
          description: 'Number of workout recovery meals needed per week (e.g. 5, 10, 14)'
        },
        hourly_rate_sgd: {
          type: 'number',
          description: 'Athlete hourly economic value of time in SGD (default S$45/hr)'
        }
      },
      required: ['meals_per_week']
    }
  }
];

export async function checkApiHealth(): Promise<any> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      return await res.json();
    }
    return { status: 'error', code: res.status, message: 'Health check returned non-200' };
  } catch (err: any) {
    return { status: 'offline', message: err.message };
  }
}

export async function checkSmitheryMcpStatus(): Promise<any> {
  try {
    const res = await fetch('/api/mcp');
    if (res.ok) {
      return await res.json();
    }
    return { status: 'error', endpoint: SMITHERY_ENDPOINT, message: 'MCP status probe failed' };
  } catch (err: any) {
    return { status: 'offline', endpoint: SMITHERY_ENDPOINT, message: err.message };
  }
}

export async function executeMcpTool(
  toolName: string, 
  args: Record<string, any>,
  bearerToken?: string
): Promise<any> {
  // First attempt to call the full-stack /api/mcp route connecting to Smithery
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (bearerToken) {
      headers['Authorization'] = bearerToken.startsWith('Bearer ') ? bearerToken : `Bearer ${bearerToken}`;
    }

    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };

    const res = await fetch('/api/mcp', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      return {
        source: 'api_mcp_gateway',
        gateway: 'Smithery.ai (https://mcp.smithery.ai/emmalowzz)',
        response: data
      };
    }
  } catch (err) {
    console.warn('API MCP execution fallback to local engine:', err);
  }

  // Client-side execution fallback
  await new Promise((r) => setTimeout(r, 300));

  switch (toolName) {
    case 'search_recovery_meals': {
      let results = [...MEALS_DATA];
      if (args.category && args.category !== 'all') {
        results = results.filter((m) => m.category === args.category);
      }
      if (args.min_protein_grams) {
        results = results.filter((m) => m.protein >= Number(args.min_protein_grams));
      }
      return {
        status: 'success',
        source: 'local_kinetic_engine',
        matched_count: results.length,
        meals: results.map((m) => ({
          id: m.id,
          name: m.name,
          category: m.category,
          protein_g: m.protein,
          calories: m.calories,
          hpb_certified: m.hpbCertified,
          price_sgd: m.price
        }))
      };
    }

    case 'locate_smart_vending_pods': {
      let pods = [...POD_LOCATIONS];
      if (args.zone) {
        pods = pods.filter((p) => p.zone === args.zone);
      }
      return {
        status: 'success',
        source: 'local_kinetic_engine',
        pods_count: pods.length,
        pods: pods.map((p) => ({
          pod_id: p.id,
          name: p.name,
          type: p.type,
          hot_temp_celsius: p.chamberTempHot,
          chill_temp_celsius: p.chamberTempChill,
          status: p.status
        }))
      };
    }

    case 'reserve_smart_locker': {
      const chamberNumber = `BAY-${Math.floor(Math.random() * 8) + 1}0${Math.floor(Math.random() * 4) + 1}`;
      const reservationId = `KF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      return {
        status: 'confirmed',
        source: 'local_kinetic_engine',
        reservation_id: reservationId,
        chamber_bay: chamberNumber,
        dispense_mode: args.temperature === 'hot' ? 'HOT_DISPENSE_65C' : 'TAKE_HOME_CHILL_3C',
        access_qr_payload: `kf://unlock/${reservationId}/${chamberNumber}`
      };
    }

    case 'calculate_cooking_opportunity_cost': {
      const meals = Math.max(1, Number(args.meals_per_week) || 5);
      const totalCookingHoursMonth = Math.round((meals * 50 * 4.3) / 60);

      return {
        status: 'success',
        source: 'local_kinetic_engine',
        weekly_meals: meals,
        monthly_time_lost_cooking_hours: totalCookingHoursMonth,
        extra_sleep_minutes_per_day: Math.round((totalCookingHoursMonth * 60) / 30)
      };
    }

    default:
      throw new Error(`Unknown MCP Tool: ${toolName}`);
  }
}
