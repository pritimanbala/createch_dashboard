import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingDown, Zap, Leaf, DollarSign, Clock, CheckCircle } from "lucide-react";

const monthlyKPIs = [
  { label: "Total Elements", value: "156", icon: CheckCircle, color: "text-green-600" },
  { label: "Avg Cycle Time", value: "13.8h", change: "-17%", icon: Clock, color: "text-blue-600" },
  { label: "Energy Saved", value: "2.8 MWh", change: "-21%", icon: Zap, color: "text-yellow-600" },
  { label: "CO₂ Saved", value: "1.9t", change: "-24%", icon: Leaf, color: "text-emerald-600" },
  { label: "Cost Saved", value: "₹14.2L", change: "-19%", icon: DollarSign, color: "text-green-600" },
  { label: "On-time Delivery", value: "92%", change: "+12%", icon: TrendingDown, color: "text-blue-600" },
];

const optimizationTable = [
  {
    process: "#187 Pier",
    original: "18h steam",
    aiStrategy: "12h combo",
    timeSaved: "6h",
    energySaved: "28kWh",
    co2Saved: "18kg",
    costSaved: "₹4,200"
  },
  {
    process: "#192 Wall",
    original: "16h chamber",
    aiStrategy: "11h steam",
    timeSaved: "5h",
    energySaved: "22kWh",
    co2Saved: "14kg",
    costSaved: "₹3,100"
  },
  {
    process: "#201 Girder",
    original: "24h ambient",
    aiStrategy: "15h steam",
    timeSaved: "9h",
    energySaved: "45kWh",
    co2Saved: "28kg",
    costSaved: "₹6,800"
  },
  {
    process: "#205 T-Beam",
    original: "20h chamber",
    aiStrategy: "13h combo",
    timeSaved: "7h",
    energySaved: "32kWh",
    co2Saved: "20kg",
    costSaved: "₹4,800"
  },
  {
    process: "#212 Panel",
    original: "14h steam",
    aiStrategy: "10h steam",
    timeSaved: "4h",
    energySaved: "18kWh",
    co2Saved: "11kg",
    costSaved: "₹2,600"
  },
  {
    process: "#218 Box",
    original: "22h ambient",
    aiStrategy: "14h combo",
    timeSaved: "8h",
    energySaved: "38kWh",
    co2Saved: "24kg",
    costSaved: "₹5,400"
  },
  {
    process: "#223 Pier",
    original: "19h chamber",
    aiStrategy: "12h chamber",
    timeSaved: "7h",
    energySaved: "30kWh",
    co2Saved: "19kg",
    costSaved: "₹4,500"
  },
  {
    process: "#228 Slab",
    original: "15h steam",
    aiStrategy: "11h combo",
    timeSaved: "4h",
    energySaved: "20kWh",
    co2Saved: "13kg",
    costSaved: "₹3,000"
  },
];

const carbonTrendData = [
  { month: "Jan", actual: 2.8, target: 3.2, baseline: 4.5 },
  { month: "Feb", actual: 2.6, target: 3.0, baseline: 4.3 },
  { month: "Mar", actual: 2.3, target: 2.8, baseline: 4.2 },
  { month: "Apr", actual: 2.1, target: 2.6, baseline: 4.0 },
  { month: "May", actual: 1.9, target: 2.4, baseline: 3.9 },
  { month: "Jun", actual: 1.8, target: 2.2, baseline: 3.8 },
];

const savingsByCategory = [
  { category: "Energy", baseline: 3500, optimized: 2765, saved: 735 },
  { category: "Materials", baseline: 2800, optimized: 2520, saved: 280 },
  { category: "Labor", baseline: 1500, optimized: 1380, saved: 120 },
  { category: "Maintenance", baseline: 900, optimized: 810, saved: 90 },
];

