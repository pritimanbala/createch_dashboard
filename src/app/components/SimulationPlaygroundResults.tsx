import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, BarChart3, Package, Truck, Zap, Leaf, DollarSign } from "lucide-react";

interface ResultData {
  volumePerUnitM3: number;
  totalVolumeM3: number;
  materialBreakdown: {
    cement: { kg: number; cost: number };
    slag: { kg: number; cost: number };
    flyAsh: { kg: number; cost: number };
    water: { kg: number; cost: number };
    superplasticizer: { kg: number; cost: number };
    aggregate: { kg: number; cost: number };
  };
  materialCost: number;
  curingCost: number;
  energyCost: number;
  mouldCost: number;
  craneCost: number;
  labourCost: number;
  productionCost: number;
  transportCost: number;
  totalCost: number;
  costPerUnit: number;
  energyKwh: number;
  co2Kg: number;
  cycleTimeHours: number;
  mouldsRequired: number;
  cranesRequired: number;
  strength: {
    estimatedStrength: number;
    regressionValue: number;
    rSquared: number;
    lowerBound: number;
    upperBound: number;
    waterCementitiousRatio: number;
    confidence: string;
  };
  materialName: string;
  projectLocation: string;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  quantity: number;
  cement: number;
  slag: number;
  flyAsh: number;
  water: number;
  superplasticizer: number;
  coarse: number;
  fine: number;
  curingMethod: string;
  curingAge: number;
  curingTemp: number;
  holdTimeHours: number;
  castingTimeMinutes: number;
  chambers: number;
  transportFrom: string;
  transportDistanceKm: number;
  transportType: string;
}

export function SimulationPlaygroundResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as ResultData;

  if (!result) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h1>
          <button
            onClick={() => navigate('/simulation-playground')}
            className="px-6 py-3 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Simulation Playground
          </button>
        </div>
      </div>
    );
  }

  const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
  const number = (value: number, digits = 1) => value.toLocaleString("en-IN", { maximumFractionDigits: digits });

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/simulation-playground')}
          className="mb-4 flex items-center gap-2 text-[#005EB8] hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Simulation Playground
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="text-[#005EB8]" size={32} />
              Simulation Results
            </h1>
            <p className="text-gray-600 mt-2">
              Analysis for {result.quantity} units of {result.materialName}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-blue-600" size={20} />
            <span className="text-sm font-semibold text-gray-700">Estimated Strength</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{result.strength.regressionValue} MPa</div>
          <div className="text-xs text-gray-600">
            Fit (R2): {result.strength.rSquared.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-sm font-semibold text-gray-700">Total Cost</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{money(result.totalCost)}</div>
          <div className="text-xs text-gray-600">{money(result.costPerUnit)} per unit</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-orange-600" size={20} />
            <span className="text-sm font-semibold text-gray-700">Cycle Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{result.cycleTimeHours} hr</div>
          <div className="text-xs text-gray-600">Casting plus curing</div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="text-emerald-600" size={20} />
            <span className="text-sm font-semibold text-gray-700">CO₂ Emissions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{number(result.co2Kg)} kg</div>
          <div className="text-xs text-gray-600">{result.energyKwh} kWh energy</div>
        </div>
      </div>

      {/* Material Quantities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={20} />
          Material Quantities Required
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Raw Materials</h3>
            <div className="space-y-2">
              {Object.entries(result.materialBreakdown).map(([key, item]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b text-sm">
                  <span className="capitalize text-gray-600">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{number(item.kg)} kg</span>
                    <span className="text-gray-500 ml-2">({money(item.cost)})</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between py-2 text-sm font-bold">
                <span>Total Materials</span>
                <div className="text-right">
                  <span>{number(Object.values(result.materialBreakdown).reduce((sum, item) => sum + item.kg, 0))} kg</span>
                  <span className="text-gray-500 ml-2">({money(result.materialCost)})</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resource Requirements</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Total Volume</span>
                <span className="font-semibold text-gray-900">{number(result.totalVolumeM3)} m³</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Volume per Unit</span>
                <span className="font-semibold text-gray-900">{number(result.volumePerUnitM3)} m³</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Moulds Required</span>
                <span className="font-semibold text-gray-900">{result.mouldsRequired}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Cranes Required</span>
                <span className="font-semibold text-gray-900">{result.cranesRequired}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Energy Consumption</span>
                <span className="font-semibold text-gray-900">{result.energyKwh} kWh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign size={20} />
          Cost Breakdown
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Production Costs</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Raw Materials</span>
                <span className="font-semibold text-gray-900">{money(result.materialCost)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Curing Cost</span>
                <span className="font-semibold text-gray-900">{money(result.curingCost)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Energy Cost</span>
                <span className="font-semibold text-gray-900">{money(result.energyCost)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Mould Cost</span>
                <span className="font-semibold text-gray-900">{money(result.mouldCost)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Crane Cost</span>
                <span className="font-semibold text-gray-900">{money(result.craneCost)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Labor Cost</span>
                <span className="font-semibold text-gray-900">{money(result.labourCost)}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm font-bold">
                <span>Total Production</span>
                <span>{money(result.productionCost)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Transportation & Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b text-sm">
                <span className="text-gray-600">Transportation Cost</span>
                <span className="font-semibold text-gray-900">{money(result.transportCost)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b-2 border-gray-300 text-sm font-bold">
                <span className="text-lg">Total Project Cost</span>
                <span className="text-lg text-[#005EB8]">{money(result.totalCost)}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-600">Cost per Unit</span>
                <span className="font-semibold text-gray-900">{money(result.costPerUnit)}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-600">Cost per m³</span>
                <span className="font-semibold text-gray-900">{money(result.totalCost / result.totalVolumeM3)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strength Analysis */}
      <div className="rounded-xl p-6 border mb-6 bg-blue-50 border-blue-300">
        <h3 className="font-bold text-gray-900 mb-2">Strength Estimate</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {/* <div>
            <span className="text-gray-600">Estimated Strength: </span>
            <span className="font-semibold">{result.strength.estimatedStrength} MPa</span>
          </div> */}
          <div>
            <span className="text-gray-600">Water-Binder Ratio: </span>
            <span className="font-semibold">{result.strength.waterCementitiousRatio}</span>
          </div>
          {/* <div>
            <span className="text-gray-600">Confidence Level: </span>
            <span className="font-semibold">{result.strength.confidence}</span>
          </div> */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/simulation-playground')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
        >
          Modify Configuration
        </button>
        <button
          onClick={() => {
            // Transform the data to match what SimulationResults expects
            const transformedData = {
              ...result,
              coarseAggregate: result.coarse,
              fineAggregate: result.fine,
            };
            navigate('/simulation-results', { state: transformedData });
          }}
          className="px-6 py-3 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          View Strategies & Add to Timeline
        </button>
      </div>
    </div>
  );
}
