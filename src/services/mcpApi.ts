import { MEALS_DATA, POD_LOCATIONS, COOKING_VS_KINETIC_FACTS } from '../data/mockData';
import { Meal, PodLocation, DispenseTemperature } from '../types';

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

export async function executeMcpTool(toolName: string, args: Record<string, any>): Promise<any> {
  // Simulate low-latency asynchronous API / MCP execution
  await new Promise((r) => setTimeout(r, 450));

  switch (toolName) {
    case 'search_recovery_meals': {
      let results = [...MEALS_DATA];
      if (args.category && args.category !== 'all') {
        results = results.filter((m) => m.category === args.category);
      }
      if (args.min_protein_grams) {
        results = results.filter((m) => m.protein >= Number(args.min_protein_grams));
      }
      if (args.sport_focus) {
        results = results.filter((m) =>
          m.bestForSport.some((s) => s.toLowerCase().includes(String(args.sport_focus).toLowerCase()))
        );
      }
      return {
        status: 'success',
        matched_count: results.length,
        meals: results.map((m) => ({
          id: m.id,
          name: m.name,
          category: m.category,
          protein_g: m.protein,
          calories: m.calories,
          hpb_certified: m.hpbCertified,
          price_sgd: m.price,
          hot_stock: m.hotStock,
          chill_stock: m.chillStock
        }))
      };
    }

    case 'locate_smart_vending_pods': {
      let pods = [...POD_LOCATIONS];
      if (args.zone) {
        pods = pods.filter((p) => p.zone === args.zone);
      }
      if (args.requires_hot_ready) {
        pods = pods.filter((p) => p.hotStockTotal > 0);
      }
      return {
        status: 'success',
        network: 'Singapore ActiveSG & MRT Pod Fleet',
        pods_count: pods.length,
        telemetry_timestamp: new Date().toISOString(),
        pods: pods.map((p) => ({
          pod_id: p.id,
          name: p.name,
          type: p.type,
          address: p.address,
          walk_mins: p.distanceMinutesWalk,
          hot_chambers_ready: p.hotStockTotal,
          chilled_chambers_ready: p.chillStockTotal,
          hot_temp_celsius: p.chamberTempHot,
          chill_temp_celsius: p.chamberTempChill,
          status: p.status
        }))
      };
    }

    case 'reserve_smart_locker': {
      const meal = MEALS_DATA.find((m) => m.id === args.meal_id) || MEALS_DATA[0];
      const pod = POD_LOCATIONS.find((p) => p.id === args.pod_id) || POD_LOCATIONS[0];
      const chamberNumber = `BAY-${Math.floor(Math.random() * 8) + 1}0${Math.floor(Math.random() * 4) + 1}`;
      const reservationId = `KF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      return {
        status: 'confirmed',
        reservation_id: reservationId,
        pod_name: pod.name,
        chamber_bay: chamberNumber,
        dispense_mode: args.temperature === 'hot' ? 'HOT_DISPENSE_65C' : 'TAKE_HOME_CHILL_3C',
        meal_name: meal.name,
        protein_guarantee: `${meal.protein}g`,
        access_qr_payload: `kf://unlock/${reservationId}/${chamberNumber}`,
        holding_window_minutes: 45,
        instructions: args.temperature === 'hot'
          ? 'Proceed to pod screen or scan QR code. Chamber door will unlock immediately at 65°C.'
          : 'Proceed to pod screen. Chilled tray will unlock for take-home transport.'
      };
    }

    case 'calculate_cooking_opportunity_cost': {
      const meals = Math.max(1, Number(args.meals_per_week) || 5);
      const hourlyRate = Number(args.hourly_rate_sgd) || 45;

      const groceryPrepMinutesPerMeal = 45; // shopping + chopping + cooking + cleaning
      const totalCookingHoursMonth = Math.round((meals * groceryPrepMinutesPerMeal * 4.3) / 60);
      const wastedGroceriesMonth = Math.round(meals * 3.5 * 4.3); // spoilage
      const timeValueSavedMonth = Math.round(totalCookingHoursMonth * hourlyRate);

      return {
        status: 'success',
        weekly_meals: meals,
        monthly_time_lost_cooking_hours: totalCookingHoursMonth,
        monthly_kinetic_time_hours: 0.5,
        monthly_hours_freed_up: totalCookingHoursMonth,
        monthly_grocery_waste_saved_sgd: wastedGroceriesMonth,
        economic_value_of_time_saved_sgd: timeValueSavedMonth,
        extra_sleep_minutes_per_day: Math.round((totalCookingHoursMonth * 60) / 30),
        conclusion: `Using Kinetic Fuel returns ${totalCookingHoursMonth} productive hours every month back to your training and sleep schedule.`
      };
    }

    default:
      throw new Error(`Unknown MCP Tool: ${toolName}`);
  }
}
