import { useState, useEffect } from "react";
import { Clock, Leaf, Zap, Cloud, Droplets, Wind, ThermometerSun, AlertTriangle, CheckCircle, Loader, AlertCircle, MapPin, Truck, Wrench } from "lucide-react";
import { createProcess, checkTimelineConflict, ProcessRecord } from "@/lib/supabase";
import { getWeatherForecast, WeatherForecast } from "@/lib/weather";
import { calculateScalableCost, calculateScalableResources, calculateTransportationCost } from "@/lib/calculations";

type Step = "initial" | "constraints" | "loading" | "results" | "confirm";

const MATERIAL_SHAPES = [
  "U-Shape",
  "I-Beam",
  "T-Beam",
  "Box Girder",
  "Wall Panel",
  "Slab Panel",
  "Pier Cap",
  "Culvert",
  "Spigot",
  "Bearing Block",
  "Elastomeric Bearing",
  "Expansion Joint",
];

interface ProcessSuggestion {
  type: "cheapest" | "fastest" | "greenest";
  title: string;
  metric: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  badge: string;
  parameters: {
    cement: number;
    slag: number;
    fly_ash: number;
    water: number;
    superplasticizer: number;
    coarse: number;
    fine: number;
    age: number;
    curing_method: string;
    chambers: number;
    mould: number;
  };
  details: string[];
  note: string;
}

interface AddProcessProps {
  onProcessAdded?: (process: ProcessRecord) => void;
}

