import { Calendar, TrendingUp, Users, Clock, Package, AlertCircle, CheckCircle2, Target } from "lucide-react";

export function ProductionPlanning() {
  const batches = [
    { id: 1, element: "Pier Cap", qty: 12, status: "in-progress", completion: 75, startDate: "2026-05-06", endDate: "2026-05-12" },
    { id: 2, element: "Wall Panel", qty: 24, status: "scheduled", completion: 0, startDate: "2026-05-13", endDate: "2026-05-20" },
    { id: 3, element: "U-Girder", qty: 8, status: "pending", completion: 0, startDate: "2026-05-21", endDate: "2026-05-25" },
  ];

  const resources = [
    { name: "Moulds Available", current: 18, total: 24, utilization: 75 },
    { name: "Curing Chambers", current: 6, total: 8, utilization: 75 },
    { name: "Cranes", current: 3, total: 4, utilization: 75 },
    { name: "Labor Teams", current: 4, total: 6, utilization: 67 },
  ];

  const shiftRecommendations = [
    { shift: "Morning (6 AM - 2 PM)", tasks: "Casting, De-moulding", priority: "High", workers: 12 },
    { shift: "Afternoon (2 PM - 10 PM)", tasks: "Curing monitoring, Quality checks", priority: "Medium", workers: 8 },
    { shift: "Night (10 PM - 6 AM)", tasks: "Chamber supervision, Emergency response", priority: "Low", workers: 4 },
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="text-[#005EB8]" size={32} />
          Production Planning & Scheduling
        </h1>
        <p className="text-gray-600 mt-2">
          Optimize yard capacity, track batches, and plan workforce allocation
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-blue-700" size={28} />
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">44</div>
          <div className="text-sm text-gray-700 font-semibold">Total Units Planned</div>
          <div className="text-xs text-gray-600 mt-1">Across 3 batches</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-green-700" size={28} />
            <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded">On Track</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">87%</div>
          <div className="text-sm text-gray-700 font-semibold">Overall Progress</div>
          <div className="text-xs text-gray-600 mt-1">9 units remaining</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-300">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-orange-700" size={28} />
            <AlertCircle className="text-orange-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">12.4</div>
          <div className="text-sm text-gray-700 font-semibold">Avg Cycle Time (h)</div>
          <div className="text-xs text-gray-600 mt-1">Target: 11h</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-purple-700" size={28} />
            <CheckCircle2 className="text-green-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">May 25</div>
          <div className="text-sm text-gray-700 font-semibold">Est. Completion</div>
          <div className="text-xs text-gray-600 mt-1">3 days ahead</div>
        </div>
      </div>

      {/* Active Batches */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Production Batches</h2>
        <div className="space-y-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className={`border-2 rounded-xl p-5 ${
                batch.status === "in-progress"
                  ? "border-blue-400 bg-blue-50"
                  : batch.status === "scheduled"
                  ? "border-yellow-400 bg-yellow-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Batch #{batch.id}: {batch.element}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {batch.qty} units • {batch.startDate} to {batch.endDate}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${
                      batch.status === "in-progress"
                        ? "bg-blue-600 text-white"
                        : batch.status === "scheduled"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {batch.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-semibold">Progress</span>
                  <span className="text-gray-900 font-bold">{batch.completion}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      batch.status === "in-progress" ? "bg-blue-600" : "bg-gray-400"
                    }`}
                    style={{ width: `${batch.completion}%` }}
                  ></div>
                </div>
              </div>

              {batch.status === "in-progress" && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600">Completed</div>
                    <div className="text-xl font-bold text-gray-900">9 units</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600">In Process</div>
                    <div className="text-xl font-bold text-gray-900">2 units</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600">Remaining</div>
                    <div className="text-xl font-bold text-gray-900">1 unit</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resource Utilization */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Yard Resource Utilization</h2>
        <div className="space-y-4">
          {resources.map((resource, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">{resource.name}</span>
                <span className="text-sm text-gray-700">
                  {resource.current} / {resource.total} ({resource.utilization}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    resource.utilization >= 80
                      ? "bg-red-500"
                      : resource.utilization >= 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${resource.utilization}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-orange-50 border border-orange-300 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-orange-600 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-sm font-semibold text-gray-900">Capacity Alert</p>
              <p className="text-sm text-gray-700 mt-1">
                Moulds and chambers at 75% utilization. Consider staggered casting to avoid bottlenecks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Output Projection */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Output Projection (Next 7 Days)</h2>
        <div className="space-y-3">
          {[
            { date: "May 8", units: 3, status: "On target", color: "green" },
            { date: "May 9", units: 4, status: "High capacity", color: "blue" },
            { date: "May 10", units: 2, status: "Weather delay", color: "orange" },
            { date: "May 11", units: 3, status: "On target", color: "green" },
            { date: "May 12", units: 4, status: "On target", color: "green" },
            { date: "May 13", units: 5, status: "Peak output", color: "purple" },
            { date: "May 14", units: 3, status: "On target", color: "green" },
          ].map((day, idx) => {
            const colorMap = {
              green: { bg: 'bg-green-500', text: 'text-green-700' },
              blue: { bg: 'bg-blue-500', text: 'text-blue-700' },
              orange: { bg: 'bg-orange-500', text: 'text-orange-700' },
              purple: { bg: 'bg-purple-500', text: 'text-purple-700' }
            };
            const colors = colorMap[day.color as keyof typeof colorMap];

            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 font-semibold text-gray-900">{day.date}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className={`${colors.bg} h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                    style={{ width: `${(day.units / 5) * 100}%` }}
                  >
                    {day.units} units
                  </div>
                </div>
                <div className={`text-sm font-semibold ${colors.text} w-32`}>{day.status}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift Recommendations */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="text-indigo-600" size={28} />
          Shift Recommendations
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {shiftRecommendations.map((shift, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-indigo-200">
              <h3 className="font-bold text-gray-900 mb-2">{shift.shift}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks:</span>
                  <span className="font-semibold text-gray-900">{shift.tasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span
                    className={`font-semibold ${
                      shift.priority === "High"
                        ? "text-red-700"
                        : shift.priority === "Medium"
                        ? "text-yellow-700"
                        : "text-green-700"
                    }`}
                  >
                    {shift.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Workers:</span>
                  <span className="font-semibold text-gray-900">{shift.workers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
