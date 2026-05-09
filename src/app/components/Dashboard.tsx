import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Activity, Zap, Leaf, Clock, AlertTriangle, CheckCircle, Sliders, Calendar, RefreshCw } from "lucide-react";
import { getProcesses, ProcessRecord } from "@/lib/supabase";

const kpis = [
  {
    label: "Live Utilization",
    values: ["Moulds 18/24", "Chambers 6/8", "Cranes 3/4"],
    icon: Activity,
    color: "text-[#005EB8]",
  },
  {
    label: "Avg Cycle Time",
    value: "14.2h",
    target: "vs 12h target",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    label: "Energy Today",
    value: "2.1 MWh",
    icon: Zap,
    color: "text-[#FDB813]",
  },
  {
    label: "CO₂ Today",
    value: "1.2t",
    icon: Leaf,
    color: "text-green-600",
  },
];

const demoProcesses = [
  {
    id: "23",
    name: "Metro Pier Cap",
    grade: "M50",
    stage: "Curing",
    mould: "12",
    chamber: "4",
    crane: "2",
    castTime: "08:15",
    currentTime: "6h32m",
    demouldETA: "14:45",
    strength: { current: 12.8, target: 15 },
    energy: "45kWh",
    co2: "28kg",
    aiSuggestion: "Cut hold time 45min (-12% energy, safe)",
    status: "safe",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "24",
    name: "Wall Panel",
    grade: "M40",
    stage: "Casting",
    mould: "18",
    location: "Batch Plant",
    crew: "A",
    progress: 23,
    finishETA: "11:30",
    mix: "350kg cement, 12% slag, accelerator ✓",
    aiSuggestion: 'Use Pump B (15% faster for panels)',
    status: "safe",
    color: "bg-green-50 border-green-200",
  },
  {
    id: "25",
    name: "U-Girder",
    grade: "M60",
    stage: "Prep",
    mould: "5",
    substage: "Reinforcement stage",
    complexity: "High",
    crew: "6 workers",
    aiSuggestion: "Crane overloaded 14:00-16:00, delay start 30min",
    status: "warning",
    color: "bg-orange-50 border-orange-200",
  },
];

const resourceTimeline = [
  { resource: "Mould", total: 24, used: 18, critical: [14, 15, 16] },
  { resource: "Chamber", total: 8, used: 6, critical: [4] },
  { resource: "Crane", total: 4, used: 3, critical: [2, 4] },
];

