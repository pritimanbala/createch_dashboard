import { AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";

const mouldSchedule = [
  { id: 1, process: "Pier #23", type: "Pier", start: 8, duration: 9, status: "active" },
  { id: 2, process: "Wall #24", type: "Wall", start: 9, duration: 6, status: "active" },
  { id: 3, process: "Girder #25", type: "Girder", start: 10, duration: 12, status: "prep" },
  { id: 4, process: null, type: null, start: 0, duration: 0, status: "free" },
  { id: 5, process: "Girder #26", type: "Girder", start: 7, duration: 11, status: "active" },
  { id: 6, process: null, type: null, start: 0, duration: 0, status: "free" },
  { id: 7, process: "Box #27", type: "Box", start: 7, duration: 10, status: "active" },
  { id: 8, process: "Slab #28", type: "Slab", start: 14, duration: 4, status: "scheduled" },
  { id: 9, process: "T-Beam #29", type: "TBeam", start: 9, duration: 8, status: "active" },
  { id: 10, process: null, type: null, start: 0, duration: 0, status: "free" },
  { id: 11, process: null, type: null, start: 0, duration: 0, status: "free" },
  { id: 12, process: "Pier #30", type: "Pier", start: 8, duration: 9, status: "active" },
  { id: 13, process: "Wall #31", type: "Wall", start: 11, duration: 6, status: "active" },
  { id: 14, process: "Panel #32", type: "Wall", start: 6, duration: 7, status: "active" },
  { id: 15, process: "Slab #33", type: "Slab", start: 14, duration: 5, status: "demould" },
  { id: 16, process: "Conflict!", type: "Pier", start: 15, duration: 8, status: "conflict" },
  { id: 17, process: null, type: null, start: 0, duration: 0, status: "free" },
  { id: 18, process: "Wall #34", type: "Wall", start: 9, duration: 6, status: "active" },
  { id: 19, process: "Girder #35", type: "Girder", start: 12, duration: 11, status: "scheduled" },
  { id: 20, process: null, type: null, start: 0, duration: 0, status: "free" },
  { id: 21, process: null, type: null, start: 0, duration: 0, status: "free" },
  { id: 22, process: "Box #36", type: "Box", start: 10, duration: 10, status: "active" },
  { id: 23, process: "Pier #37", type: "Pier", start: 13, duration: 9, status: "scheduled" },
  { id: 24, process: "T-Beam #38", type: "TBeam", start: 8, duration: 8, status: "active" },
];

const chamberSchedule = [
  { id: 1, processes: ["Pier #23", "Box #27"], start: 8, end: 18, utilization: 100 },
  { id: 2, processes: ["Girder #26"], start: 10, end: 20, utilization: 90 },
  { id: 3, processes: [], start: 0, end: 0, utilization: 0 },
  { id: 4, processes: ["Pier #30", "Wall #31"], start: 8, end: 20, utilization: 120, alert: true },
  { id: 5, processes: [], start: 0, end: 0, utilization: 0 },
  { id: 6, processes: ["T-Beam #29", "Panel #32"], start: 9, end: 17, utilization: 95 },
  { id: 7, processes: [], start: 14, end: 18, utilization: 0, suggestion: "Free 14:00-18:00" },
  { id: 8, processes: ["Wall #34"], start: 12, end: 18, utilization: 70 },
];

const craneSchedule = [
  { id: 1, tasks: ["Demould #33", "Move #26", "Setup #27"], hours: [6, 8, 10, 12, 14, 16], status: "busy" },
  { id: 2, tasks: ["Demould #23", "Position #24"], hours: [8, 10, 14, 16], status: "active" },
  { id: 3, tasks: [], hours: [], status: "free" },
  { id: 4, tasks: ["Move #28", "Setup #29", "CONFLICT", "Demould #31"], hours: [9, 11, 15, 17], status: "overload" },
];

const typeColors = {
  Pier: "bg-blue-500",
  Wall: "bg-green-500",
  Girder: "bg-orange-500",
  Box: "bg-purple-500",
  Slab: "bg-teal-500",
  TBeam: "bg-indigo-500",
};

export function YardResources() {
  const currentHour = 13;
  const freeNow = {
    moulds: mouldSchedule.filter(m => m.status === "free").length,
    chambers: chamberSchedule.filter(c => c.utilization === 0).length,
    cranes: craneSchedule.filter(c => c.status === "free").length,
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Yard Resource Schedule</h1>
        <p className="text-gray-600 mt-2">24-hour timeline with capacity constraints (Current time: 13:00)</p>
      </div>

      {/* Resource Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Available Now</div>
          <div className="text-3xl font-bold text-green-600">{freeNow.moulds}</div>
          <div className="text-xs text-gray-600 mt-1">Moulds (of 24)</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Available Now</div>
          <div className="text-3xl font-bold text-green-600">{freeNow.chambers}</div>
          <div className="text-xs text-gray-600 mt-1">Chambers (of 8)</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Available Now</div>
          <div className="text-3xl font-bold text-green-600">{freeNow.cranes}</div>
          <div className="text-xs text-gray-600 mt-1">Cranes (of 4)</div>
        </div>
        <div className="bg-gradient-to-br from-[#005EB8] to-blue-600 rounded-xl p-5 text-white">
          <div className="text-sm text-blue-100 mb-2">Next Available</div>
          <div className="text-xl font-bold">Mould #8</div>
          <div className="text-xs text-blue-100 mt-1">@ 13:45 (in 45min)</div>
        </div>
      </div>

      {/* Mould Utilization */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mould Utilization (24 Total)</h2>
        <div className="mb-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded"></div>Pier</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div>Wall</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded"></div>Girder</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded"></div>Box</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-teal-500 rounded"></div>Slab</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-500 rounded"></div>T-Beam</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div>Conflict</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded"></div>Free</div>
        </div>
        
        <div className="space-y-2">
          {mouldSchedule.map((mould) => (
            <div key={mould.id} className="flex items-center gap-3">
              <div className="w-20 text-sm font-semibold text-gray-700">Mould #{mould.id}</div>
              <div className="flex-1 h-10 bg-gray-100 rounded-lg relative overflow-hidden">
                {mould.process && (
                  <div
                    className={`absolute top-0 h-full flex items-center px-3 text-white text-xs font-semibold ${
                      mould.status === "conflict" 
                        ? "bg-red-500" 
                        : typeColors[mould.type as keyof typeof typeColors] || "bg-gray-400"
                    }`}
                    style={{
                      left: `${(mould.start / 24) * 100}%`,
                      width: `${(mould.duration / 24) * 100}%`,
                    }}
                  >
                    {mould.process}
                    {mould.status === "conflict" && " ⚠️"}
                  </div>
                )}
                {/* Current time indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                  style={{ left: `${(currentHour / 24) * 100}%` }}
                ></div>
              </div>
              {mould.status === "free" && (
                <div className="w-32 text-xs text-green-600 font-semibold flex items-center gap-1">
                  <CheckCircle size={14} /> Available
                </div>
              )}
            </div>
          ))}
        </div>
        {mouldSchedule.some(m => m.status === "conflict") && (
          <div className="mt-4 bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
            <div className="text-sm text-red-800">
              <strong>Capacity Conflict:</strong> Mould #16 over-allocated at 15:00. Consider rescheduling process or using alternative mould.
            </div>
          </div>
        )}
      </div>

      {/* Chamber Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Curing Chamber Schedule (8 Total)</h2>
        <div className="space-y-3">
          {chamberSchedule.map((chamber) => (
            <div key={chamber.id}>
              <div className="flex items-center gap-3">
                <div className="w-24 text-sm font-semibold text-gray-700">Chamber #{chamber.id}</div>
                <div className="flex-1 h-12 bg-gray-100 rounded-lg relative overflow-hidden">
                  {chamber.processes.length > 0 ? (
                    <div
                      className={`absolute top-0 h-full flex items-center px-3 text-white text-xs font-semibold ${
                        chamber.alert ? "bg-red-500" : "bg-[#005EB8]"
                      }`}
                      style={{
                        left: `${(chamber.start / 24) * 100}%`,
                        width: `${((chamber.end - chamber.start) / 24) * 100}%`,
                      }}
                    >
                      <div className="flex flex-col">
                        {chamber.processes.map((p, i) => (
                          <span key={i}>{p}</span>
                        ))}
                      </div>
                    </div>
                  ) : chamber.suggestion ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 italic">
                      {chamber.suggestion}
                    </div>
                  ) : null}
                  {/* Current time indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                    style={{ left: `${(currentHour / 24) * 100}%` }}
                  ></div>
                </div>
                <div className={`w-24 text-xs font-semibold ${
                  chamber.utilization === 0 ? "text-green-600" :
                  chamber.utilization > 100 ? "text-red-600" :
                  chamber.utilization > 90 ? "text-yellow-600" :
                  "text-blue-600"
                }`}>
                  {chamber.utilization}% used
                </div>
              </div>
              {chamber.alert && (
                <div className="ml-28 mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Over-capacity: 2 processes overlapping 8h-20h
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Suggestion */}
        <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4 flex items-start gap-3">
          <Zap className="text-[#FDB813] flex-shrink-0" size={20} />
          <div className="text-sm text-gray-800">
            <strong>AI Suggestion:</strong> Shift 2 pier processes to Chamber #7 (free 14:00-18:00) to resolve Chamber #4 overload. Energy impact: +3%, time neutral.
          </div>
        </div>
      </div>

      {/* Crane Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Crane Schedule (4 Total)</h2>
        <div className="space-y-3">
          {craneSchedule.map((crane) => (
            <div key={crane.id}>
              <div className="flex items-center gap-3">
                <div className="w-24 text-sm font-semibold text-gray-700">Crane #{crane.id}</div>
                <div className="flex-1 h-12 bg-gray-100 rounded-lg relative overflow-hidden">
                  {crane.hours.map((hour, idx) => (
                    <div
                      key={idx}
                      className={`absolute top-0 h-full flex items-center justify-center text-white text-xs font-semibold ${
                        crane.tasks[idx] === "CONFLICT" ? "bg-red-500" : "bg-purple-600"
                      }`}
                      style={{
                        left: `${(hour / 24) * 100}%`,
                        width: `${(1.5 / 24) * 100}%`,
                      }}
                    >
                      {crane.tasks[idx]}
                    </div>
                  ))}
                  {/* Current time indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                    style={{ left: `${(currentHour / 24) * 100}%` }}
                  ></div>
                </div>
                <div className={`w-24 text-xs font-semibold ${
                  crane.status === "free" ? "text-green-600" :
                  crane.status === "overload" ? "text-red-600" :
                  "text-blue-600"
                }`}>
                  {crane.status === "free" ? "Available" :
                   crane.status === "overload" ? "Overloaded" :
                   "In Use"}
                </div>
              </div>
              {crane.status === "overload" && (
                <div className="ml-28 mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Critical path conflict at 15:00-17:00
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Alert */}
        <div className="mt-6 bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
          <div className="text-sm text-red-800">
            <strong>Crane Overload Alert:</strong> Crane #4 has 3 tasks scheduled 15:00-17:00. AI recommends delaying Process #25 start by 30min to prevent bottleneck.
          </div>
        </div>
      </div>

      {/* Timeline Legend */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <div className="text-sm text-gray-700">
          <strong>Timeline:</strong> Each bar represents 24 hours (0:00 - 24:00). Red vertical line indicates current time (13:00). 
          Hover over elements for details. Conflicts highlighted in red require immediate attention.
        </div>
      </div>
    </div>
  );
}
