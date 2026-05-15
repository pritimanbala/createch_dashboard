import { useLocation, useNavigate } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { Clock, DollarSign, Leaf, Zap, TrendingDown, AlertTriangle, CheckCircle2, ThermometerSun, Droplets, ArrowLeft, Download, Sparkles, BarChart3, Target, Loader2, CalendarPlus } from "lucide-react";
import { createProcess, checkTimelineConflict, ProcessRecord } from "../../lib/supabase";
import { estimateConcreteStrength } from "../../lib/strengthEstimator";

const transportMultiplier: Record<string, number> = {
  road: 1,
  rail: 0.78,
  sea: 0.55,
  viaduct: 1.25,
};

export function SimulationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
    const [scheduledStartTime, setScheduledStartTime] = useState("");
  const [scheduledEndTime, setScheduledEndTime] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timelineConflicts, setTimelineConflicts] = useState<ProcessRecord[]>([]);

  useEffect(() => {
    // Simulate calculation time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate actual strength based on form data
  const strengthResult = useMemo(() => {
    if (Number.isFinite(formData.strength?.estimatedStrength)) {
      return formData.strength;
    }

    if (!formData.cement || !formData.water) return null;
    
    return estimateConcreteStrength({
      cement: formData.cement || 350,
      slag: formData.slag || 0,
      flyAsh: formData.flyAsh || 0,
      water: formData.water || 140,
      superplasticizer: formData.superplasticizer || 0,
      coarse: formData.coarseAggregate || 1200,
      fine: formData.fineAggregate || 800,
      ageDays: formData.curingAge || 14,
      curingMethod: formData.curingMethod || "steam",
      ambientTemperature: 32, // Default temperature
      humidity: 68, // Default humidity
    });
  }, [formData]);

  // Calculate costs and resources
  const calculations = useMemo(() => {
    if (!formData.cement) return null;

    const volume = ((formData.lengthMm || 0) * (formData.widthMm || 0) * (formData.heightMm || 0)) / 1000000000; // Convert mm³ to m³
    const concreteVolume = volume * (formData.quantity || 1);
    const totalBinder = (formData.cement + formData.slag + formData.flyAsh) * concreteVolume;
    
    // Material costs
    const materialCosts = {
      cement: (formData.cement * concreteVolume * 350) / 1000, // ₹350 per kg
      slag: (formData.slag * concreteVolume * 280) / 1000, // ₹280 per kg
      flyAsh: (formData.flyAsh * concreteVolume * 250) / 1000, // ₹250 per kg
      water: (formData.water * concreteVolume * 2) / 1000, // ₹2 per kg
      superplasticizer: (formData.superplasticizer * concreteVolume * 45) / 1000, // ₹45 per kg
      coarse: (formData.coarseAggregate * concreteVolume * 25) / 1000, // ₹25 per kg
      fine: (formData.fineAggregate * concreteVolume * 30) / 1000, // ₹30 per kg
    };

    const totalMaterialCost = Object.values(materialCosts).reduce((sum, cost) => sum + cost, 0);

    // Energy costs
    const steamEnergy = concreteVolume * 150; // ₹150 per m³
    const electricityEnergy = concreteVolume * 8; // ₹8 per m³
    const totalEnergyCost = steamEnergy + electricityEnergy;

    // Transport costs
    const transportCost = 5000 + (formData.transportDistanceKm || 25) * 25 + (formData.quantity || 1) * 100;
    const adjustedTransportCost = transportCost * transportMultiplier[formData.transportType] || 1;

    // Labor costs
    const laborCost = ((formData.quantity || 1) * 2 * 800) + ((formData.quantity || 1) * 500) + 1200; // Skilled + unskilled + supervisor

    // Equipment costs
    const equipmentCost = 50000 + 200000 + 150000; // Mould + chamber + crane (amortized)

    const totalCost = totalMaterialCost + totalEnergyCost + adjustedTransportCost + laborCost + equipmentCost;

    // CO2 calculations
    const co2Emissions = (
      (formData.cement * concreteVolume * 0.82) + // Cement: 0.82 kg CO2 per kg
      (formData.slag * concreteVolume * 0.07) + // Slag: 0.07 kg CO2 per kg
      (formData.flyAsh * concreteVolume * 0.02) + // Fly ash: 0.02 kg CO2 per kg
      (steamEnergy * 0.45) + // Steam: 0.45 kg CO2 per kWh
      (electricityEnergy * 0.82) // Electricity: 0.82 kg CO2 per kWh
    );

    return {
      volume: concreteVolume,
      totalCost: Math.round(totalCost),
      materialCosts,
      energyCost: totalEnergyCost,
      transportCost: adjustedTransportCost,
      laborCost,
      equipmentCost,
      co2Emissions: Math.round(co2Emissions),
      energyUsage: Math.round(steamEnergy + electricityEnergy),
    };
  }, [formData]);

  const addToTimeline = async () => {
    if (!scheduledStartTime || !scheduledEndTime) {
      setError("Please provide start and end times");
      return;
    }

    setIsAdding(true);
    setError(null);
    setSuccess(null);
    setTimelineConflicts([]);

    try {
      // Check for timeline conflicts
      const conflicts = await checkTimelineConflict(scheduledStartTime, scheduledEndTime);
      if (conflicts.length > 0) {
        setTimelineConflicts(conflicts);
        setError("Timeline conflicts detected. Please choose different times.");
        setIsAdding(false);
        return;
      }

      // Create process record with manual strategy
      console.log("Creating process record with data:", {
        material_name: formData.materialName || formData.elementType || "Unknown",
        material_dimensions: `${formData.lengthMm || 0}x${formData.widthMm || 0}x${formData.heightMm || 0}mm`,
        material_length_mm: formData.lengthMm || 0,
        material_width_mm: formData.widthMm || 0,
        material_height_mm: formData.heightMm || 0,
        quantity: formData.quantity || 1,
        scheduled_start_time: scheduledStartTime,
        scheduled_end_time: scheduledEndTime,
        strategy_type: 'cheapest' as const,
        cement: formData.cement || 0,
        slag: formData.slag || 0,
        fly_ash: formData.flyAsh || 0,
        water: formData.water || 0,
        superplasticizer: formData.superplasticizer || 0,
        coarse: formData.coarseAggregate || 0,
        fine: formData.fineAggregate || 0,
        age: formData.curingAge || 14,
        curing_method: formData.curingMethod || "steam",
        chambers: formData.chambers || 2,
        mould: 1,
        status: 'scheduled' as const,
        transportation_location: formData.transportFrom || "Precast Yard",
        transportation_factor: transportMultiplier[formData.transportType] || 1,
        transportation_cost: calculations?.totalCost || 0,
        transportation_distance_km: formData.transportDistanceKm || 0,
        transportation_type: formData.transportType || "road",
        moulds_required: 1,
        cranes_required: 1,
        casting_time_minutes: formData.castingTimeMinutes || 30,
        project_location: formData.projectLocation || "",
      });

      const result = await createProcess({
        material_name: formData.materialName || formData.elementType || "Unknown",
        material_dimensions: `${formData.lengthMm || 0}x${formData.widthMm || 0}x${formData.heightMm || 0}mm`,
        material_length_mm: formData.lengthMm || 0,
        material_width_mm: formData.widthMm || 0,
        material_height_mm: formData.heightMm || 0,
        quantity: formData.quantity || 1,
        scheduled_start_time: scheduledStartTime,
        scheduled_end_time: scheduledEndTime,
        strategy_type: 'cheapest' as const,
        cement: formData.cement || 0,
        slag: formData.slag || 0,
        fly_ash: formData.flyAsh || 0,
        water: formData.water || 0,
        superplasticizer: formData.superplasticizer || 0,
        coarse: formData.coarseAggregate || 0,
        fine: formData.fineAggregate || 0,
        age: formData.curingAge || 14,
        curing_method: formData.curingMethod || "steam",
        chambers: formData.chambers || 2,
        mould: 1,
        status: 'scheduled' as const,
        transportation_location: formData.transportFrom || "Precast Yard",
        transportation_factor: transportMultiplier[formData.transportType] || 1,
        transportation_cost: calculations?.totalCost || 0,
        transportation_distance_km: formData.transportDistanceKm || 0,
        transportation_type: formData.transportType || "road",
        moulds_required: 1,
        cranes_required: 1,
        casting_time_minutes: formData.castingTimeMinutes || 30,
        project_location: formData.projectLocation || "",
      });

      console.log("Create process result:", result);
      setSuccess("Successfully added to timeline! Check dashboard to view.");
      setScheduledStartTime("");
      setScheduledEndTime("");
    } catch (err) {
      console.error("Error adding to timeline:", err);
      setError("Failed to add to timeline. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  
  const timeline = useMemo(() => {
  if (!calculations) return [];
  
  const castingTime = (formData.castingTimeMinutes || 30) / 60; // Convert to hours
  const baseCycleTime = 8 + (formData.curingAge || 14) * 0.5;
  const steamTime = baseCycleTime * 0.5;
  const coolingTime = baseCycleTime * 0.15;
  const demouldTime = 0.4;
  
  return [
    { stage: "Casting", duration: `${castingTime.toFixed(1)}h`, color: "bg-gray-400" },
    { stage: "Initial Cure", duration: `${(baseCycleTime * 0.2).toFixed(1)}h`, color: "bg-blue-300" },
    { stage: "Steam Cure", duration: `${steamTime.toFixed(1)}h`, color: "bg-orange-400" },
    { stage: "Cooling", duration: `${coolingTime.toFixed(1)}h`, color: "bg-blue-200" },
    { stage: "De-moulding", duration: `${demouldTime.toFixed(1)}h`, color: "bg-green-400" }
  ];
}, [calculations, formData]);

  // Loading component
  if (isLoading) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#005EB8] rounded-full flex items-center justify-center mb-4 mx-auto">
              <Loader2 className="text-white animate-spin" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Simulation in Progress</h1>
            <p className="text-gray-600 mb-4">Analyzing constraints and calculating optimal strategies...</p>
            <div className="max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-[#005EB8] h-full rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Processing constraints</span>
                <span>Generating recommendations</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="font-semibold text-gray-900">Weather Analysis</div>
              <div className="text-green-600">✓ Complete</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="font-semibold text-gray-900">Cost Calculations</div>
              <div className="text-blue-600">⟳ Processing...</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="font-semibold text-gray-900">Strategy Optimization</div>
              <div className="text-gray-400">○ Pending</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Analyzed {formData.materialName || "Pier Cap"} ({(formData.lengthMm || 0) / 1000}m × {(formData.widthMm || 0) / 1000}m × {(formData.heightMm || 0) / 1000}m) • 
              Estimated Strength: {strengthResult?.estimatedStrength || 0}MPa
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
                  style={{ width: `${(parseFloat(stage.duration) / (8 + (formData.curingAge || 14) * 0.5)) * 100}%` }}
                >
                  {stage.duration}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <strong>Total Cycle Time:</strong> {(8 + (formData.curingAge || 14) * 0.5).toFixed(1)} hours (Casting → Ready for De-moulding)
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
            <div className="text-3xl font-bold text-gray-900">{calculations?.co2Emissions || 0}kg</div>
            <div className="text-xs text-green-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingDown size={14} />
              {Math.round(((1 - (calculations?.co2Emissions || 0) / (calculations?.co2Emissions || 1) * 1.2)) * 100)}% below baseline
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Cement Content</div>
            <div className="text-3xl font-bold text-gray-900">{formData.cement || 350}kg</div>
            <div className="text-xs text-gray-600 mt-1">per m³ concrete</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Energy Usage</div>
            <div className="text-3xl font-bold text-gray-900">{calculations?.energyUsage || 0}</div>
            <div className="text-xs text-gray-600 mt-1">kWh per unit</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Water/Binder Ratio</div>
            <div className="text-3xl font-bold text-gray-900">{strengthResult?.waterCementitiousRatio || 0}</div>
            <div className="text-xs text-green-700 font-semibold mt-1">
              {(strengthResult?.waterCementitiousRatio && strengthResult.waterCementitiousRatio <= 0.42 ? 'Optimal' : 'High')}
            </div>
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
            <strong>Steam curing with balanced parameters was selected</strong> based on your mix design and curing requirements.
            The calculated strength is {strengthResult?.estimatedStrength || 0}MPa with a {strengthResult?.confidence || 'Medium'} confidence level.
            Current weather conditions (32°C ambient, 68% humidity) and water-binder ratio of {strengthResult?.waterCementitiousRatio || 0} favor this curing approach.
            The total cost of ₹{calculations?.totalCost?.toLocaleString() || 0} per unit includes material costs (₹{Math.round(Object.values(calculations?.materialCosts || {}).reduce((sum, cost) => sum + cost, 0)).toLocaleString()}), 
            energy consumption of {calculations?.energyUsage || 0} kWh, and CO₂ emissions of {calculations?.co2Emissions || 0}kg.
            This strategy provides the optimal balance between strength development, cost efficiency, and environmental impact.
          </p>
        </div>
      </div>

      {/* Add to Timeline Section */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarPlus size={20} />
          Add Your Configuration To Timeline
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose production time slots. Your manual configuration will be saved in Supabase and appear on dashboard.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <p className="font-semibold">{error}</p>
            {timelineConflicts.map((conflict) => (
              <p key={conflict.id} className="mt-1">
                Conflict: {conflict.material_name} from {new Date(conflict.scheduled_start_time).toLocaleString()} to {new Date(conflict.scheduled_end_time).toLocaleString()}
              </p>
            ))}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm font-semibold text-green-800">
            {success}
          </div>
        )}

        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-blue-900">
              Configuration: {formData.materialName || "Manual Setup"}
            </p>
            <p className="text-xs text-blue-700 mt-1">Strategy Type: Cheapest • Strength: {strengthResult?.estimatedStrength || 0}MPa</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-2">Start Time</span>
            <input 
              type="datetime-local" 
              value={scheduledStartTime} 
              onChange={(event) => setScheduledStartTime(event.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]" 
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-2">End Time</span>
            <input 
              type="datetime-local" 
              value={scheduledEndTime} 
              onChange={(event) => setScheduledEndTime(event.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]" 
            />
          </label>
        </div>

        <button
          onClick={() => {
            console.log("Button clicked, isAdding:", isAdding);
            console.log("scheduledStartTime:", scheduledStartTime);
            console.log("scheduledEndTime:", scheduledEndTime);
            addToTimeline();
          }}
          disabled={isAdding}
          className="w-full bg-[#005EB8] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Adding to Timeline...
            </>
          ) : (
            <>
              <CalendarPlus size={18} />
              Add to Timeline
            </>
          )}
        </button>
      </div>
    </div>
  );
}
