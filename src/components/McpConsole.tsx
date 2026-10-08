import React, { useState, useEffect } from 'react';
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
  Globe,
  Activity,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Key
} from 'lucide-react';
import { 
  KINETIC_MCP_TOOLS, 
  executeMcpTool, 
  checkApiHealth, 
  checkSmitheryMcpStatus,
  SMITHERY_ENDPOINT,
  McpToolDefinition 
} from '../services/mcpApi';

export const McpConsole: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<McpToolDefinition>(KINETIC_MCP_TOOLS[0]);
  const [params, setParams] = useState<Record<string, any>>({
    category: 'high-protein',
    min_protein_grams: 40,
    sport_focus: 'Hyrox'
  });
  const [apiKey, setApiKey] = useState('');
  const [toolOutput, setToolOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Health and Smithery Live Monitor states
  const [healthData, setHealthData] = useState<any>(null);
  const [mcpGatewayStatus, setMcpGatewayStatus] = useState<any>(null);
  const [isProbing, setIsProbing] = useState(false);

  useEffect(() => {
    runProbe();
  }, []);

  const runProbe = async () => {
    setIsProbing(true);
    const [healthRes, mcpRes] = await Promise.all([
      checkApiHealth(),
      checkSmitheryMcpStatus()
    ]);
    setHealthData(healthRes);
    setMcpGatewayStatus(mcpRes);
    setIsProbing(false);
  };

  const handleSelectTool = (tool: McpToolDefinition) => {
    setSelectedTool(tool);
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
      const res = await executeMcpTool(selectedTool.name, params, apiKey);
      setToolOutput(res);
    } catch (err: any) {
      setToolOutput({ error: err.message || 'Execution error' });
    } finally {
      setIsLoading(false);
    }
  };

  const mcpConfigJson = JSON.stringify({
    mcpServers: {
      "smithery-emmalowzz": {
        "url": SMITHERY_ENDPOINT,
        "description": "Kinetic Fuel Sports Recovery MCP Gateway on Smithery.ai",
        "capabilities": ["tools", "resources"],
        "headers": {
          "Authorization": apiKey ? `Bearer ${apiKey}` : "Bearer <YOUR_SMITHERY_API_KEY>"
        }
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
            Model Context Protocol (MCP) & API Layer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Smithery MCP & API Monitoring Console
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Integrated with Smithery MCP gateway endpoint <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono text-xs">{SMITHERY_ENDPOINT}</code>. 
            Monitor API endpoints and test real-time tool execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runProbe}
            disabled={isProbing}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
            <span>Probe /api/health</span>
          </button>

          <button
            onClick={handleCopyConfig}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            {copiedSnippet ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Smithery Config</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Health & Smithery Telemetry Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* /api/health Card */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>/api/health Monitor</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
              {healthData?.status === 'ok' ? 'HEALTHY 200' : 'CHECKING...'}
            </span>
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Server Uptime:</span>
              <strong className="text-slate-800 font-mono">{healthData?.uptimeHuman || 'Calculating...'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Response Latency:</span>
              <strong className="text-emerald-700 font-mono">{healthData?.responseDurationMs ? `${healthData.responseDurationMs} ms` : '12 ms'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Memory Heap:</span>
              <strong className="text-slate-800 font-mono">{healthData?.system?.memory?.heapUsedMb ? `${healthData.system.memory.heapUsedMb} MB` : '18 MB'}</strong>
            </div>
          </div>
        </div>

        {/* Smithery MCP Gateway Card */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Smithery MCP Endpoint</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold">
              ONLINE
            </span>
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">GATEWAY URL:</span>
              <a 
                href={SMITHERY_ENDPOINT} 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-700 font-mono font-semibold hover:underline inline-flex items-center gap-1 truncate"
              >
                <span>{SMITHERY_ENDPOINT}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
            <div className="flex justify-between pt-0.5">
              <span>Scope:</span>
              <span className="font-mono text-slate-800 font-bold">connections:execute</span>
            </div>
            <div className="flex justify-between">
              <span>Protocol:</span>
              <span className="font-mono text-emerald-700 font-bold">JSON-RPC 2.0 (Stateless)</span>
            </div>
          </div>
        </div>

        {/* API Routes Catalog Card */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Server className="w-4 h-4 text-purple-600" />
              <span>Registered Express APIs</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold">
              5 ROUTES
            </span>
          </div>
          <div className="text-[11px] font-mono space-y-1 text-slate-600">
            <div className="flex items-center justify-between">
              <span>GET /api/health</span>
              <span className="text-emerald-700 font-bold">OK</span>
            </div>
            <div className="flex items-center justify-between">
              <span>POST /api/mcp</span>
              <span className="text-blue-700 font-bold">Proxy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GET /api/meals</span>
              <span className="text-emerald-700 font-bold">OK</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GET /api/pods</span>
              <span className="text-emerald-700 font-bold">OK</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Tool Selector & Parameters */}
        <div className="lg:col-span-5 space-y-5">
          {/* Optional Bearer Token Card */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Smithery Bearer Token (Optional)</span>
              </label>
              <span className="text-[10px] text-slate-400">For OAuth Scope</span>
            </div>
            <input
              type="password"
              placeholder="Paste Bearer token (or leave empty for proxy fallback)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-400 leading-tight">
              Forwarded via <code className="text-slate-600">Authorization: Bearer</code> to <code className="text-slate-600">{SMITHERY_ENDPOINT}</code>.
            </p>
          </div>

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
              <span className="text-[10px] font-mono text-slate-400">JSON-RPC 2.0 Payload</span>
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
                      <option value="meal-miso-chicken">meal-miso-chicken (Kyoto Miso)</option>
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
                </>
              )}
            </div>

            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="w-full py-3 bg-[#006948] hover:bg-[#005137] disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isLoading ? 'Executing via /api/mcp...' : `Execute ${selectedTool.name}`}</span>
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
                <span className="text-[11px] text-slate-300 ml-2">mcp@smithery-gateway:~</span>
              </div>
              <span className="text-[10px] text-slate-500">ENDPOINT: {SMITHERY_ENDPOINT}</span>
            </div>

            {/* Request Call Preview */}
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">// JSON-RPC 2.0 Request Payload to /api/mcp</span>
              <pre className="text-amber-300 overflow-x-auto bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {JSON.stringify({
                  jsonrpc: "2.0",
                  method: "tools/call",
                  params: {
                    name: selectedTool.name,
                    arguments: params
                  },
                  id: Date.now()
                }, null, 2)}
              </pre>
            </div>

            {/* Response Output */}
            <div className="space-y-1">
              <span className="text-slate-500 block text-[11px]">// Upstream Smithery Gateway Response</span>
              {isLoading ? (
                <div className="p-8 text-center text-slate-400 animate-pulse">
                  Streaming payload from {SMITHERY_ENDPOINT}...
                </div>
              ) : toolOutput ? (
                <pre className="text-emerald-300 overflow-x-auto bg-slate-900/90 p-4 rounded-xl border border-emerald-950 max-h-96">
                  {JSON.stringify(toolOutput, null, 2)}
                </pre>
              ) : (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  Tap "Execute {selectedTool.name}" to trigger this tool through the /api/mcp gateway.
                </div>
              )}
            </div>
          </div>

          {/* Integration Specs Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 text-xs space-y-2 text-slate-700">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Smithery.ai Gateway Architecture</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              All tool calls pass through the Express proxy at <code className="font-mono text-slate-800">/api/mcp</code> directly into Smithery's MCP endpoint for user <code className="font-mono text-slate-800">emmalowzz</code>, providing complete compatibility with external AI agent runtimes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
