import { useLocation, useNavigate } from "react-router";
import { Clock, DollarSign, Leaf, Zap, TrendingDown, AlertTriangle, CheckCircle2, ThermometerSun, Droplets, ArrowLeft, Download, Sparkles, BarChart3, Target } from "lucide-react";

export function SimulationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};

  const strategies = [
    {
      id: "fastest",
      title: "FASTEST - Steam Accelerated",
      cycleTime: "10.2h",
      cost: "₹12,450",
      co2: "38kg",
      energy: "156 kWh",
      risk: "Low",
      deadline: "Safe",
      color: "border-blue-500 bg-blue-50",
      badge: "bg-blue-500",
      icon: Zap,
      details: [
        "Peak 72°C × 3.5h",
        "2h delay + 2h ramp",
        "1.5h cool down",
        "Energy +12%"
      ],
      recommendation: "Best for urgent deadlines. Achieves target strength in minimum time with controlled energy consumption."
    },
    {
      id: "cheapest",
      title: "CHEAPEST - Optimized Steam",
      cycleTime: "12.8h",
      cost: "₹8,450",
      co2: "28kg",
      energy: "98 kWh",
      risk: "Medium",
      deadline: "Safe",
      color: "border-green-500 bg-green-50",
      badge: "bg-green-500",
      icon: DollarSign,
      details: [
        "Peak 65°C × 4h",
        "3h delay + 1.5h ramp",
        "2h cool down",
        "Energy -18%"
      ],
      recommendation: "Maximizes cost efficiency while maintaining safety. Ideal for projects with flexible timelines."
    },
    {
      id: "eco",
      title: "ECO-FRIENDLY - Hybrid Curing",
      cycleTime: "15.2h",
      cost: "₹9,200",
      co2: "18kg",
      energy: "68 kWh",
      risk: "Medium",
      deadline: "Marginal",
      color: "border-emerald-500 bg-emerald-50",
      badge: "bg-emerald-500",
      icon: Leaf,
      details: [
        "Ambient + low steam",
        "4h delay + slow ramp",
        "Natural cool down",
        "Energy -32%"
      ],
      recommendation: "Best for sustainability goals. Combines ambient curing with minimal steam assistance."
    },
    {
      id: "balanced",
      title: "BALANCED - AI Recommended",
      cycleTime: "11.5h",
      cost: "₹10,200",
      co2: "26kg",
      energy: "112 kWh",
      risk: "Low",
      deadline: "Safe",
      color: "border-purple-500 bg-purple-50",
      badge: "bg-purple-500",
      icon: Target,
      details: [
        "Peak 68°C × 3.8h",
        "2.5h delay + 2h ramp",
        "1.8h cool down",
        "Energy -6%"
      ],
      recommendation: "Optimal balance across all parameters. Selected based on current weather and yard capacity constraints."
    }
  ];

  const timeline = [
    { stage: "Casting", duration: "1.0h", color: "bg-gray-400" },
    { stage: "Initial Cure", duration: "2.5h", color: "bg-blue-300" },
    { stage: "Steam Cure", duration: "5.8h", color: "bg-orange-400" },
    { stage: "Cooling", duration: "1.8h", color: "bg-blue-200" },
    { stage: "De-moulding", duration: "0.4h", color: "bg-green-400" }
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/add-process')}
          className="mb-4 flex items-center gap-2 text-[#005EB8] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Form
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="text-[#FDB813]" size={32} />
              AI Simulation & Optimization Results
            </h1>
            <p className="text-gray-600 mt-2">
              Analyzed {formData.elementType || "Pier Cap"} with {formData.mixDesign || "M50"} mix design
              {formData.deadline && ` • Deadline: ${new Date(formData.deadline).toLocaleDateString()}`}
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Weather Impact */}
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <ThermometerSun className="text-orange-600" size={24} />
          Weather Impact Analysis
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-orange-600" size={18} />
              <span className="font-semibold text-gray-900">High Humidity Detected</span>
            </div>
            <p className="text-sm text-gray-700">Current: 68% RH - May slow ambient curing by 2-3 hours</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-blue-600" size={18} />
              <span className="font-semibold text-gray-900">Rain Expected Tomorrow</span>
            </div>
            <p className="text-sm text-gray-700">40% chance at 2 PM - Outdoor curing not recommended</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="text-green-600" size={18} />
              <span className="font-semibold text-gray-900">Temperature Ideal</span>
            </div>
            <p className="text-sm text-gray-700">32°C - Perfect for accelerated steam curing</p>
          </div>
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-orange-200">
          <p className="text-sm text-gray-800">
            <strong>AI Recommendation:</strong> Chamber curing temperature increased by 5°C to compensate for high ambient humidity. Cycle time adjusted accordingly.
          </p>
        </div>
      </div>

      {/* Recommended Strategies */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Curing Strategies</h2>
        <div className="grid grid-cols-2 gap-6">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            return (
              <div key={strategy.id} className={`${strategy.color} border-2 rounded-xl p-6 shadow-lg`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${strategy.badge} p-3 rounded-lg text-white`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{strategy.title}</h3>
                      {strategy.id === "balanced" && (
                        <span className="inline-block mt-1 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                          AI RECOMMENDED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Cycle Time</div>
                    <div className="text-xl font-bold text-gray-900">{strategy.cycleTime}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Cost</div>
                    <div className="text-xl font-bold text-gray-900">{strategy.cost}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">CO₂</div>
                    <div className="text-xl font-bold text-gray-900">{strategy.co2}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Energy</div>
                    <div className="text-xl font-bold text-gray-900">{strategy.energy}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {strategy.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-800">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-gray-700">Risk:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    strategy.risk === "Low" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                  }`}>
                    {strategy.risk}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 ml-2">Deadline:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    strategy.deadline === "Safe" ? "bg-green-200 text-green-800" : "bg-orange-200 text-orange-800"
                  }`}>
                    {strategy.deadline}
                  </span>
                </div>

                <div className="bg-white/70 rounded-lg p-3 mb-4 border border-gray-300">
                  <p className="text-sm text-gray-800 italic">"{strategy.recommendation}"</p>
                </div>

                <button className={`w-full ${strategy.badge} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}>
                  Select This Strategy
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scenario Comparison Table */}
      <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={24} />
          Scenario Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-bold text-gray-900">Strategy</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Cycle Time</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Cost</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">CO₂</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Energy</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Risk</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Deadline Safe</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy, idx) => (
                <tr key={idx} className={`border-t ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{strategy.title.split(' - ')[1]}</td>
                  <td className="px-4 py-3">{strategy.cycleTime}</td>
                  <td className="px-4 py-3">{strategy.cost}</td>
                  <td className="px-4 py-3">
                    <span className={parseInt(strategy.co2) < 25 ? 'text-green-700 font-semibold' : 'text-gray-900'}>
                      {strategy.co2}
                    </span>
                  </td>
                  <td className="px-4 py-3">{strategy.energy}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      strategy.risk === "Low" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                    }`}>
                      {strategy.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      strategy.deadline === "Safe" ? "bg-green-200 text-green-800" : "bg-orange-200 text-orange-800"
                    }`}>
                      {strategy.deadline === "Safe" ? "Yes" : "Marginal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Timeline */}
      <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Production Timeline Visualization</h2>
        <p className="text-sm text-gray-600 mb-4">Based on Balanced Strategy (AI Recommended)</p>

        <div className="space-y-3">
          {timeline.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-32 font-semibold text-gray-900">{stage.stage}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                <div
                  className={`${stage.color} h-full rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                  style={{ width: `${(parseFloat(stage.duration) / 11.5) * 100}%` }}
                >
                  {stage.duration}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <strong>Total Cycle Time:</strong> 11.5 hours (Casting → Ready for De-moulding)
        </div>
      </div>

      {/* Sustainability Insights */}
      <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Leaf className="text-green-600" size={28} />
          Sustainability Insights
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Estimated CO₂</div>
            <div className="text-3xl font-bold text-gray-900">26kg</div>
            <div className="text-xs text-green-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingDown size={14} />
              18% below baseline
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Cement Reduction</div>
            <div className="text-3xl font-bold text-gray-900">12%</div>
            <div className="text-xs text-gray-600 mt-1">via SCM substitution</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Energy Usage</div>
            <div className="text-3xl font-bold text-gray-900">112</div>
            <div className="text-xs text-gray-600 mt-1">kWh per unit</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Water Savings</div>
            <div className="text-3xl font-bold text-gray-900">8%</div>
            <div className="text-xs text-green-700 font-semibold mt-1">vs standard process</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} />
            Green Compliant
          </div>
          <div className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold flex items-center gap-2">
            <AlertTriangle size={18} />
            Moderate Energy Usage
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border-2 border-purple-400">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          AI Explanation - Why This Recommendation?
        </h2>
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <p className="text-gray-800 leading-relaxed">
            <strong>Steam curing with balanced parameters was selected</strong> because the deadline requires completing 2 production cycles per day.
            Current weather conditions (32°C ambient, 68% humidity) favor accelerated curing with controlled chamber temperature.
            The AI analyzed 127 similar Pier Cap productions with M50 mix and determined that a peak temperature of 68°C held for 3.8 hours
            achieves optimal strength development while staying within your budget constraint of ₹{formData.budgetLimit || '15,000'} per unit.
            The sustainability priority of {formData.sustainabilityPriority || 50}% was factored into minimizing CO₂ emissions without
            compromising deadline safety.
          </p>
        </div>
      </div>
    </div>
  );
}
