import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Code2, 
  Check, 
  Copy, 
  Layers, 
  Server, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { KINETIC_MCP_TOOLS, executeMcpTool, McpToolDefinition } from '../services/mcpApi';

export const McpConsole: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<McpToolDefinition>(KINETIC_MCP_TOOLS[0]);
  const [params, setParams] = useState<Record<string, any>>({
    category: 'high-protein',
    min_protein_grams: 40,
    sport_focus: 'Hyrox'
  });
  const [toolOutput, setToolOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleSelectTool = (tool: McpToolDefinition) => {
    setSelectedTool(tool);
    // Set initial default parameters based on tool
    if (tool.name === 'search_recovery_meals') {
      setParams({ category: 'high-protein', min_protein_grams: 40, sport_focus: 'Hyrox' });
    } else if (tool.name === 'locate_smart_vending_pods') {
      setParams({ zone: 'Central', requires_hot_ready: true });
    } else if (tool.name === 'reserve_smart_locker') {
      setParams({ meal_id: 'meal-salmon-quinoa', pod_id: 'pod-activesg-delta', temperature: 'hot' });
    } else if (tool.name === 'calculate_cooking_opportunity_cost') {
      setParams({ meals_per_week: 7, hourly_rate_sgd: 45 });
    }
    setToolOutput(null);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      const res = await executeMcpTool(selectedTool.name, params);
      setToolOutput(res);
    } catch (err: any) {
      setToolOutput({ error: err.message || 'Execution error' });
    } finally {
      setIsLoading(false);
    }
  };

  const mcpConfigJson = JSON.stringify({
    mcpServers: {
      "kinetic-fuel": {
        "url": "https://api.kineticfuel.sg/mcp/v1",
        "description": "Kinetic Fuel Sports Recovery & Smart Locker Pod Vending Protocol",
        "capabilities": ["tools", "resources"]
      }
    }
  }, null, 2);

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(mcpConfigJson);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4 text-emerald-600" />
            Extensibility & Integration Layer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Model Context Protocol (MCP) & API Console
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Kinetic Fuel is built API-first. Connect external AI agents, fitness wearables (Whoop, Garmin, Apple Health), or autobooking bots to query meals and control smart vending lockers.
          </p>
        </div>

        <button
          onClick={handleCopyConfig}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          {copiedSnippet ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>MCP Config Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy mcpServers Config</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Tool Selector & Parameters */}
        <div className="lg:col-span-5 space-y-5">
          {/* Tool Selector */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available Kinetic MCP Tools
            </span>
            <div className="space-y-1.5">
              {KINETIC_MCP_TOOLS.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleSelectTool(tool)}
                  className={`w-full p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                    selectedTool.name === tool.name
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{tool.name}</span>
                    <span className="text-[10px] uppercase font-semibold text-emerald-400">Tool</span>
                  </div>
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                    selectedTool.name === tool.name ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {tool.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Parameters Input Form */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tool Parameters
              </span>
              <span className="text-[10px] font-mono text-slate-400">JSON Schema Validated</span>
            </div>

            <div className="space-y-3">
              {selectedTool.name === 'search_recovery_meals' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">category</label>
                    <select
                      value={params.category || 'all'}
                      onChange={(e) => setParams({ ...params, category: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    >
                      <option value="all">all</option>
                      <option value="high-protein">high-protein</option>
                      <option value="anti-inflammatory">anti-inflammatory</option>
                      <option value="glycogen-refuel">glycogen-refuel</option>
                      <option value="lean-cut">lean-cut</option>
                      <option value="plant-power">plant-power</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">min_protein_grams</label>
                    <input
                      type="number"
                      value={params.min_protein_grams || 40}
                      onChange={(e) => setParams({ ...params, min_protein_grams: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">sport_focus</label>
                    <input
                      type="text"
                      value={params.sport_focus || 'Hyrox'}
                      onChange={(e) => setParams({ ...params, sport_focus: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {selectedTool.name === 'locate_smart_vending_pods' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">zone</label>
                    <select
                      value={params.zone || 'Central'}
                      onChange={(e) => setParams({ ...params, zone: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    >
                      <option value="Central">Central</option>
                      <option value="West">West</option>
                      <option value="East">East</option>
                      <option value="South">South</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="requires_hot"
                      checked={!!params.requires_hot_ready}
                      onChange={(e) => setParams({ ...params, requires_hot_ready: e.target.checked })}
                      className="accent-[#006948]"
                    />
                    <label htmlFor="requires_hot" className="text-xs font-bold text-slate-700">
                      requires_hot_ready (Chambers at 65°C)
                    </label>
                  </div>
                </>
              )}

              {selectedTool.name === 'reserve_smart_locker' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">meal_id</label>
                    <select
                      value={params.meal_id || 'meal-salmon-quinoa'}
                      onChange={(e) => setParams({ ...params, meal_id: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    >
                      <option value="meal-salmon-quinoa">meal-salmon-quinoa (Wild Salmon)</option>
                      <option value="meal-sirloin-mash">meal-sirloin-mash (Grass-Fed Sirloin)</option>
                      <option value="meal-miso-chicken">meal-miso-chicken (Kyoto Miso Chicken)</option>
                      <option value="meal-barramundi-cauli">meal-barramundi-cauli (SG Barramundi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">pod_id</label>
                    <select
                      value={params.pod_id || 'pod-activesg-delta'}
                      onChange={(e) => setParams({ ...params, pod_id: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    >
                      <option value="pod-activesg-delta">pod-activesg-delta (Delta Gym)</option>
                      <option value="pod-activesg-bishan">pod-activesg-bishan (Bishan Sports Hall)</option>
                      <option value="pod-marina-one">pod-marina-one (Marina One MRT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">temperature</label>
                    <select
                      value={params.temperature || 'hot'}
                      onChange={(e) => setParams({ ...params, temperature: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    >
                      <option value="hot">hot (65°C Dispense)</option>
                      <option value="chill">chill (3°C Take-Home)</option>
                    </select>
                  </div>
                </>
              )}

              {selectedTool.name === 'calculate_cooking_opportunity_cost' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">meals_per_week</label>
                    <input
                      type="number"
                      value={params.meals_per_week || 7}
                      onChange={(e) => setParams({ ...params, meals_per_week: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">hourly_rate_sgd</label>
                    <input
                      type="number"
                      value={params.hourly_rate_sgd || 45}
                      onChange={(e) => setParams({ ...params, hourly_rate_sgd: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="w-full py-3 bg-[#006948] hover:bg-[#005137] disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isLoading ? 'Executing Tool RPC...' : `Execute ${selectedTool.name}`}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output Console */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-950 text-emerald-400 rounded-3xl p-5 border border-slate-800 font-mono text-xs shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-[11px] text-slate-300 ml-2">mcp-client@kinetic-fuel:~</span>
              </div>
              <span className="text-[10px] text-slate-500">PROTOCOL: MCP v1.0.0</span>
            </div>

            {/* Request Call Preview */}
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">// Tool Call Request</span>
              <pre className="text-amber-300 overflow-x-auto bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {JSON.stringify({
                  jsonrpc: "2.0",
                  method: "tools/call",
                  params: {
                    name: selectedTool.name,
                    arguments: params
                  }
                }, null, 2)}
              </pre>
            </div>

            {/* Response Output */}
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">// Tool Execution Result</span>
              {isLoading ? (
                <div className="p-8 text-center text-slate-400 animate-pulse">
                  Streaming MCP payload from smart pod telemetries...
                </div>
              ) : toolOutput ? (
                <pre className="text-emerald-300 overflow-x-auto bg-slate-900/90 p-4 rounded-xl border border-emerald-950 max-h-96">
                  {JSON.stringify(toolOutput, null, 2)}
                </pre>
              ) : (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  Tap "Execute {selectedTool.name}" to invoke this MCP tool.
                </div>
              )}
            </div>
          </div>

          {/* Integration Notes */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 text-xs space-y-2 text-slate-700">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Production Integration Notice</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              In production, this MCP endpoint integrates with ActiveSG Court auto-booking webhooks, Singapore OneMap reverse geocoding, and Stripe/PayNow POS locker kiosks.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