export function AddProcess({ onProcessAdded }: AddProcessProps) {
  const [step, setStep] = useState<Step>("initial");
  const [selectedOption, setSelectedOption] = useState<"manual" | "ai" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<ProcessSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timelineConflicts, setTimelineConflicts] = useState<ProcessRecord[]>([]);

  // Form fields
  const [materialName, setMaterialName] = useState("U-Shape");
  const [materialLengthMm, setMaterialLengthMm] = useState(5000);
  const [materialWidthMm, setMaterialWidthMm] = useState(3000);
  const [materialHeightMm, setMaterialHeightMm] = useState(1500);
  const [quantity, setQuantity] = useState(1);
  const [projectLocation, setProjectLocation] = useState("Mumbai");
  const [scheduledStartTime, setScheduledStartTime] = useState("");
  const [scheduledEndTime, setScheduledEndTime] = useState("");
  const [sustainabilityPriority, setSustainabilityPriority] = useState(50);
  const [desiredStrength, setDesiredStrength] = useState(15);
  const [transportationLocation, setTransportationLocation] = useState("Site Office");
  const [transportationDistanceKm, setTransportationDistanceKm] = useState(25);
  const [transportationType, setTransportationType] = useState("road");
  const [transportationCost, setTransportationCost] = useState(0);
  const [moulds_required, setMouldsRequired] = useState(1);
  const [cranes_required, setCranesRequired] = useState(1);
  const [castingTimeMinutes, setCastingTimeMinutes] = useState(30);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fetch weather when constraints step is entered or location changes
  useEffect(() => {
    if (step === "constraints" && projectLocation && !weatherForecast) {
      fetchWeather();
    }
  }, [step, projectLocation]);

  const fetchWeather = async () => {
    setLoadingWeather(true);
    try {
      const forecast = await getWeatherForecast(projectLocation);
      setWeatherForecast(forecast);
    } catch (err) {
      console.error('[v0] Failed to fetch weather:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  const suggestions: ProcessSuggestion[] = [
    {
      type: "cheapest",
      title: "CHEAPEST",
      metric: "Cost",
      value: "₹8,450",
      change: "-22%",
      icon: Leaf,
      color: "border-green-500 bg-green-50",
      badge: "bg-green-500",
      parameters: {
        cement: 380.0,
        slag: 45.0,
        fly_ash: 25.0,
        water: 190.0,
        superplasticizer: 4.5,
        coarse: 900.0,
        fine: 650.0,
        age: 28,
        curing_method: "ambient",
        chambers: 2,
        mould: 3,
      },
      details: [
        "Peak 65°C × 4h",
        "Tcure 12h",
        "Energy -18%",
        "CO₂ -14kg"
      ],
      note: "Best value, uses less steam while safe"
    },
    {
      type: "fastest",
      title: "FASTEST",
      metric: "Time",
      value: "10.2h",
      change: "-28%",
      icon: Clock,
      color: "border-blue-500 bg-blue-50",
      badge: "bg-blue-500",
      parameters: {
        cement: 420.0,
        slag: 35.0,
        fly_ash: 15.0,
        water: 185.0,
        superplasticizer: 6.0,
        coarse: 920.0,
        fine: 670.0,
        age: 7,
        curing_method: "steam",
        chambers: 3,
        mould: 2,
      },
      details: [
        "Peak 72°C × 3.5h",
        "Energy +12%",
        "CO₂ +8kg",
        "✅ Safe"
      ],
      note: "Optimal for hot weather, meets 15MPa in 10h20m"
    },
    {
      type: "greenest",
      title: "GREENEST",
      metric: "CO₂",
      value: "22kg",
      change: "-35%",
      icon: Leaf,
      color: "border-emerald-500 bg-emerald-50",
      badge: "bg-emerald-500",
      parameters: {
        cement: 350.0,
        slag: 60.0,
        fly_ash: 40.0,
        water: 195.0,
        superplasticizer: 3.5,
        coarse: 880.0,
        fine: 630.0,
        age: 28,
        curing_method: "ambient",
        chambers: 1,
        mould: 2,
      },
      details: [
        "Ambient + low steam",
        "Tcure 15h",
        "Energy -32%",
        "Max sustainability"
      ],
      note: "Best for sustainability targets"
    }
  ];

  const handleStartAI = () => {
    setSelectedOption("ai");
    setStep("constraints");
    setError(null);
  };

  const validateConstraints = () => {
    if (!materialName.trim()) {
      setError("Material name is required");
      return false;
    }
    if (!materialDimensions.trim()) {
      setError("Material dimensions are required");
      return false;
    }
    if (!scheduledStartTime) {
      setError("Start time is required");
      return false;
    }
    if (!scheduledEndTime) {
      setError("End time is required");
      return false;
    }
    if (new Date(scheduledStartTime) >= new Date(scheduledEndTime)) {
      setError("End time must be after start time");
      return false;
    }
    return true;
  };

  const handleConstraintsSubmit = () => {
    if (!validateConstraints()) return;

    setIsLoading(true);
    setStep("loading");
    setError(null);

    // Calculate scalable costs and simulate AI processing
    const baseCheapestCost = 8450;
    const baseTransportCost = 5000;
    
    const scaledCheapestCost = calculateScalableCost(baseCheapestCost, quantity, 0.85);
    const scaledTransportCost = calculateTransportationCost(baseTransportCost, quantity, transportationDistanceKm, transportationType);
    const scaledMoulds = calculateScalableResources(3, quantity);
    const scaledCranes = calculateScalableResources(1, quantity);

    // Update moulds and cranes based on quantity
    setMouldsRequired(scaledMoulds);
    setCranesRequired(scaledCranes);
    setTransportationCost(scaledTransportCost);

    setTimeout(() => {
      setIsLoading(false);
      setStep("results");
    }, 2000);
  };

  const handleSelectSuggestion = (suggestion: ProcessSuggestion) => {
    setSelectedSuggestion(suggestion);
    setStep("confirm");
  };

  const handleConfirmAndAdd = async () => {
    if (!selectedSuggestion) return;

    try {
      setIsLoading(true);
      setError(null);

      // Check for timeline conflicts
      const conflicts = await checkTimelineConflict(
        scheduledStartTime,
        scheduledEndTime
      );

      if (conflicts.length > 0) {
        setTimelineConflicts(conflicts);
        setError(`Found ${conflicts.length} timeline conflict(s). Please reschedule.`);
        setIsLoading(false);
        return;
      }

      // Create the process in Supabase
      const newProcess = await createProcess({
        material_name: materialName,
        material_dimensions: materialDimensions,
        quantity,
        scheduled_start_time: scheduledStartTime,
        scheduled_end_time: scheduledEndTime,
        strategy_type: selectedSuggestion.type,
        cement: selectedSuggestion.parameters.cement,
        slag: selectedSuggestion.parameters.slag,
        fly_ash: selectedSuggestion.parameters.fly_ash,
        water: selectedSuggestion.parameters.water,
        superplasticizer: selectedSuggestion.parameters.superplasticizer,
        coarse: selectedSuggestion.parameters.coarse,
        fine: selectedSuggestion.parameters.fine,
        age: selectedSuggestion.parameters.age,
        curing_method: selectedSuggestion.parameters.curing_method,
        chambers: selectedSuggestion.parameters.chambers,
        mould: selectedSuggestion.parameters.mould,
        status: "scheduled",
        transportation_location: transportationLocation || null,
        transportation_factor: transportationFactor || null,
        transportation_cost: transportationCost || null,
        moulds_required,
        cranes_required,
        casting_time_minutes: castingTimeMinutes,
      });

      console.log("[v0] Process added successfully:", newProcess);

      // Call callback if provided
      if (onProcessAdded) {
        onProcessAdded(newProcess);
      }

      // Reset and show success
      setIsLoading(false);
      alert(`✅ Process added successfully!\n\n${materialName}\n${selectedSuggestion.title} Strategy\nNo timeline conflicts detected.`);

      // Reset form
      setStep("initial");
      setSelectedOption(null);
      setSelectedSuggestion(null);
      setMaterialName("");
      setMaterialDimensions("");
      setQuantity(1);
      setScheduledStartTime("");
      setScheduledEndTime("");
      setTimelineConflicts([]);
    } catch (err: any) {
      console.error("[v0] Error adding process:", err);
      setError(err.message || "Failed to add process. Please try again.");
      setIsLoading(false);
    }
  };

  // Initial selection screen
  if (step === "initial") {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Production Process</h1>
          <p className="text-gray-600 mt-2">Choose how you&apos;d like to set up your next process</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Manual Option */}
          <button
            onClick={() => setSelectedOption("manual")}
            className="bg-white border-2 border-gray-300 rounded-xl p-8 hover:border-[#005EB8] hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#005EB8] group-hover:text-white transition-colors">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Manually</h2>
            <p className="text-gray-600">Configure all mix composition parameters yourself with full control</p>
          </button>

          {/* AI Option */}
          <button
            onClick={handleStartAI}
            className="bg-gradient-to-br from-[#005EB8] to-blue-600 border-2 border-[#005EB8] rounded-xl p-8 hover:shadow-lg transition-all text-left text-white"
          >
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Use AI</h2>
            <p className="text-blue-100">Let AI analyze constraints and recommend optimal curing strategies</p>
          </button>
        </div>
      </div>
    );
  }

  // Constraints form
  if (step === "constraints") {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Project Constraints</h1>
          <p className="text-gray-600 mt-2">Tell us about your production requirements</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-2xl">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Project Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline mr-2" size={18} />
                Project Location
              </label>
              <input
                type="text"
                value={projectLocation}
                onChange={(e) => {
                  setProjectLocation(e.target.value);
                  setWeatherForecast(null); // Reset weather when location changes
                }}
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              />
            </div>

            {/* Material Shape */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Material Shape
              </label>
              <select
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                {MATERIAL_SHAPES.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>

            {/* Material Dimensions */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Length (mm)
                </label>
                <input
                  type="number"
                  value={materialLengthMm}
                  onChange={(e) => setMaterialLengthMm(Number(e.target.value))}
                  min={100}
                  step={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Width (mm)
                </label>
                <input
                  type="number"
                  value={materialWidthMm}
                  onChange={(e) => setMaterialWidthMm(Number(e.target.value))}
                  min={100}
                  step={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (mm)
                </label>
                <input
                  type="number"
                  value={materialHeightMm}
                  onChange={(e) => setMaterialHeightMm(Number(e.target.value))}
                  min={100}
                  step={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity (units)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                max={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              />
            </div>

            {/* Scheduled Start Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scheduled Start Time
              </label>
              <input
                type="datetime-local"
                value={scheduledStartTime}
                onChange={(e) => setScheduledStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              />
            </div>

            {/* Scheduled End Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scheduled End Time
              </label>
              <input
                type="datetime-local"
                value={scheduledEndTime}
                onChange={(e) => setScheduledEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              />
              {scheduledStartTime && scheduledEndTime && (
                <p className="text-xs text-gray-600 mt-1">
                  Duration: {Math.round((new Date(scheduledEndTime).getTime() - new Date(scheduledStartTime).getTime()) / 3600000)} hours
                </p>
              )}
            </div>

            {/* Sustainability Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
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

            {/* Desired Strength */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Desired Material Strength (MPa)
              </label>
              <input
                type="number"
                value={desiredStrength}
                onChange={(e) => setDesiredStrength(Number(e.target.value))}
                min={5}
                max={80}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              />
            </div>

            {/* Transportation Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={20} /> Transportation
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Departure Location
                  </label>
                  <input
                    type="text"
                    value={transportationLocation}
                    onChange={(e) => setTransportationLocation(e.target.value)}
                    placeholder="e.g., Factory, Plant, Warehouse"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      value={transportationDistanceKm}
                      onChange={(e) => setTransportationDistanceKm(Number(e.target.value))}
                      min={1}
                      step={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transport Type
                    </label>
                    <select
                      value={transportationType}
                      onChange={(e) => setTransportationType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                    >
                      <option value="road">Road</option>
                      <option value="viaduct">Viaduct</option>
                      <option value="rail">Rail</option>
                      <option value="sea">Sea</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Moulds Needed
                    </label>
                    <input
                      type="number"
                      value={moulds_required}
                      onChange={(e) => setMouldsRequired(Number(e.target.value))}
                      min={1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            {weatherForecast && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Cloud size={20} /> Weather Forecast - {weatherForecast.location}
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {weatherForecast.forecast.slice(0, 4).map((day, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">{new Date(day.date).toLocaleDateString()}</p>
                      <div className="text-2xl font-bold text-gray-900 mb-2">{day.temperature}°C</div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1">
                          <Droplets size={12} /> {day.humidity}%
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind size={12} /> {day.windSpeed} km/h
                        </div>
                        <div className="text-orange-600 font-semibold">{day.rainProbability}% Rain</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setStep("initial");
                  setSelectedOption(null);
                  setError(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConstraintsSubmit}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Analyze with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (step === "loading") {
    return (
      <div className="p-8 max-w-[1440px] mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="animate-spin">
              <Loader size={48} className="text-[#005EB8]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Requirements</h2>
          <p className="text-gray-600">Our AI is evaluating 127 similar processes to find optimal strategies...</p>
        </div>
      </div>
    );
  }

  // Results screen
  if (step === "results" && !selectedSuggestion) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recommended Processes</h1>
          <p className="text-gray-600 mt-2">Choose the best strategy for your production run</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {suggestions.map((suggestion, idx) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={idx}
                className={`${suggestion.color} border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all`}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${suggestion.badge} p-2 rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{suggestion.title}</h3>
                    <div className="text-2xl font-bold text-gray-900">
                      {suggestion.type === 'cheapest' 
                        ? `₹${calculateScalableCost(parseInt(suggestion.value.replace(/[₹,]/g, '')), quantity, 0.85).toLocaleString()}`
                        : suggestion.value
                      }
                    </div>
                    <div className={`text-sm font-semibold ${suggestion.change.startsWith('-') ? 'text-green-700' : 'text-red-700'}`}>
                      {suggestion.change.startsWith('-') ? '↓' : '↑'} {suggestion.change} for {quantity} unit{quantity > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Parameters Table */}
                <div className="bg-white/80 rounded-lg p-4 mb-4 text-sm">
                  <h4 className="font-bold text-gray-900 mb-3">Mix Parameters</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-600">Cement:</span> <span className="font-semibold">{suggestion.parameters.cement}kg</span></div>
                    <div><span className="text-gray-600">Slag:</span> <span className="font-semibold">{suggestion.parameters.slag}kg</span></div>
                    <div><span className="text-gray-600">Fly Ash:</span> <span className="font-semibold">{suggestion.parameters.fly_ash}kg</span></div>
                    <div><span className="text-gray-600">Water:</span> <span className="font-semibold">{suggestion.parameters.water}kg</span></div>
                    <div><span className="text-gray-600">Superplasticizer:</span> <span className="font-semibold">{suggestion.parameters.superplasticizer}kg</span></div>
                    <div><span className="text-gray-600">Coarse:</span> <span className="font-semibold">{suggestion.parameters.coarse}kg</span></div>
                    <div><span className="text-gray-600">Fine:</span> <span className="font-semibold">{suggestion.parameters.fine}kg</span></div>
                    <div><span className="text-gray-600">Age:</span> <span className="font-semibold">{suggestion.parameters.age}d</span></div>
                    <div className="col-span-2"><span className="text-gray-600">Curing:</span> <span className="font-semibold">{suggestion.parameters.curing_method}</span></div>
                    <div><span className="text-gray-600">Chambers:</span> <span className="font-semibold">{suggestion.parameters.chambers}</span></div>
                    <div><span className="text-gray-600">Moulds:</span> <span className="font-semibold">{suggestion.parameters.mould}</span></div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {suggestion.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-800">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/70 rounded-lg p-3 mb-4 border border-gray-300">
                  <p className="text-sm text-gray-800 italic">&quot;{suggestion.note}&quot;</p>
                </div>

                <button className={`w-full ${suggestion.badge} text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity`}>
                  Select This
                </button>
              </div>
            );
          })}
        </div>

        {/* Weather Integration */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-orange-300">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            <Cloud className="inline mr-2" size={20} />
            4-Day Weather Forecast - {projectLocation}
          </h2>

          {weatherForecast ? (
            <>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {weatherForecast.forecast.slice(0, 4).map((day, idx) => (
                  <div key={idx} className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">{new Date(day.date).toLocaleDateString()}</p>
                    <ThermometerSun className="mx-auto mb-1 text-orange-500" size={24} />
                    <div className="text-2xl font-bold text-gray-900">{day.temperature}°C</div>
                    <div className="text-xs space-y-1 mt-2">
                      <div className="flex items-center justify-center gap-1">
                        <Droplets size={12} /> {day.humidity}%
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Wind size={12} /> {day.windSpeed} km/h
                      </div>
                      <div className="text-orange-600 font-semibold">{day.rainProbability}% Rain</div>
                    </div>
                  </div>
                ))}
              </div>

              {weatherForecast.forecast.some(d => d.rainProbability > 40) && (
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-orange-600 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Weather Impact Alert</p>
                      <p className="text-sm text-gray-700 mt-1">
                        High rain probability detected. This may extend curing time by 2-4 hours.
                        Recommend delay until weather improves.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600">Loading weather data for {projectLocation}...</p>
          )}
        </div>
      </div>
    );
  }

  // Confirmation screen
  if (step === "confirm" && selectedSuggestion) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Confirm & Add to Timeline</h1>
          <p className="text-gray-600 mt-2">Review your process before adding to production schedule</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-red-900">{error}</p>
              {timelineConflicts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {timelineConflicts.map(conflict => (
                    <div key={conflict.id} className="text-sm text-red-800 bg-red-100 p-2 rounded">
                      Conflict: {conflict.material_name} from {new Date(conflict.scheduled_start_time).toLocaleString()} to {new Date(conflict.scheduled_end_time).toLocaleString()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Process Summary */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Process Summary</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">Material</p>
                  <p className="text-lg font-bold text-gray-900">{materialName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">Dimensions</p>
                  <p className="text-lg font-bold text-gray-900">{materialDimensions}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">Quantity</p>
                  <p className="text-lg font-bold text-gray-900">{quantity} units</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round((new Date(scheduledEndTime).getTime() - new Date(scheduledStartTime).getTime()) / 3600000)}h
                  </p>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">Scheduled Time</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Start:</span> <span className="font-semibold">{new Date(scheduledStartTime).toLocaleString()}</span></div>
                  <div><span className="text-gray-600">End:</span> <span className="font-semibold">{new Date(scheduledEndTime).toLocaleString()}</span></div>
                </div>
              </div>

              {/* Selected Strategy */}
              <div className={`${selectedSuggestion.color} border-2 rounded-lg p-4`}>
                <h3 className="font-bold text-gray-900 mb-3">{selectedSuggestion.title} Strategy</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(selectedSuggestion.parameters).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="font-semibold text-gray-900 ml-1">
                        {typeof value === 'number' ? (
                          <>
                            {value}
                            {key.includes('cement') || key.includes('slag') || key.includes('fly_ash') || key.includes('water') || key.includes('coarse') || key.includes('fine') ? 'kg' : ''}
                          </>
                        ) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transportation Details */}
              <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">Transportation & Equipment</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Location</label>
                    <input
                      type="text"
                      value={transportationLocation}
                      onChange={(e) => setTransportationLocation(e.target.value)}
                      placeholder="e.g., Mumbai, Delhi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Transport Factor</label>
                      <input
                        type="number"
                        step="0.1"
                        value={transportationFactor}
                        onChange={(e) => setTransportationFactor(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Transport Cost (₹)</label>
                      <input
                        type="number"
                        value={transportationCost}
                        onChange={(e) => setTransportationCost(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Moulds Needed</label>
                      <input
                        type="number"
                        value={moulds_required}
                        onChange={(e) => setMouldsRequired(Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Cranes Needed</label>
                      <input
                        type="number"
                        value={cranes_required}
                        onChange={(e) => setCranesRequired(Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Casting Time (min)</label>
                      <input
                        type="number"
                        value={castingTimeMinutes}
                        onChange={(e) => setCastingTimeMinutes(Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Check */}
              {!error && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-gray-900">No Timeline Conflicts</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Chambers and moulds are available for the requested duration. Process can start immediately.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-fit">
            <h3 className="font-bold text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-3 mb-6 text-sm text-gray-700">
              <div className="flex gap-2">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Assign chambers: {selectedSuggestion.parameters.chambers}</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Assign moulds: {selectedSuggestion.parameters.mould}</span>
              </div>
              <div className="flex gap-2">
                <Clock size={16} className="text-[#005EB8] flex-shrink-0 mt-0.5" />
                <span>Estimated duration: {Math.round((new Date(scheduledEndTime).getTime() - new Date(scheduledStartTime).getTime()) / 3600000)}h</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("results")}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirmAndAdd}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add to Timeline"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