export function Dashboard() {
  const [processes, setProcesses] = useState<ProcessRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProcesses();
      console.log("[v0] Loaded processes from Supabase:", data);
      setProcesses(data);
    } catch (err) {
      console.error("[v0] Error loading processes:", err);
      setError("Failed to load processes");
      // Fallback to empty array if Supabase fails
      setProcesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Combine demo processes with real processes for display
  // If we have real processes, show them; otherwise show demo data
  const displayProcesses = processes.length > 0 ? processes.map(p => ({
    id: p.id,
    name: p.material_name,
    dimensions: p.material_dimensions,
    quantity: p.quantity,
    grade: p.strategy_type,
    stage: p.status === 'scheduled' ? 'Scheduled' : p.status === 'in_progress' ? 'Running' : p.status === 'completed' ? 'Completed' : 'Cancelled',
    mould: p.mould.toString(),
    chamber: p.chambers.toString(),
    castTime: new Date(p.scheduled_start_time).toLocaleTimeString(),
    demouldETA: new Date(p.scheduled_end_time).toLocaleTimeString(),
    strength: { current: p.age || 0, target: p.age || 28 },
    energy: `${Math.round(p.cement * 0.5)}kWh`,
    co2: `${Math.round(p.cement * 0.1)}kg`,
    aiSuggestion: `Curing method: ${p.curing_method} at ${p.age} days`,
    status: p.status === 'scheduled' ? 'info' : p.status === 'in_progress' ? 'safe' : 'completed',
    color: p.status === 'scheduled' ? 'bg-blue-50 border-blue-200' : p.status === 'in_progress' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200',
  })) : demoProcesses;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time yard status and AI insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadProcesses}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            to="/simulation-playground"
            className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <Sliders size={18} />
            Simulation Lab
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">{kpi.label}</h3>
                <Icon className={`${kpi.color}`} size={20} />
              </div>
              {Array.isArray(kpi.values) ? (
                <div className="space-y-1">
                  {kpi.values.map((v, i) => (
                    <div key={i} className="text-sm font-bold text-gray-900">{v}</div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  <div className="text-xs text-gray-600 mt-1">{kpi.target}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Production Processes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          <Activity className="inline mr-2 text-[#005EB8]" size={28} />
          Live Production Processes ({displayProcesses.length})
        </h2>

        {isLoading && (
          <div className="text-center py-8 text-gray-600">Loading processes...</div>
        )}

        {!isLoading && displayProcesses.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-300">
            <p className="text-gray-600 mb-4">No processes yet. Add your first process to get started!</p>
            <Link
              to="/add-process"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Calendar size={18} />
              Add Process
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {displayProcesses.map((process: any) => (
            <div
              key={process.id}
              className={`${process.color} border rounded-xl p-6 hover:shadow-lg transition-all`}
            >
              <div className="grid grid-cols-5 gap-6">
                {/* Process Info */}
                <div className="col-span-2">
                  <h3 className="text-lg font-bold text-gray-900">{process.name}</h3>
                  {process.dimensions && (
                    <p className="text-sm text-gray-600 mt-1">📏 {process.dimensions}</p>
                  )}
                  {process.quantity && (
                    <p className="text-sm text-gray-600">📦 Qty: {process.quantity} units</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      process.status === 'safe' ? 'bg-green-200 text-green-800' :
                      process.status === 'warning' ? 'bg-orange-200 text-orange-800' :
                      process.status === 'info' ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {process.stage}
                    </span>
                    {process.grade && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-900">
                        {process.grade}
                      </span>
                    )}
                  </div>
                </div>

                {/* Resources */}
                <div className="col-span-1">
                  <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">Resources</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Mould:</span> <span className="font-semibold">{process.mould}</span></div>
                    <div><span className="text-gray-600">Chamber:</span> <span className="font-semibold">{process.chamber}</span></div>
                    {process.crane && (
                      <div><span className="text-gray-600">Crane:</span> <span className="font-semibold">{process.crane}</span></div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="col-span-1">
                  <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">Timeline</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Start:</span> <span className="font-semibold">{process.castTime}</span></div>
                    <div><span className="text-gray-600">End:</span> <span className="font-semibold">{process.demouldETA}</span></div>
                  </div>
                </div>

                {/* Impact */}
                <div className="col-span-1">
                  <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">Impact</h4>
                  <div className="space-y-1 text-sm">
                    <div><Zap className="inline text-yellow-600 mr-1" size={14} /> {process.energy}</div>
                    <div><Leaf className="inline text-green-600 mr-1" size={14} /> {process.co2}</div>
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              {process.aiSuggestion && (
                <div className="mt-4 p-3 bg-white/60 rounded-lg border-l-4 border-[#005EB8]">
                  <p className="text-sm text-gray-700"><Sparkles className="inline mr-2 text-[#005EB8]" size={16} />{process.aiSuggestion}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resource Timeline */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource Utilization</h2>
        <div className="grid grid-cols-3 gap-6">
          {resourceTimeline.map((res, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{res.resource}</h3>
                <span className="text-2xl font-bold text-[#005EB8]">{res.used}/{res.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-[#005EB8] h-2 rounded-full"
                  style={{ width: `${(res.used / res.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{Math.round((res.used / res.total) * 100)}% utilized</p>
              {res.critical.length > 0 && (
                <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                  <p className="text-xs font-semibold text-orange-800">Critical: #{res.critical.join(", #")}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Icon component import needed
const Sparkles = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.26 9a2 2 0 0 0-1.35 3.74h0A2 2 0 0 0 9 16.74"></path>
    <path d="M16.74 9.5a2.5 2.5 0 0 0-3.49 3.49"></path>
    <path d="M12 2v4"></path>
    <path d="M20.485 3.515l-2.828 2.828"></path>
    <path d="M21.998 12h-4"></path>
    <path d="M3.515 20.485l2.828-2.828"></path>
    <path d="M2 12h4"></path>
    <path d="M3.515 3.515l2.828 2.828"></path>
    <path d="M12 20.998v-4"></path>
    <path d="M20.485 20.485l-2.828-2.828"></path>
  </svg>
);
