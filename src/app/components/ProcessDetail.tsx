import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Zap, AlertTriangle, CheckCircle, ThermometerSun, Activity, ArrowLeft, Truck } from "lucide-react";
import { getProcesses, ProcessRecord } from "@/lib/supabase";



export function ProcessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [process, setProcess] = useState<ProcessRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProcessDetail();
  }, [id]);

  const loadProcessDetail = async () => {
    try {
      setIsLoading(true);
      const processes = await getProcesses();
      const found = processes.find(p => p.id === id);
      if (found) {
        setProcess(found);
      } else {
        console.error("[v0] Process not found");
      }
    } catch (err) {
      console.error("[v0] Error loading process:", err);
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return (
      <div className="p-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#005EB8] font-semibold mb-6 hover:text-blue-700">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="text-center py-12">Loading process details...</div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="p-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#005EB8] font-semibold mb-6 hover:text-blue-700">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="text-center py-12 text-gray-600">Process not found</div>
      </div>
    );
  }

  const timelineData = [
    { time: "0h", temp: 20, maturity: 0, strength: 0 },
    { time: "2h", temp: 22, maturity: 44, strength: 1.2 },
    { time: "4h", temp: 55, maturity: 154, strength: 4.8 },
    { time: "6h", temp: 65, maturity: 404, strength: 10.2 },
    { time: "6.5h", temp: 65, maturity: 437, strength: 12.8 },
    { time: "8h", temp: 58, maturity: 530, strength: 14.2 },
    { time: "10h", temp: 42, maturity: 630, strength: 15.1 },
    { time: "12h", temp: 28, maturity: 710, strength: 15.6 },
  ];

  const castingTimeHours = process.casting_time_minutes ? process.casting_time_minutes / 60 : 0.5;

  return (
    <div className="flex h-full">
      {/* Main Content - 70% */}
      <div className="flex-1 p-8 overflow-auto bg-gray-50">
        {/* Back Button */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#005EB8] font-semibold mb-6 hover:text-blue-700">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{process.material_name}</h1>
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <CheckCircle size={20} />
              <span className="font-semibold">On Track</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Qty: {process.quantity}</span>
            <span>•</span>
            <span>Mould #{process.mould}</span>
            <span>•</span>
            <span>Chamber #{process.chambers}</span>
            <span>•</span>
            <span>{process.strategy_type.toUpperCase()} Strategy</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Process Maturity</div>
            <div className="text-2xl font-bold text-gray-900">{process.current_maturity || 437}°C·h</div>
            <div className="text-xs text-blue-600 mt-1">Current progress</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Temperature</div>
            <div className="text-2xl font-bold text-gray-900">{process.current_temperature || 65}°C</div>
            <div className="text-xs text-gray-600 mt-1">Current reading</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Casting Time</div>
            <div className="text-2xl font-bold text-gray-900">{castingTimeHours.toFixed(1)}h</div>
            <div className="text-xs text-gray-600 mt-1">Duration</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Target Strength</div>
            <div className="text-2xl font-bold text-gray-900">{process.target_strength || 15}MPa</div>
            <div className="text-xs text-green-600 mt-1">Goal</div>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Process Timeline</h2>
          <div className="flex gap-2 mb-6">
            {[
              { stage: "Prep", time: "1.2h", status: "complete" },
              { stage: "Cast", time: `${castingTimeHours.toFixed(1)}h`, status: "active" },
              { stage: "Cure", time: "6h32m", status: "active" },
              { stage: "Demould", time: "0.5h", status: "pending" },
              { stage: "Transport", time: "1h", status: "pending" },
            ].map((stage, idx) => (
              <div key={idx} className="flex-1">
                <div className={`rounded-lg p-3 text-center ${
                  stage.status === 'complete' ? 'bg-green-100 border-2 border-green-500' :
                  stage.status === 'active' ? 'bg-blue-100 border-2 border-blue-500' :
                  'bg-gray-100 border-2 border-gray-300'
                }`}>
                  <div className="font-semibold text-gray-900">{stage.stage}</div>
                  <div className="text-sm text-gray-600 mt-1">{stage.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Temperature & Strength Charts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ThermometerSun className="text-[#005EB8]" />
            Temperature vs Strength Prediction
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Strength (MPa)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#FDB813" strokeWidth={2} name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="strength" stroke="#005EB8" strokeWidth={2} name="Strength (MPa)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Maturity Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-green-600" />
            Maturity Index Progress
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="maturity" stroke="#10b981" fill="#10b98133" name="Maturity (°C·h)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Transportation & Equipment Details */}
        {process.transportation_location && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg mb-6">
            <div className="flex items-start gap-4">
              <Truck size={32} className="text-white flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Transportation Details</h3>
                <div className="grid grid-cols-3 gap-4 bg-white/20 rounded-lg p-4 mt-2">
                  <div>
                    <p className="text-orange-100 text-sm">Location</p>
                    <p className="text-white font-semibold">{process.transportation_location}</p>
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm">Transportation Factor</p>
                    <p className="text-white font-semibold">{process.transportation_factor || 0}x</p>
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm">Transportation Cost</p>
                    <p className="text-white font-semibold">₹{process.transportation_cost || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Requirements */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Equipment Requirements</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Moulds Needed</p>
              <p className="text-3xl font-bold text-[#005EB8]">{process.moulds_required || process.mould}</p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Cranes Needed</p>
              <p className="text-3xl font-bold text-purple-600">{process.cranes_required || 1}</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Chambers Required</p>
              <p className="text-3xl font-bold text-green-600">{process.chambers}</p>
            </div>
          </div>
        </div>

        {/* Mix Composition */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mix Composition</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Cement</p>
              <p className="text-2xl font-bold text-gray-900">{process.cement}kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Slag</p>
              <p className="text-2xl font-bold text-gray-900">{process.slag}kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Fly Ash</p>
              <p className="text-2xl font-bold text-gray-900">{process.fly_ash}kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Water</p>
              <p className="text-2xl font-bold text-gray-900">{process.water}kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Superplasticizer</p>
              <p className="text-2xl font-bold text-gray-900">{process.superplasticizer}kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Coarse Agg.</p>
              <p className="text-2xl font-bold text-gray-900">{process.coarse}kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Fine Agg.</p>
              <p className="text-2xl font-bold text-gray-900">{process.fine}kg</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Curing Method</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{process.curing_method}</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
