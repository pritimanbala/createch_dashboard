// Utility functions for scalable calculations based on quantity

export function calculateScalableCost(baseCost: number, quantity: number, scaleFactor: number = 0.85): number {
  // Cost scales non-linearly: more quantities = better per-unit cost
  // scaleFactor < 1 means economies of scale
  const scaledCost = baseCost * Math.pow(quantity, scaleFactor);
  return Math.round(scaledCost);
}

export function calculateScalableTime(baseTimeHours: number, quantity: number, parallelize: number = 0.7): number {
  // Time scales with some parallelization
  // parallelize factor indicates how much we can parallelize operations
  const scaledTime = baseTimeHours * Math.pow(quantity, parallelize);
  return Math.round(scaledTime * 10) / 10;
}

export function calculateScalableResources(baseCount: number, quantity: number): number {
  // Resources scale more linearly than cost but less than linearly
  // Minimum increment based on quantity tiers
  if (quantity <= 1) return baseCount;
  if (quantity <= 3) return baseCount + 1;
  if (quantity <= 6) return baseCount + 2;
  if (quantity <= 10) return baseCount + 3;
  return Math.ceil(baseCount + quantity * 0.3);
}

export function calculateTransportationCost(
  baseTransportCost: number,
  quantity: number,
  distanceKm: number,
  transportType: string = 'road'
): number {
  // Transportation cost varies by type and distance
  let typeMultiplier = 1;
  switch (transportType.toLowerCase()) {
    case 'road':
      typeMultiplier = 1;
      break;
    case 'viaduct':
      typeMultiplier = 1.3; // 30% more expensive for viaduct
      break;
    case 'rail':
      typeMultiplier = 0.8; // 20% cheaper for rail
      break;
    case 'sea':
      typeMultiplier = 0.5; // 50% cheaper for sea
      break;
  }

  // Distance factor: ₹10-15 per km for road, adjusted for other types
  const distanceCost = distanceKm * 12 * typeMultiplier;
  
  // Base cost scales with quantity
  const scaledBaseCost = calculateScalableCost(baseTransportCost, quantity, 0.8);
  
  return Math.round(scaledBaseCost + distanceCost);
}

export function calculateEnergyCost(
  baseEnergy: number,
  quantity: number,
  curingMethod: string = 'ambient'
): number {
  // Energy cost based on curing method
  let methodMultiplier = 1;
  if (curingMethod === 'steam') {
    methodMultiplier = 1.5; // 50% more for steam curing
  } else if (curingMethod === 'chamber') {
    methodMultiplier = 1.2; // 20% more for chamber curing
  }

  return Math.round(baseEnergy * quantity * methodMultiplier);
}

export function calculateCO2Emissions(
  baseCO2: number,
  quantity: number,
  strategy: 'cheapest' | 'fastest' | 'greenest' = 'cheapest'
): number {
  // CO2 emissions vary by strategy
  let strategyMultiplier = 1;
  if (strategy === 'greenest') {
    strategyMultiplier = 0.65; // 35% reduction
  } else if (strategy === 'fastest') {
    strategyMultiplier = 1.4; // 40% increase
  }

  return Math.round(baseCO2 * quantity * strategyMultiplier);
}