export function CostEfficiency() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cost Efficiency & Optimization Summary</h1>
        <p className="text-gray-600 mt-2">Month-to-date performance vs baseline (February 2026)</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {monthlyKPIs.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">{kpi.label}</span>
                <Icon className={kpi.color} size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              {kpi.change && (
                <div className={`text-xs mt-1 font-semibold ${
                  kpi.change.startsWith('-') || kpi.change.startsWith('+') 
                    ? kpi.change.startsWith('-') ? 'text-green-600' : 'text-blue-600'
                    : 'text-gray-600'
                }`}>
                  {kpi.change} vs baseline
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-4">💰 Total Cost Savings</h2>
          <div className="text-5xl font-bold mb-2">₹14.2 Lakhs</div>
          <div className="text-green-100">Saved in February 2026 through AI optimization</div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">124h</div>
              <div className="text-sm text-green-100">Time Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2.8MWh</div>
              <div className="text-sm text-green-100">Energy Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1.9t</div>
              <div className="text-sm text-green-100">CO₂ Saved</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#005EB8] to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🌿 Carbon Neutrality Progress</h2>
          <div className="text-5xl font-bold mb-2">23%</div>
          <div className="text-blue-100">Ahead of 2040 Carbon Neutral trajectory</div>
          <div className="mt-6">
            <div className="bg-white/20 rounded-full h-3 mb-2">
              <div className="bg-[#FDB813] h-3 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <div className="text-sm text-blue-100">68% progress to 2030 milestone</div>
          </div>
        </div>
      </div>

      {/* Optimization Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">What We Optimized This Month</h2>
          <p className="text-sm text-gray-600 mt-1">Detailed breakdown of AI-driven improvements across 8 sample processes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Process</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Original Plan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">AI Strategy</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Time Saved</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Energy Saved</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">CO₂ Saved</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Cost Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {optimizationTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.process}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.original}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium">{row.aiStrategy}</td>
                  <td className="px-6 py-4 text-sm text-right text-green-600 font-semibold">{row.timeSaved}</td>
                  <td className="px-6 py-4 text-sm text-right text-green-600 font-semibold">{row.energySaved}</td>
                  <td className="px-6 py-4 text-sm text-right text-green-600 font-semibold">{row.co2Saved}</td>
                  <td className="px-6 py-4 text-sm text-right text-green-700 font-bold">{row.costSaved}</td>
                </tr>
              ))}
              <tr className="bg-blue-50 border-t-2 border-blue-500">
                <td className="px-6 py-4 text-sm font-bold text-gray-900" colSpan={3}>TOTAL MONTHLY SAVINGS</td>
                <td className="px-6 py-4 text-sm text-right font-bold text-green-700">124h</td>
                <td className="px-6 py-4 text-sm text-right font-bold text-green-700">2.8MWh</td>
                <td className="px-6 py-4 text-sm text-right font-bold text-green-700">1.9t</td>
                <td className="px-6 py-4 text-sm text-right font-bold text-green-700">₹14.2L ✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Carbon Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">CO₂ Emissions Trend (tonnes/month)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={carbonTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="2025 Baseline" />
              <Line type="monotone" dataKey="target" stroke="#FDB813" strokeWidth={2} name="2026 Target" />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="2026 Actual" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700 font-semibold">
            <TrendingDown size={18} />
            <span>23% ahead of 2040 Carbon Neutral trajectory</span>
          </div>
        </div>

        {/* Savings by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cost Savings by Category (₹'000)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={savingsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="baseline" fill="#cbd5e1" name="Baseline" />
              <Bar dataKey="optimized" fill="#005EB8" name="Optimized" />
              <Bar dataKey="saved" fill="#10b981" name="Saved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">🎯 Q1 2026 Targets: All Green!</h3>
            <div className="grid grid-cols-4 gap-8 mt-4">
              <div>
                <div className="text-3xl font-bold">15.2h</div>
                <div className="text-sm text-green-100">Avg Cycle Time (Target: 16h)</div>
              </div>
              <div>
                <div className="text-3xl font-bold">94%</div>
                <div className="text-sm text-green-100">On-time Delivery (Target: 90%)</div>
              </div>
              <div>
                <div className="text-3xl font-bold">-22%</div>
                <div className="text-sm text-green-100">Energy Reduction (Target: -18%)</div>
              </div>
              <div>
                <div className="text-3xl font-bold">₹42L</div>
                <div className="text-sm text-green-100">Total Saved Q1 (Target: ₹35L)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
