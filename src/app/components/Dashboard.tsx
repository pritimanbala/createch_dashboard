import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Activity, Zap, Leaf, Clock, AlertTriangle, CheckCircle, RefreshCw, TrendingUp, Truck } from "lucide-react";
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
      setProcesses(data);
    } catch (err) {
      console.error("[v0] Error loading processes:", err);
      setError(err instanceof Error ? err.message : "Failed to load processes");
    } finally {
      setIsLoading(false);
    }
  };

  const getProcessStatus = (process: ProcessRecord) => {
    if (process.status === 'in_progress') return { badge: 'bg-blue-50 border-blue-200', status: 'active', label: 'In Progress' };
    if (process.status === 'completed') return { badge: 'bg-green-50 border-green-200', status: 'complete', label: 'Completed' };
    if (process.status === 'cancelled') return { badge: 'bg-red-50 border-red-200', status: 'error', label: 'Cancelled' };
    return { badge: 'bg-gray-50 border-gray-200', status: 'pending', label: 'Scheduled' };
  };

  return (
    <div className="p-8">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-semibold">{kpi.label}</p>
                  {kpi.value ? (
                    <>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{kpi.target}</p>
                    </>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {kpi.values?.map((v, i) => (
                        <p key={i} className="text-sm font-semibold text-gray-900">{v}</p>
                      ))}
                    </div>
                  )}
                </div>
                <Icon className={`${kpi.color} flex-shrink-0`} size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Production Processes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Live Production Processes</h2>
          <button
            onClick={loadProcesses}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#005EB8] hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">{error}</p>
              <p className="text-sm text-red-700 mt-1">Showing demo data</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-600">Loading processes...</p>
          </div>
        ) : processes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <p className="text-gray-600 mb-4">No processes added yet</p>
            <Link
              to="/add-process"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Your First Process
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {processes.map((process) => {
              const status = getProcessStatus(process);
              const startTime = new Date(process.scheduled_start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
              const endTime = new Date(process.scheduled_end_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
              const castingHours = process.casting_time_minutes ? (process.casting_time_minutes / 60).toFixed(1) : '0.5';
              
              return (
                <Link
                  key={process.id}
                  to={`/process/${process.id}`}
                  className={`${status.badge} border-2 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{process.material_name}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span>Qty: {process.quantity}</span>
                        <span>•</span>
                        <span>Time: {castingHours}h</span>
                        <span>•</span>
                        <span>{startTime} - {endTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-gray-300">
                      <CheckCircle size={16} className={status.status === 'active' ? 'text-blue-600' : status.status === 'complete' ? 'text-green-600' : 'text-gray-400'} />
                      <span className="text-sm font-semibold text-gray-700">{status.label}</span>
                    </div>
                  </div>

                  {/* Process Details Grid */}
                  <div className="grid grid-cols-6 gap-3 mb-4">
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Maturity</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{process.current_maturity || 0}°C·h</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Temperature</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{process.current_temperature || 20}°C</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Target Strength</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{process.target_strength || 15}MPa</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Moulds</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{process.moulds_required || process.mould}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Cranes</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{process.cranes_required || 1}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Chambers</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{process.chambers}</p>
                    </div>
                  </div>

                  {/* Transportation Info */}
                  {process.transportation_location && (
                    <div className="bg-white/60 rounded-lg p-3 flex items-start gap-3">
                      <Truck className="text-[#005EB8] flex-shrink-0 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{process.transportation_location}</p>
                        <div className="flex gap-4 mt-1 text-xs text-gray-600">
                          <span>Factor: {process.transportation_factor || 0}x</span>
                          <span>•</span>
                          <span>Cost: ₹{process.transportation_cost || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mix Details */}
                  <div className="grid grid-cols-4 gap-2 mt-4 text-xs text-gray-600 bg-white/40 p-3 rounded-lg">
                    <div><span className="font-semibold text-gray-700">Cement:</span> {process.cement}kg</div>
                    <div><span className="font-semibold text-gray-700">Slag:</span> {process.slag}kg</div>
                    <div><span className="font-semibold text-gray-700">Fly Ash:</span> {process.fly_ash}kg</div>
                    <div><span className="font-semibold text-gray-700">Water:</span> {process.water}kg</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Resource Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Resource Utilization Timeline</h2>
        <div className="space-y-4">
          {[
            { resource: "Mould", total: 24, used: 18 },
            { resource: "Chamber", total: 8, used: 6 },
            { resource: "Crane", total: 4, used: 3 },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{item.resource}</span>
                <span className="text-sm font-semibold text-gray-700">{item.used}/{item.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#005EB8] h-2 rounded-full transition-all"
                  style={{ width: `${(item.used / item.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
