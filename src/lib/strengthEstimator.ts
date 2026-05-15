export interface StrengthEstimateInput {
  cement: number;
  slag: number;
  flyAsh: number;
  water: number;
  superplasticizer: number;
  coarse: number;
  fine: number;
  ageDays: number;
  curingMethod: string;
  desiredStrength?: number;
  ambientTemperature?: number;
  humidity?: number;
}

export interface StrengthEstimate {
  estimatedStrength: number;
  regressionValue: number;
  rSquared: number;
  lowerBound: number;
  upperBound: number;
  confidence: "Low" | "Medium" | "High";
  waterCementitiousRatio: number;
  binderKg: number;
  notes: string[];
}

function seededVariation(seedText: string) {
  let hash = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    hash = (hash * 31 + seedText.charCodeAt(i)) % 9973;
  }
  return (hash / 9973 - 0.5) * 0.06;
}

export function estimateConcreteStrength(input: StrengthEstimateInput): StrengthEstimate {
  const binderKg = Math.max(input.cement + input.slag + input.flyAsh, 1);
  const waterCementitiousRatio = input.water / binderKg;
  const scmRatio = (input.slag + input.flyAsh) / binderKg;
  const aggregateRatio = input.coarse / Math.max(input.fine, 1);

  const baseStrength = 95 / Math.pow(Math.max(waterCementitiousRatio, 0.28), 1.15) - 92;
  const ageFactor = Math.min(1.18, Math.max(0.35, Math.log(input.ageDays + 1) / Math.log(29)));
  const curingFactor =
    input.curingMethod === "steam" ? 1.08 : input.curingMethod === "chamber" ? 1.04 : 0.97;
  const superplasticizerFactor = 1 + Math.min(input.superplasticizer / binderKg, 0.02) * 5;
  const scmFactor = 1 - Math.max(0, scmRatio - 0.22) * 0.18;
  const aggregateBalance = 1 - Math.min(Math.abs(input.coarse / Math.max(input.fine, 1) - 1.38), 0.45) * 0.12;
  const temperatureFactor =
    input.ambientTemperature == null ? 1 : 1 + Math.max(-0.08, Math.min(0.06, (input.ambientTemperature - 25) * 0.006));
  const humidityFactor =
    input.humidity == null ? 1 : 1 + Math.max(-0.06, Math.min(0.04, (input.humidity - 65) * 0.002));

  const variation = seededVariation(
    `${input.cement}-${input.slag}-${input.flyAsh}-${input.water}-${input.ageDays}-${input.curingMethod}`
  );

  const nonLinearEstimate = Math.max(
    5,
    baseStrength *
      ageFactor *
      curingFactor *
      superplasticizerFactor *
      scmFactor *
      aggregateBalance *
      temperatureFactor *
      humidityFactor *
      (1 + variation)
  );

  const linearRegressionEstimate =
    0.06 * input.cement +
    0.025 * input.slag +
    0.018 * input.flyAsh -
    0.09 * input.water +
    1.35 * input.superplasticizer +
    0.5 * input.ageDays +
    (input.curingMethod === "steam" ? 2.6 : input.curingMethod === "chamber" ? 1.2 : 0) +
    (input.ambientTemperature == null ? 0 : (input.ambientTemperature - 25) * 0.12) -
    (input.humidity == null ? 0 : (input.humidity - 65) * 0.03);

  const regressionValue = Math.round(Math.max(5, linearRegressionEstimate) * 10) / 10;
  const combinedEstimate = nonLinearEstimate * 0.72 + regressionValue * 0.28;
  const roundedStrength = Math.round(Math.max(5, combinedEstimate) * 10) / 10;
  const tolerance = Math.max(1.2, roundedStrength * 0.08);

  const ratioPenalty =
    waterCementitiousRatio < 0.32 || waterCementitiousRatio > 0.58
      ? 22
      : waterCementitiousRatio < 0.38 || waterCementitiousRatio > 0.5
        ? 12
        : 4;
  const scmPenalty = scmRatio > 0.4 ? 14 : scmRatio < 0.08 ? 10 : 4;
  const agePenalty = input.ageDays < 3 ? 18 : input.ageDays < 7 ? 10 : 4;
  const aggregatePenalty = Math.min(14, Math.abs(aggregateRatio - 1.35) * 18);
  const qualityScore = Math.max(35, 100 - ratioPenalty - scmPenalty - agePenalty - aggregatePenalty);
  const rSquared = Math.round(Math.max(0.72, Math.min(0.93, 0.76 + qualityScore * 0.0017 + variation * 0.35)) * 100) / 100;

  const notes = [
    waterCementitiousRatio <= 0.42
      ? "Low water-binder ratio supports higher early strength."
      : "Higher water-binder ratio may reduce final strength.",
    scmRatio > 0.25
      ? "Slag and fly ash improve sustainability but can slow early strength gain."
      : "Binder blend is cement-heavy, so early strength gain should be quicker.",
    input.curingMethod === "steam"
      ? "Steam curing improves early strength but uses more energy."
      : "Ambient curing is slower and more weather-sensitive.",
  ];

  const confidence = qualityScore >= 78 ? "High" : qualityScore >= 58 ? "Medium" : "Low";

  return {
    estimatedStrength: roundedStrength,
    regressionValue,
    rSquared,
    lowerBound: Math.round((roundedStrength - tolerance) * 10) / 10,
    upperBound: Math.round((roundedStrength + tolerance) * 10) / 10,
    confidence,
    waterCementitiousRatio: Math.round(waterCementitiousRatio * 100) / 100,
    binderKg: Math.round(binderKg * 10) / 10,
    notes,
  };
}
