import { useState } from "react";
import { Sliders, TrendingUp, TrendingDown, DollarSign, Clock, Leaf, Zap, BarChart3, Sparkles } from "lucide-react";

export function SimulationPlayground() {
  const [curingTemp, setCuringTemp] = useState(65);
  const [mixRatio, setMixRatio] = useState(0.42);
  const [accelerator, setAccelerator] = useState(true);
  const [automationLevel, setAutomationLevel] = useState(70);
  const [holdTime, setHoldTime] = useState(4);
  const [transportDistance, setTransportDistance] = useState(25);
  const [quantity, setQuantity] = useState(100);

  // Base values for comparison
  const baseCost = 10000;
  const baseTime = 12;
  const baseCO2 = 30;
  const baseStrength = 15;
  const baseTransportCost = 3000; // Base transport at 0 km
  const baseCement = 380;
  const baseFlyAsh = 40;

  // Material costs (per kg)
  const cementCost = 6;
  const flyAshCost = 2;
  const costPerKm = 120; // per km per unit
  
  // Calculate cement and fly ash based on mix ratio
  const cementContent = baseCement * (1 - (mixRatio - 0.42) * 0.5); // Lower ratio = less cement
  const flyAshContent = baseFlyAsh + (mixRatio - 0.42) * 100; // Higher ratio = more fly ash
  
  // Calculate transport cost: base + distance-based + quantity-based
  const distanceCost = Math.round(costPerKm * transportDistance);
  const quantityCost = Math.round((quantity / 100) * baseTransportCost * 0.5);
  const transportCost = Math.round(baseTransportCost + distanceCost + quantityCost);
  
  // Calculate material costs
  const cementTotalCost = Math.round((cementContent * quantity * cementCost) / 1000);
  const flyAshTotalCost = Math.round((flyAshContent * quantity * flyAshCost) / 1000);
  const mixProductionCost = Math.round(baseCost + (curingTemp - 65) * 100 + (accelerator ? 500 : 0) + (automationLevel * 20));
  const totalCost = Math.round(mixProductionCost + transportCost + cementTotalCost + flyAshTotalCost);
  
  const cycleTime = (baseTime - (curingTemp - 65) * 0.15 - (accelerator ? 1.5 : 0) + (holdTime - 4) * 0.5).toFixed(1);
  const co2 = Math.round(baseCO2 + (curingTemp - 65) * 0.5 + (mixRatio - 0.42) * 100 + (transportDistance * 0.1) + (quantity * 0.01));
  
  // Strength calculation includes cement and fly ash content
  const cementStrength = cementContent / baseCement; // Cement factor (1.0 = baseline)
  const flyAshStrength = 1 + (flyAshContent / baseFlyAsh - 1) * 0.3; // Fly ash reduces strength by 30%
  const strength = (baseStrength + (curingTemp - 65) * 0.2 + (accelerator ? 2 : 0) + (holdTime - 4) * 0.3) * cementStrength * flyAshStrength;
  
  const energyUsage = Math.round(100 + (curingTemp - 65) * 5 + (holdTime - 4) * 8);

  const getCostChange = () => {
    const change = ((totalCost - (baseCost + baseTransportCost)) / (baseCost + baseTransportCost) * 100).toFixed(1);
    return parseFloat(change);
  };

  const getTimeChange = () => {
    const change = ((parseFloat(cycleTime) - baseTime) / baseTime * 100).toFixed(1);
    return parseFloat(change);
  };

  const getCO2Change = () => {
    const change = ((co2 - baseCO2) / baseCO2 * 100).toFixed(1);
    return parseFloat(change);
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Sliders className="text-[#005EB8]" size={32} />
          Simulation Playground
        </h1>
        <p className="text-gray-600 mt-2">
          Manually tweak parameters and instantly see the impact on cost, time, strength, and carbon emissions
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sliders size={20} />
              Adjust Parameters
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Curing Temperature: {curingTemp}°C
                </label>
                <input
                  type="range"
                  min="50"
                  max="80"
                  value={curingTemp}
                  onChange={(e) => setCuringTemp(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50°C (Slow)</span>
                  <span>80°C (Fast)</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                  Higher temperature = faster curing but more energy & CO₂
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Water/Cement Ratio: {mixRatio}
                </label>
                <input
                  type="range"
                  min="0.35"
                  max="0.55"
                  step="0.01"
                  value={mixRatio}
                  onChange={(e) => setMixRatio(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.35 (Strong)</span>
                  <span>0.55 (Weak)</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                  Lower w/c ratio = higher strength but harder to work with
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hold Time: {holdTime}h
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={holdTime}
                  onChange={(e) => setHoldTime(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2h (Quick)</span>
                  <span>8h (Safe)</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                  Longer hold time = better strength but more cycle time
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transportation Distance: {transportDistance} km
                </label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={transportDistance}
                  onChange={(e) => setTransportDistance(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 km (Local)</span>
                  <span>200 km (Long)</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                  Transport cost = ₹{transportCost.toLocaleString()} (distance + quantity dependent)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Quantity: {quantity} units
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 units</span>
                  <span>1000 units</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                  Larger orders benefit from economies of scale in material & transport costs
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Automation Level: {automationLevel}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={automationLevel}
                  onChange={(e) => setAutomationLevel(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Manual</span>
                  <span>Fully Automated</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                  Higher automation = more upfront cost but consistent quality
                </p>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                <input
                  type="checkbox"
                  checked={accelerator}
                  onChange={(e) => setAccelerator(e.target.checked)}
                  className="w-5 h-5"
                  id="accelerator"
                />
                <label htmlFor="accelerator" className="font-semibold text-gray-900 cursor-pointer">
                  Use Chemical Accelerator
                </label>
              </div>
              {accelerator && (
                <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                  Accelerator adds ₹500 but reduces cycle time by 1.5h and boosts early strength
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#005EB8] to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Sparkles size={20} />
              AI Tip
            </h3>
            <p className="text-sm text-blue-100">
              For M50 mix with {curingTemp}°C curing: Consider {curingTemp > 70 ? 'reducing' : 'increasing'} temperature slightly to balance strength gain and energy cost.
              Current setup is {co2 < 30 ? 'eco-friendly' : 'energy-intensive'}.
            </p>
          </div>
        </div>

        {/* Right Column - Real-time Results */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Instant Impact Analysis
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-green-700" size={24} />
                  <span className="text-sm font-semibold text-gray-700">Total Project Cost</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">₹{totalCost.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Mix & Production:</span>
                    <span className="font-semibold">₹{mixProductionCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-2 text-gray-500 text-xs">
                    <span>Base cost + distance +{transportDistance}km</span>
                    <span className="font-semibold">₹{(baseTransportCost + distanceCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pl-2 text-gray-500 text-xs">
                    <span>Quantity factor ({quantity} units)</span>
                    <span className="font-semibold">+₹{quantityCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Total Transport:</span>
                    <span className="font-semibold text-orange-600">₹{transportCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cement ({cementContent.toFixed(0)}kg/unit):</span>
                    <span className="font-semibold">₹{cementTotalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fly Ash ({flyAshContent.toFixed(0)}kg/unit):</span>
                    <span className="font-semibold">₹{flyAshTotalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-blue-700" size={24} />
                  <span className="text-sm font-semibold text-gray-700">Cycle Time</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{cycleTime}h</div>
                <div className={`text-sm font-semibold mt-1 flex items-center gap-1 ${
                  getTimeChange() < 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {getTimeChange() < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                  {Math.abs(getTimeChange()).toFixed(1)}% vs baseline ({baseTime}h)
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  {getTimeChange() < 0 ? `Time Saved: ${(baseTime - parseFloat(cycleTime)).toFixed(1)}h` : `Time Added: ${(parseFloat(cycleTime) - baseTime).toFixed(1)}h`}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border-2 border-emerald-300">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="text-emerald-700" size={24} />
                  <span className="text-sm font-semibold text-gray-700">CO₂ Emissions</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{co2}kg</div>
                <div className={`text-sm font-semibold mt-1 flex items-center gap-1 ${
                  getCO2Change() < 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {getCO2Change() < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                  {Math.abs(getCO2Change()).toFixed(1)}% vs baseline
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-300">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-orange-700" size={24} />
                  <span className="text-sm font-semibold text-gray-700">Energy Usage</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{energyUsage}</div>
                <div className="text-xs text-gray-600 mt-1">kWh per unit</div>
              </div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-purple-700" size={24} />
                <span className="text-sm font-semibold text-gray-700">Strength Gain</span>
              </div>
              <div className="text-4xl font-bold text-gray-900">{strength.toFixed(2)} MPa</div>
              <div className="text-sm text-gray-600 mt-1">at demoulding (24h)</div>

              <div className="mt-4 bg-white rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cement Factor:</span>
                  <span className="font-semibold">{cementStrength.toFixed(2)}x ({cementContent.toFixed(0)}kg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fly Ash Impact:</span>
                  <span className="font-semibold text-orange-600">{flyAshStrength.toFixed(2)}x ({flyAshContent.toFixed(0)}kg)</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm">
                  <span className="text-gray-700">Progress to target (28 MPa):</span>
                  <span className="font-bold text-gray-900">{((parseFloat(strength.toFixed(2)) / 28) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full"
                    style={{ width: `${Math.min((parseFloat(strength.toFixed(2)) / 28) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Parameter Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Current Configuration Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Curing Temperature</span>
                <span className="font-semibold text-gray-900">{curingTemp}°C</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Water/Cement Ratio</span>
                <span className="font-semibold text-gray-900">{mixRatio}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Hold Time</span>
                <span className="font-semibold text-gray-900">{holdTime} hours</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Automation Level</span>
                <span className="font-semibold text-gray-900">{automationLevel}%</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Transport Distance</span>
                <span className="font-semibold text-gray-900">{transportDistance} km</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Order Quantity</span>
                <span className="font-semibold text-gray-900">{quantity} units</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Chemical Accelerator</span>
                <span className={`font-semibold ${accelerator ? 'text-green-700' : 'text-gray-500'}`}>
                  {accelerator ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <button className="w-full mt-4 bg-[#005EB8] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Save This Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
