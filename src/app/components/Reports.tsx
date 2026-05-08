import { FileText, Download, Calendar, TrendingUp, BarChart3, Leaf, DollarSign, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function Reports() {
  const monthlyData = [
    { month: "Jan", cost: 285000, cycles: 124, co2: 3420, efficiency: 87 },
    { month: "Feb", cost: 298000, cycles: 132, co2: 3580, efficiency: 89 },
    { month: "Mar", cost: 276000, cycles: 118, co2: 3180, efficiency: 91 },
    { month: "Apr", cost: 310000, cycles: 145, co2: 3890, efficiency: 88 },
    { month: "May", cost: 195000, cycles: 86, co2: 2340, efficiency: 92 },
  ];

  const elementDistribution = [
    { name: "Pier Cap", value: 45, color: "#005EB8" },
    { name: "Wall Panel", value: 32, color: "#FDB813" },
    { name: "U-Girder", value: 18, color: "#10B981" },
    { name: "Box Girder", value: 5, color: "#8B5CF6" },
  ];

  const reportSections = [
    {
      title: "Production Summary",
      description: "Overview of completed processes, cycle times, and output",
      icon: BarChart3,
      color: "blue",
      metrics: [
        { label: "Total Units Produced", value: "605", trend: "+12%" },
        { label: "Avg Cycle Time", value: "11.8h", trend: "-8%" },
        { label: "On-Time Completion", value: "94%", trend: "+3%" },
      ]
    },
    {
      title: "Cost Analysis",
      description: "Breakdown of production costs and optimization savings",
      icon: DollarSign,
      color: "green",
      metrics: [
        { label: "Total Cost (YTD)", value: "₹1,364,000", trend: "-5%" },
        { label: "Cost per Unit", value: "₹2,254", trend: "-7%" },
        { label: "AI Savings", value: "₹84,200", trend: "+18%" },
      ]
    },
    {
      title: "Sustainability Report",
      description: "Carbon emissions, energy usage, and green compliance",
      icon: Leaf,
      color: "emerald",
      metrics: [
        { label: "Total CO₂", value: "16,410 kg", trend: "-15%" },
        { label: "Energy Consumed", value: "68,400 kWh", trend: "-9%" },
        { label: "Green Score", value: "8.4/10", trend: "+0.6" },
      ]
    },
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="text-[#005EB8]" size={32} />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive production reports, cost analysis, and sustainability metrics
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#005EB8] text-[#005EB8] rounded-lg font-semibold hover:bg-blue-50">
              <Calendar size={18} />
              Custom Date Range
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700">
              <Download size={18} />
              Export All Reports
            </button>
          </div>
        </div>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {reportSections.map((section, idx) => {
          const Icon = section.icon;
          const colorClasses = {
            blue: {
              border: 'border-blue-300',
              bgLight: 'bg-blue-100',
              textDark: 'text-blue-700',
              bgVeryLight: 'bg-blue-50',
              button: 'bg-blue-600'
            },
            green: {
              border: 'border-green-300',
              bgLight: 'bg-green-100',
              textDark: 'text-green-700',
              bgVeryLight: 'bg-green-50',
              button: 'bg-green-600'
            },
            emerald: {
              border: 'border-emerald-300',
              bgLight: 'bg-emerald-100',
              textDark: 'text-emerald-700',
              bgVeryLight: 'bg-emerald-50',
              button: 'bg-emerald-600'
            }
          };
          const colors = colorClasses[section.color as keyof typeof colorClasses];

          return (
            <div key={idx} className={`bg-white rounded-xl p-6 shadow-sm border-2 ${colors.border}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`${colors.bgLight} p-3 rounded-lg`}>
                  <Icon className={colors.textDark} size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{section.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{section.description}</p>

              <div className="space-y-3">
                {section.metrics.map((metric, i) => (
                  <div key={i} className={`${colors.bgVeryLight} rounded-lg p-3`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                        <span className={`text-xs font-semibold ${
                          metric.trend.startsWith('+') || metric.trend.startsWith('-') && parseFloat(metric.trend) < 0
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}>
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className={`w-full mt-4 ${colors.button} text-white py-3 rounded-lg font-semibold hover:opacity-90`}>
                View Full Report
              </button>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Monthly Cost Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Cost Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="#005EB8" strokeWidth={3} name="Cost (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Production Efficiency */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Production Efficiency (%)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="efficiency" fill="#10B981" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CO2 Emissions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">CO₂ Emissions (kg)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="co2" stroke="#10B981" strokeWidth={3} name="CO₂ (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Element Type Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Element Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={elementDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {elementDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Insights & Recommendations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Efficiency Improving</h3>
                <p className="text-sm text-gray-700">
                  May shows 92% efficiency, up from 87% in January. AI optimization is reducing cycle times by 8%.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Cost Savings Achieved</h3>
                <p className="text-sm text-gray-700">
                  AI recommendations have saved ₹84,200 YTD through optimized curing strategies and reduced energy usage.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">April Cost Spike</h3>
                <p className="text-sm text-gray-700">
                  April costs increased by 12% due to high production volume (145 cycles). Consider capacity planning.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <TrendingUp className="text-green-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Sustainability Progress</h3>
                <p className="text-sm text-gray-700">
                  CO₂ emissions down 15% YTD. Green score improved from 7.8 to 8.4, exceeding sustainability targets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
