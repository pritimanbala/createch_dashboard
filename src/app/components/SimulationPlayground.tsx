import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  BarChart3,
  FlaskConical,
  Loader2,
  Package,
  Truck,
} from "lucide-react";
import { estimateConcreteStrength, type StrengthEstimate } from "@/lib/strengthEstimator";

const MATERIAL_SHAPES = [
  "U-Shape",
  "I-Beam",
  "T-Beam",
  "Box Girder",
  "Wall Panel",
  "Slab Panel",
  "Pier Cap",
  "Culvert",
];

const shapeVolumeFactor: Record<string, number> = {
  "U-Shape": 0.58,
  "I-Beam": 0.46,
  "T-Beam": 0.55,
  "Box Girder": 0.62,
  "Wall Panel": 0.88,
  "Slab Panel": 0.92,
  "Pier Cap": 0.8,
  Culvert: 0.68,
};

const transportMultiplier: Record<string, number> = {
  road: 1,
  rail: 0.78,
  sea: 0.55,
  viaduct: 1.25,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const roundToTenth = (value: number) => Math.round(value * 10) / 10;

function calibratePlaygroundStrength(
  estimate: StrengthEstimate,
  input: {
    cement: number;
    slag: number;
    flyAsh: number;
    water: number;
    superplasticizer: number;
    curingAge: number;
    curingMethod: string;
    curingTemp: number;
  }
) {
  const binderKg = Math.max(input.cement + input.slag + input.flyAsh, 1);
  const waterBinderRatio = input.water / binderKg;
  const scmRatio = (input.slag + input.flyAsh) / binderKg;

  const ratioScore = clamp((0.45 - waterBinderRatio) * 14, -2.4, 2.4);
  const binderScore = clamp((binderKg - 380) * 0.012, -1.2, 1.2);
  const ageScore = clamp((Math.log(input.curingAge + 1) / Math.log(29) - 0.75) * 4, -1.2, 1.6);
  const curingScore = input.curingMethod === "steam" ? 1 : input.curingMethod === "chamber" ? 0.45 : -0.55;
  const temperatureScore =
    input.curingMethod === "ambient" ? 0 : clamp((input.curingTemp - 55) * 0.04, -0.4, 0.8);
  const admixtureScore = clamp((input.superplasticizer / binderKg) * 45, 0, 0.9);
  const scmScore = clamp((0.22 - scmRatio) * 2.2, -0.6, 0.5);

  const estimatedStrength = roundToTenth(
    clamp(
      15.6 +
        ratioScore +
        binderScore +
        ageScore +
        curingScore +
        temperatureScore +
        admixtureScore +
        scmScore,
      15,
      20
    )
  );
  const regressionValue = roundToTenth(clamp(estimatedStrength + (estimate.rSquared - 0.82) * 3, 15, 20));
  const tolerance = Math.max(1.2, estimatedStrength * 0.08);

  return {
    ...estimate,
    estimatedStrength,
    regressionValue,
    lowerBound: roundToTenth(estimatedStrength - tolerance),
    upperBound: roundToTenth(estimatedStrength + tolerance),
  };
}

function NumberField({
  label,
  value,
  onChange,
  min,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 mb-2">{label}</span>
      <div className="flex items-center rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[#005EB8]">
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          min={min}
          step={step}
          className="w-full rounded-lg px-3 py-2 outline-none"
        />
        {suffix && <span className="pr-3 text-sm font-semibold text-gray-500">{suffix}</span>}
      </div>
    </label>
  );
}

export function SimulationPlayground() {
  const navigate = useNavigate();

  const [materialName, setMaterialName] = useState("U-Shape");
  const [projectLocation, setProjectLocation] = useState("Mumbai");
  const [lengthMm, setLengthMm] = useState(5000);
  const [widthMm, setWidthMm] = useState(3000);
  const [heightMm, setHeightMm] = useState(1500);
  const [quantity, setQuantity] = useState(12);

  const [cement, setCement] = useState(390);
  const [slag, setSlag] = useState(45);
  const [flyAsh, setFlyAsh] = useState(25);
  const [water, setWater] = useState(185);
  const [superplasticizer, setSuperplasticizer] = useState(4.5);
  const [coarse, setCoarse] = useState(900);
  const [fine, setFine] = useState(650);

  const [curingMethod, setCuringMethod] = useState("steam");
  const [curingAge, setCuringAge] = useState(14);
  const [curingTemp, setCuringTemp] = useState(65);
  const [holdTimeHours, setHoldTimeHours] = useState(4);
  const [castingTimeMinutes, setCastingTimeMinutes] = useState(30);
  const [chambers, setChambers] = useState(2);

  const [isCalculating, setIsCalculating] = useState(false);
  const [transportFrom, setTransportFrom] = useState("Precast Yard");
  const [transportDistanceKm, setTransportDistanceKm] = useState(25);
  const [transportType, setTransportType] = useState("road");
  const [hasCalculated, setHasCalculated] = useState(false);

  // Load prices from localStorage or use defaults
  const [prices, setPrices] = useState({
    materials: {
      cement: 350,
      slag: 280,
      flyAsh: 250,
      water: 2,
      superplasticizer: 45,
      coarseAggregate: 25,
      fineAggregate: 30,
    },
    energy: {
      steam: 150,
      electricity: 8,
    },
    transportation: {
      baseCost: 5000,
      perKmCost: 25,
      perUnitCost: 100,
    },
    labor: {
      skilled: 800,
      unskilled: 500,
      supervisor: 1200,
    },
    equipment: {
      mould: 50000,
      chamber: 200000,
      crane: 150000,
    },
    overhead: {
      percentage: 15,
      fixedCost: 10000,
    },
  });

  useEffect(() => {
    const savedPrices = localStorage.getItem('priceSettings');
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    }
  }, []);

  const result = useMemo(() => {
    const rawVolumeM3 = (lengthMm * widthMm * heightMm) / 1_000_000_000;
    const volumeFactor = shapeVolumeFactor[materialName] ?? 0.75;
    const volumePerUnitM3 = rawVolumeM3 * volumeFactor;
    const totalVolumeM3 = volumePerUnitM3 * quantity;

    const cementKg = cement * totalVolumeM3;
    const slagKg = slag * totalVolumeM3;
    const flyAshKg = flyAsh * totalVolumeM3;
    const waterKg = water * totalVolumeM3;
    const superplasticizerKg = superplasticizer * totalVolumeM3;
    const coarseKg = coarse * totalVolumeM3;
    const fineKg = fine * totalVolumeM3;

    // Calculate costs using price settings
    const cementCost = cementKg * (prices.materials.cement / 1000); // Convert from per ton to per kg
    const slagCost = slagKg * (prices.materials.slag / 1000);
    const flyAshCost = flyAshKg * (prices.materials.flyAsh / 1000);
    const waterCost = waterKg * (prices.materials.water / 1000); // Convert from per kL to per kg (assuming 1kL = 1000kg)
    const admixtureCost = superplasticizerKg * prices.materials.superplasticizer;
    const aggregateCost = (coarseKg + fineKg) * ((prices.materials.coarseAggregate + prices.materials.fineAggregate) / 2 / 1000);
    const materialCost = cementCost + slagCost + flyAshCost + waterCost + admixtureCost + aggregateCost;

    const totalCastingMinutes = castingTimeMinutes * quantity;
    const totalCastingHours = totalCastingMinutes / 60;
    const mouldsRequired = Math.max(1, Math.ceil(totalCastingMinutes / Math.max(holdTimeHours * 60, 60)));
    const cranesRequired = Math.max(1, Math.ceil(quantity / 200));
    const cycleTimeHours = Math.round((totalCastingHours + holdTimeHours + 1.5) * 10) / 10;

    const curingMultiplier = curingMethod === "steam" ? 1.45 : curingMethod === "chamber" ? 1.18 : 0.45;
    const energyKwh = Math.round(quantity * holdTimeHours * curingMultiplier * (1 + Math.max(curingTemp - 30, 0) / 100));
    const energyCost = energyKwh * prices.energy.electricity;
    const curingCost = holdTimeHours * chambers * prices.energy.steam + energyCost;
    // Simplified equipment and labor costs (these would need more detailed calculation in real scenario)
    const mouldCost = mouldsRequired * 1000; // Simplified daily rental cost
    const craneCost = cranesRequired * cycleTimeHours * 500; // Simplified hourly cost
    const labourCost = quantity * 300; // Simplified labor cost per unit
    const productionCost = curingCost + mouldCost + craneCost + labourCost;

    const transportCost =
      prices.transportation.baseCost +
      transportDistanceKm * prices.transportation.perKmCost * quantity * (transportMultiplier[transportType] ?? 1) +
      quantity * prices.transportation.perUnitCost;

    const totalCost = materialCost + productionCost + transportCost;
    const costPerUnit = totalCost / Math.max(quantity, 1);
    const co2Kg = Math.round((cementKg * 0.82 + slagKg * 0.07 + flyAshKg * 0.03 + energyKwh * 0.7 + transportDistanceKm * quantity * 0.42) * 10) / 10;

    const strength = calibratePlaygroundStrength(
      estimateConcreteStrength({
        cement,
        slag,
        flyAsh,
        water,
        superplasticizer,
        coarse,
        fine,
        ageDays: curingAge,
        curingMethod,
        ambientTemperature: curingMethod === "ambient" ? 32 : curingTemp,
        humidity: 65,
      }),
      {
        cement,
        slag,
        flyAsh,
        water,
        superplasticizer,
        curingAge,
        curingMethod,
        curingTemp,
      }
    );

    return {
      volumePerUnitM3,
      totalVolumeM3,
      materialBreakdown: {
        cement: { kg: cementKg, cost: cementCost },
        slag: { kg: slagKg, cost: slagCost },
        flyAsh: { kg: flyAshKg, cost: flyAshCost },
        water: { kg: waterKg, cost: waterCost },
        superplasticizer: { kg: superplasticizerKg, cost: admixtureCost },
        aggregate: { kg: coarseKg + fineKg, cost: aggregateCost },
      },
      materialCost,
      curingCost,
      energyCost,
      mouldCost,
      craneCost,
      labourCost,
      productionCost,
      transportCost,
      totalCost,
      costPerUnit,
      energyKwh,
      co2Kg,
      cycleTimeHours,
      mouldsRequired,
      cranesRequired,
      strength,
      materialName,
      projectLocation,
      lengthMm,
      widthMm,
      heightMm,
      quantity,
      cement,
      slag,
      flyAsh,
      water,
      superplasticizer,
      coarse,
      fine,
      curingMethod,
      curingAge,
      curingTemp,
      holdTimeHours,
      castingTimeMinutes,
      chambers,
      transportFrom,
      transportDistanceKm,
      transportType,
    };
  }, [
    // Material properties
    cement, slag, flyAsh, water, superplasticizer, coarse, fine,
    // Project constraints
    lengthMm, widthMm, heightMm, quantity, materialName, projectLocation,
    // Curing constraints
    curingMethod, curingAge, curingTemp, holdTimeHours, castingTimeMinutes, chambers,
    // Transportation constraints
    transportFrom, transportDistanceKm, transportType,
    // Price settings
    prices,
  ]);

  const money = (value: number) => `Rs ${Math.round(value).toLocaleString("en-IN")}`;
  const number = (value: number, digits = 1) => value.toLocaleString("en-IN", { maximumFractionDigits: digits });

  
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FlaskConical className="text-[#005EB8]" size={32} />
          Simulation Lab
        </h1>
        <p className="text-gray-600 mt-2">
          Enter project, mix, curing, material cost, and transport constraints to calculate strength, cost, resources, and timeline readiness.
        </p>
      </div>

      <div className="space-y-6">
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} />
              Project Constraints
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">Element Type</span>
                <select value={materialName} onChange={(event) => setMaterialName(event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]">
                  {MATERIAL_SHAPES.map((shape) => (
                    <option key={shape} value={shape}>{shape}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">Project Location</span>
                <input value={projectLocation} onChange={(event) => setProjectLocation(event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]" />
              </label>
              <NumberField label="Length" value={lengthMm} onChange={setLengthMm} min={100} step={100} suffix="mm" />
              <NumberField label="Width" value={widthMm} onChange={setWidthMm} min={100} step={100} suffix="mm" />
              <NumberField label="Height" value={heightMm} onChange={setHeightMm} min={100} step={100} suffix="mm" />
              <NumberField label="Quantity" value={quantity} onChange={setQuantity} min={1} suffix="units" />
              <NumberField label="Casting Time" value={castingTimeMinutes} onChange={setCastingTimeMinutes} min={5} step={5} suffix="min/unit" />
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FlaskConical size={20} />
              Mix Design Constraints
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <NumberField label="Cement" value={cement} onChange={setCement} min={100} step={5} suffix="kg/m3" />
              <NumberField label="Slag" value={slag} onChange={setSlag} min={0} step={5} suffix="kg/m3" />
              <NumberField label="Fly Ash" value={flyAsh} onChange={setFlyAsh} min={0} step={5} suffix="kg/m3" />
              <NumberField label="Water" value={water} onChange={setWater} min={60} step={5} suffix="kg/m3" />
              <NumberField label="Superplasticizer" value={superplasticizer} onChange={setSuperplasticizer} min={0} step={0.5} suffix="kg/m3" />
              <NumberField label="Coarse Aggregate" value={coarse} onChange={setCoarse} min={200} step={10} suffix="kg/m3" />
              <NumberField label="Fine Aggregate" value={fine} onChange={setFine} min={200} step={10} suffix="kg/m3" />
              <NumberField label="Curing Age" value={curingAge} onChange={setCuringAge} min={1} suffix="days" />
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">Curing Method</span>
                <select value={curingMethod} onChange={(event) => setCuringMethod(event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]">
                  <option value="ambient">Ambient</option>
                  <option value="chamber">Chamber</option>
                  <option value="steam">Steam</option>
                </select>
              </label>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={20} />
              Transportation Constraints
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">Dispatch From</span>
                <input value={transportFrom} onChange={(event) => setTransportFrom(event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]" />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">Transport Type</span>
                <select value={transportType} onChange={(event) => setTransportType(event.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]">
                  <option value="road">Road</option>
                  <option value="rail">Rail</option>
                  <option value="sea">Sea</option>
                  <option value="viaduct">Viaduct</option>
                </select>
              </label>
              <NumberField label="Distance" value={transportDistanceKm} onChange={setTransportDistanceKm} min={0} step={5} suffix="km" />
            </div>
          </section>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ready to Calculate</h2>
              <p className="text-sm text-gray-600 mt-1">
                Calculate the strength, cost, materials, transport, resources, and emissions for this configuration.
              </p>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold">Estimated Strength (Regression)</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{number(result.strength.estimatedStrength)} MPa</div>
                <div className="text-xs text-blue-800 mt-1">
                  Regressor: {number(result.strength.regressionValue)} MPa | Fit (R2): {result.strength.rSquared.toFixed(2)}
                </div>
              </div>
            </div>
            <button
              onClick={async () => {
                setIsCalculating(true);
                
                // Simulate calculation time
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Navigate to results page with calculation data
                navigate('/simulation-playground-results', { state: result });
                setIsCalculating(false);
              }}
              disabled={isCalculating}
              className="px-8 py-3 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Calculating...
                </>
              ) : (
                <>
                  <BarChart3 size={18} />
                  Calculate Parameters
                </>
              )}
            </button>
          </div>
      </div>
    </div>
  );
}
