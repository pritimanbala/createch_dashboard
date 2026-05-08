import { Link } from "react-router";
import { Activity, Zap, Leaf, Clock, AlertTriangle, CheckCircle, Clock3, Sparkles, Sliders, Calendar } from "lucide-react";

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

const processes = [
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
  {
    id: "26",
    name: "Box Girder",
    grade: "M50",
    stage: "Curing",
    mould: "7",
    chamber: "2",
    crane: "1",
    castTime: "07:30",
    currentTime: "8h15m",
    demouldETA: "16:00",
    strength: { current: 14.2, target: 15 },
    energy: "52kWh",
    co2: "32kg",
    aiSuggestion: "On track - maintain current profile",
    status: "safe",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "27",
    name: "Slab Panel",
    grade: "M40",
    stage: "Demould",
    mould: "15",
    crane: "4",
    castTime: "Yesterday 14:20",
    strength: { current: 16.8, target: 15 },
    energy: "38kWh",
    co2: "24kg",
    aiSuggestion: "Ready for demould - strength achieved",
    status: "safe",
    color: "bg-teal-50 border-teal-200",
  },
  {
    id: "28",
    name: "T-Beam",
    grade: "M55",
    stage: "Casting",
    mould: "9",
    location: "Bay 2",
    crew: "B",
    progress: 67,
    finishETA: "13:15",
    mix: "380kg cement, 15% flyash",
    aiSuggestion: "Weather alert: Rain at 14:00, expedite curing prep",
    status: "warning",
    color: "bg-yellow-50 border-yellow-200",
  },
];

const resourceTimeline = [
  { resource: "Mould", total: 24, used: 18, critical: [14, 15, 16] },
  { resource: "Chamber", total: 8, used: 6, critical: [4] },
  { resource: "Crane", total: 4, used: 3, critical: [2, 4] },
];

export function Dashboard() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time yard status and AI insights</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/simulation-playground"
            className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <Sliders size={18} />
            Simulation Lab
          </Link>
          <Link
            to="/production-planning"
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Calendar size={18} />
            Production Plan
          </Link>
        </div>
      </div>

      {/* Hero Section - KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">{kpi.label}</span>
                <Icon className={kpi.color} size={24} />
              </div>
              {kpi.values ? (
                <div className="space-y-1">
                  {kpi.values.map((v, i) => (
                    <div key={i} className="text-sm font-semibold text-gray-800">
                      {v}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  {kpi.target && <div className="text-xs text-gray-500 mt-1">{kpi.target}</div>}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Optimization Tip */}
      <div className="bg-gradient-to-r from-[#005EB8] to-blue-600 rounded-xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-[#FDB813] rounded-full p-3">
            <Zap size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">⚡ Today's AI Optimization Tip</h3>
            <p className="text-blue-50">
              Chamber 4 running 2h overtime on pier segments. Switch to 65°C/4h profile to save{" "}
              <span className="font-bold text-[#FDB813]">18% energy</span> while meeting 15MPa target
            </p>
          </div>
          <Link
            to="/process/23"
            className="bg-white text-[#005EB8] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Main Process Cards Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Live Production Processes</h2>
          <Link
            to="/add-process"
            className="bg-[#005EB8] text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Start New Process
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {processes.map((process) => (
            <Link
              key={process.id}
              to={`/process/${process.id}`}
              className={`${process.color} border-2 rounded-xl p-5 hover:shadow-lg transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Process #{process.id}: {process.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-gray-700">{process.grade}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      process.stage === 'Curing' ? 'bg-blue-200 text-blue-800' :
                      process.stage === 'Casting' ? 'bg-green-200 text-green-800' :
                      process.stage === 'Prep' ? 'bg-orange-200 text-orange-800' :
                      'bg-teal-200 text-teal-800'
                    }`}>
                      {process.stage}
                    </span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  process.status === 'safe' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {process.status === 'safe' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                </div>
              </div>

              {/* Stage-specific content */}
              <div className="space-y-2 text-sm text-gray-700 mb-3">
                {process.stage === 'Curing' && (
                  <>
                    <div className="flex justify-between">
                      <span>Mould #{process.mould} | Chamber #{process.chamber} | Crane #{process.crane}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cast: {process.castTime}</span>
                      <span className="font-semibold">Curing: {process.currentTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demould ETA: {process.demouldETA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Strength: {process.strength.current}/{process.strength.target}MPa ✓</span>
                    </div>
                    <div className="flex gap-4">
                      <span>Energy: {process.energy}</span>
                      <span>CO₂: {process.co2}</span>
                    </div>
                  </>
                )}
                
                {process.stage === 'Casting' && (
                  <>
                    <div>Mould #{process.mould} | {process.location} | Crew {process.crew}</div>
                    <div className="flex items-center gap-2">
                      <span>Progress:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#005EB8] h-2 rounded-full"
                          style={{ width: `${process.progress}%` }}
                        />
                      </div>
                      <span className="font-semibold">{process.progress}%</span>
                    </div>
                    <div>Finish ETA: {process.finishETA}</div>
                    <div className="text-xs">Mix: {process.mix}</div>
                  </>
                )}

                {process.stage === 'Prep' && (
                  <>
                    <div>Mould #{process.mould} | {process.substage}</div>
                    <div className="flex justify-between">
                      <span>Complexity: {process.complexity}</span>
                      <span>Crew: {process.crew}</span>
                    </div>
                  </>
                )}

                {process.stage === 'Demould' && (
                  <>
                    <div>Mould #{process.mould} | Crane #{process.crane}</div>
                    <div>Cast: {process.castTime}</div>
                    <div>Strength: {process.strength.current}/{process.strength.target}MPa ✓</div>
                    <div className="flex gap-4">
                      <span>Energy: {process.energy}</span>
                      <span>CO₂: {process.co2}</span>
                    </div>
                  </>
                )}
              </div>

              {/* AI Suggestion */}
              <div className="bg-white/80 rounded-lg p-3 mt-3 border border-gray-200">
                <div className="flex items-start gap-2">
                  <Zap size={14} className="text-[#FDB813] mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-800 font-medium">{process.aiSuggestion}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Resource Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">24h Resource Timeline</h3>
        <div className="space-y-4">
          {resourceTimeline.map((resource) => (
            <div key={resource.resource}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {resource.resource} Utilization
                </span>
                <span className="text-sm text-gray-600">
                  {resource.used}/{resource.total} in use
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: resource.total }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-8 rounded ${
                      i < resource.used
                        ? resource.critical.includes(i + 1)
                          ? "bg-red-400"
                          : "bg-[#005EB8]"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {resource.critical.length > 0 && (
                <div className="text-xs text-red-600 mt-1">
                  ⚠️ High utilization: {resource.resource} #{resource.critical.join(", #")}
                </div>
              )}
            </div>
          ))}
        </div>
        <Link
          to="/yard-resources"
          className="block mt-4 text-center text-[#005EB8] font-semibold hover:underline"
        >
          View Detailed Resource Schedule →
        </Link>
      </div>
    </div>
  );
}
