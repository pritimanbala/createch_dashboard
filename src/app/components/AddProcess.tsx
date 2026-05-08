import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, DollarSign, Leaf, Zap, TrendingDown, TrendingUp, Cloud, Droplets, Wind, ThermometerSun, Target, Users, Calendar, AlertTriangle } from "lucide-react";

export function AddProcess() {
  const navigate = useNavigate();
  const [elementType, setElementType] = useState("Pier Cap");
  const [mixDesign, setMixDesign] = useState("M50");
  const [curingMethod, setCuringMethod] = useState("Chamber");
  const [delay, setDelay] = useState(2);
  const [ramp, setRamp] = useState(2);
  const [peak, setPeak] = useState(65);
  const [hold, setHold] = useState(4);
  const [cool, setCool] = useState(2);

  // Project Constraints
  const [deadline, setDeadline] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("15000");
  const [sustainabilityPriority, setSustainabilityPriority] = useState(50);
  const [optimizationPriority, setOptimizationPriority] = useState("Balanced");

  const handleSubmit = () => {
    navigate('/simulation-results', {
      state: {
        elementType,
        mixDesign,
        deadline,
        budgetLimit,
        sustainabilityPriority,
        optimizationPriority
      }
    });
  };

  const suggestions = [
    {
      type: "time",
      title: "MOST TIME EFFICIENT",
      tcure: "10.2h",
      change: "-28%",
      icon: Clock,
      details: [
        "Peak 72°C × 3.5h",
        "Energy +12%",
        "CO₂ +8kg",
        "✅ Safe"
      ],
      note: "Optimal for hot weather, meets 15MPa in 10h20m",
      color: "border-blue-500 bg-blue-50",
      badge: "bg-blue-500"
    },
    {
      type: "cost",
      title: "CHEAPEST",
      cost: "₹8,450",
      change: "-22%",
      icon: DollarSign,
      details: [
        "Peak 65°C × 4h",
        "Tcure 12h",
        "Energy -18%",
        "CO₂ -14kg"
      ],
      note: "Best value, uses less steam while safe",
      color: "border-green-500 bg-green-50",
      badge: "bg-green-500"
    },
    {
      type: "green",
      title: "GREENEST",
      co2: "22kg",
      change: "-35%",
      icon: Leaf,
      details: [
        "Ambient + low steam",
        "Tcure 15h",
        "Energy -32%"
      ],
      note: "Best for sustainability targets",
      color: "border-emerald-500 bg-emerald-50",
      badge: "bg-emerald-500"
    }
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Start New Production Process</h1>
        <p className="text-gray-600 mt-2">Configure element details and let AI optimize your curing strategy</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Step 1: Element & Mix */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Step 1: Element & Mix Design</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Element Type
                </label>
                <select 
                  value={elementType}
                  onChange={(e) => setElementType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                >
                  <option>Pier Cap</option>
                  <option>Wall Panel</option>
                  <option>U-Girder</option>
                  <option>Box Girder</option>
                  <option>T-Beam</option>
                  <option>Slab Panel</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mix Design
                  </label>
                  <select 
                    value={mixDesign}
                    onChange={(e) => setMixDesign(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  >
                    <option>M40</option>
                    <option>M50</option>
                    <option>M60</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity (units)
                  </label>
                  <input 
                    type="number"
                    defaultValue={1}
                    min={1}
                    max={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mix Composition
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Cement (kg)"
                    defaultValue="380"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <input 
                    type="text" 
                    placeholder="w/c ratio"
                    defaultValue="0.42"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <input 
                    type="text" 
                    placeholder="Slag/Flyash (%)"
                    defaultValue="12"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Accelerator</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Strength (MPa)
                  </label>
                  <input 
                    type="number"
                    defaultValue={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weight per unit (kg)
                  </label>
                  <input 
                    type="number"
                    defaultValue={2400}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dimensions (L × W × H in meters)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="number" 
                    placeholder="Length"
                    defaultValue="3.5"
                    step="0.1"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <input 
                    type="number" 
                    placeholder="Width"
                    defaultValue="1.2"
                    step="0.1"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <input 
                    type="number" 
                    placeholder="Height"
                    defaultValue="0.8"
                    step="0.1"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Constraints */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Project Constraints</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline mr-2" size={16} />
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="inline mr-2" size={16} />
                    Budget Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Leaf className="inline mr-2" size={16} />
                  Sustainability Priority: {sustainabilityPriority}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sustainabilityPriority}
                  onChange={(e) => setSustainabilityPriority(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Cost Focus</span>
                  <span>Eco Focus</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Chambers
                  </label>
                  <input
                    type="number"
                    defaultValue={8}
                    max={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max capacity: 8</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="inline mr-2" size={16} />
                    Labor Shifts
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]">
                    <option>1 Shift (8h)</option>
                    <option>2 Shifts (16h)</option>
                    <option>3 Shifts (24h)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Curing Strategy */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Step 2: Curing Strategy (Manual Override)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Curing Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Ambient", "Steam", "Chamber", "Combo"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setCuringMethod(method)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        curingMethod === method
                          ? "bg-[#005EB8] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delay Period: {delay}h
                </label>
                <input 
                  type="range"
                  min="0"
                  max="6"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ramp Rate: {ramp}°C/h
                </label>
                <input 
                  type="range"
                  min="1"
                  max="3"
                  value={ramp}
                  onChange={(e) => setRamp(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Peak Temperature: {peak}°C
                </label>
                <input 
                  type="range"
                  min="50"
                  max="80"
                  value={peak}
                  onChange={(e) => setPeak(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hold Time: {hold}h
                </label>
                <input 
                  type="range"
                  min="2"
                  max="8"
                  value={hold}
                  onChange={(e) => setHold(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cool Down: {cool}°C/h
                </label>
                <input 
                  type="range"
                  min="1"
                  max="5"
                  value={cool}
                  onChange={(e) => setCool(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  RH Target: 80%
                </label>
                <input 
                  type="range"
                  min="70"
                  max="95"
                  defaultValue="80"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - AI Suggestions */}
        <div className="space-y-4">
          {/* Weather Integration Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-orange-300">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              <Cloud className="inline mr-2" size={20} />
              Weather Integration
            </h2>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <ThermometerSun className="mx-auto mb-1 text-orange-500" size={24} />
                <div className="text-2xl font-bold text-gray-900">32°C</div>
                <div className="text-xs text-gray-600">Now</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Droplets className="mx-auto mb-1 text-blue-500" size={24} />
                <div className="text-2xl font-bold text-gray-900">68%</div>
                <div className="text-xs text-gray-600">Humidity</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Wind className="mx-auto mb-1 text-gray-500" size={24} />
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-xs text-gray-600">km/h</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Cloud className="mx-auto mb-1 text-gray-500" size={24} />
                <div className="text-2xl font-bold text-gray-900">30%</div>
                <div className="text-xs text-gray-600">Rain Risk</div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-orange-600 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Weather Impact Alert</p>
                  <p className="text-sm text-gray-700 mt-1">
                    High humidity may delay normal curing by <strong>3.2 hours</strong>.
                    Rain expected tomorrow at 2 PM.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              <strong>7-Day Forecast:</strong> Partly cloudy, temperatures 28-34°C, 40% rain chance on May 10-11
            </div>
          </div>

          {/* Optimization Priority Selector */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-300">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              <Target className="inline mr-2" size={20} />
              Optimization Priority
            </h2>
            <p className="text-sm text-gray-600 mb-4">Choose what matters most for this production run</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "Fastest", icon: Zap, color: "blue", desc: "Minimize cycle time" },
                { id: "Cheapest", icon: DollarSign, color: "green", desc: "Minimize cost" },
                { id: "Eco-Friendly", icon: Leaf, color: "emerald", desc: "Minimize carbon" },
                { id: "Balanced", icon: Target, color: "purple", desc: "Optimize all factors" }
              ].map(({ id, icon: Icon, color, desc }) => {
                const colorMap = {
                  blue: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-600' },
                  green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-600' },
                  emerald: { bg: 'bg-emerald-100', border: 'border-emerald-500', text: 'text-emerald-600' },
                  purple: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-600' }
                };
                const colors = colorMap[color as keyof typeof colorMap];

                return (
                  <button
                    key={id}
                    onClick={() => setOptimizationPriority(id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      optimizationPriority === id
                        ? `${colors.bg} ${colors.border} shadow-md`
                        : "bg-white border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Icon className={`mx-auto mb-2 ${optimizationPriority === id ? colors.text : 'text-gray-500'}`} size={28} />
                    <div className="font-bold text-sm text-gray-900">{id}</div>
                    <div className="text-xs text-gray-600 mt-1">{desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#005EB8] to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-2">🤖 AI Generated Strategies</h2>
            <p className="text-blue-100 text-sm">
              Based on your inputs, we've analyzed 127 similar processes to recommend optimal curing profiles
            </p>
          </div>

          {suggestions.map((suggestion, idx) => {
            const Icon = suggestion.icon;
            return (
              <div key={idx} className={`${suggestion.color} border-2 rounded-xl p-6 shadow-sm`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${suggestion.badge} p-2 rounded-lg text-white`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{suggestion.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {suggestion.type === 'time' && suggestion.tcure}
                          {suggestion.type === 'cost' && suggestion.cost}
                          {suggestion.type === 'green' && suggestion.co2}
                        </span>
                        <span className={`text-sm font-semibold ${
                          suggestion.change.startsWith('-') ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {suggestion.change.startsWith('-') ? <TrendingDown size={14} className="inline" /> : <TrendingUp size={14} className="inline" />}
                          {' '}{suggestion.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {suggestion.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-800">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/70 rounded-lg p-3 mb-4 border border-gray-300">
                  <p className="text-sm text-gray-800 italic">"{suggestion.note}"</p>
                </div>

                <button className={`w-full ${suggestion.badge} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}>
                  Select This Strategy
                </button>
              </div>
            );
          })}

          <button
            onClick={handleSubmit}
            className="w-full bg-[#005EB8] text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            🚀 Run AI Simulation & Get Optimized Results
          </button>
        </div>
      </div>
    </div>
  );
}
