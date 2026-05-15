import { useState, useEffect } from "react";
import { Settings, DollarSign, Package, Truck, Zap, Droplets, Leaf, Save, RotateCcw } from "lucide-react";

interface PriceConfig {
  materials: {
    cement: number;
    slag: number;
    flyAsh: number;
    water: number;
    superplasticizer: number;
    coarseAggregate: number;
    fineAggregate: number;
  };
  energy: {
    steam: number;
    electricity: number;
  };
  transportation: {
    baseCost: number;
    perKmCost: number;
    perUnitCost: number;
  };
  labor: {
    skilled: number;
    unskilled: number;
    supervisor: number;
  };
  equipment: {
    mould: number;
    chamber: number;
    crane: number;
  };
  overhead: {
    percentage: number;
    fixedCost: number;
  };
}

const defaultPrices: PriceConfig = {
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
};

export function PriceSettings() {
  const [prices, setPrices] = useState<PriceConfig>(defaultPrices);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const savedPrices = localStorage.getItem('priceSettings');
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    }
  }, []);

  const handlePriceChange = (category: keyof PriceConfig, field: string, value: number) => {
    setPrices(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('priceSettings', JSON.stringify(prices));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      alert('✅ Price settings saved successfully!');
    } catch (error) {
      alert('❌ Failed to save price settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all prices to default values?')) {
      setPrices(defaultPrices);
      setHasChanges(true);
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#005EB8] rounded-lg flex items-center justify-center">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Price Configuration</h1>
              <p className="text-gray-600 mt-1">Manage base prices and cost parameters for all materials and services</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw size={18} />
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-[#005EB8] text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Materials Prices */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Materials (₹/ton)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cement</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.materials.cement}
                  onChange={(e) => handlePriceChange('materials', 'cement', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per ton</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Slag</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.materials.slag}
                  onChange={(e) => handlePriceChange('materials', 'slag', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per ton</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fly Ash</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.materials.flyAsh}
                  onChange={(e) => handlePriceChange('materials', 'flyAsh', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per ton</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Water</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.materials.water}
                  onChange={(e) => handlePriceChange('materials', 'water', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per kL</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Superplasticizer</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.materials.superplasticizer}
                  onChange={(e) => handlePriceChange('materials', 'superplasticizer', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per kg</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Coarse Aggregate</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.materials.coarseAggregate}
                  onChange={(e) => handlePriceChange('materials', 'coarseAggregate', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per ton</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fine Aggregate</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.materials.fineAggregate}
                  onChange={(e) => handlePriceChange('materials', 'fineAggregate', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per ton</span>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Prices */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Zap className="text-yellow-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Energy Costs</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Steam</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.energy.steam}
                  onChange={(e) => handlePriceChange('energy', 'steam', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per hour</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Electricity</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.energy.electricity}
                  onChange={(e) => handlePriceChange('energy', 'electricity', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per kWh</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="text-green-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Transportation</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Base Cost</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    value={prices.transportation.baseCost}
                    onChange={(e) => handlePriceChange('transportation', 'baseCost', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <span className="text-sm text-gray-500">per trip</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Per KM Cost</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    value={prices.transportation.perKmCost}
                    onChange={(e) => handlePriceChange('transportation', 'perKmCost', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <span className="text-sm text-gray-500">per km</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Per Unit Cost</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    value={prices.transportation.perUnitCost}
                    onChange={(e) => handlePriceChange('transportation', 'perUnitCost', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <span className="text-sm text-gray-500">per unit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Labor & Equipment */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Labor Costs (₹/day)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Skilled Worker</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.labor.skilled}
                  onChange={(e) => handlePriceChange('labor', 'skilled', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per day</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Unskilled Worker</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.labor.unskilled}
                  onChange={(e) => handlePriceChange('labor', 'unskilled', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per day</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Supervisor</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={prices.labor.supervisor}
                  onChange={(e) => handlePriceChange('labor', 'supervisor', Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                />
                <span className="text-sm text-gray-500">per day</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="text-orange-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Equipment (₹)</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mould</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    value={prices.equipment.mould}
                    onChange={(e) => handlePriceChange('equipment', 'mould', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <span className="text-sm text-gray-500">per unit</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Curing Chamber</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    value={prices.equipment.chamber}
                    onChange={(e) => handlePriceChange('equipment', 'chamber', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <span className="text-sm text-gray-500">per unit</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Crane</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    value={prices.equipment.crane}
                    onChange={(e) => handlePriceChange('equipment', 'crane', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  />
                  <span className="text-sm text-gray-500">per unit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overhead Settings */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Leaf className="text-red-600" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Overhead Costs</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Overhead Percentage</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={prices.overhead.percentage}
                onChange={(e) => handlePriceChange('overhead', 'percentage', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                min="0"
                max="100"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Applied to total material and labor costs</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fixed Daily Overhead</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">₹</span>
              <input
                type="number"
                value={prices.overhead.fixedCost}
                onChange={(e) => handlePriceChange('overhead', 'fixedCost', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              />
              <span className="text-sm text-gray-500">per day</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Fixed daily operational costs</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Price Configuration Summary</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-gray-600">Last Updated</div>
            <div className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-gray-600">Total Categories</div>
            <div className="font-semibold text-gray-900">6</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-gray-600">Configurable Items</div>
            <div className="font-semibold text-gray-900">18</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-gray-600">Status</div>
            <div className={`font-semibold ${hasChanges ? 'text-orange-600' : 'text-green-600'}`}>
              {hasChanges ? 'Unsaved Changes' : 'Up to Date'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
