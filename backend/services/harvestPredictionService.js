const predictHarvest = async (cropEntry, weatherData) => {
  const now = new Date();
  const harvestDate = cropEntry.expectedHarvestDate || new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const daysUntil = Math.ceil((harvestDate - now) / (1000 * 60 * 60 * 24));

  let riskLevel = "Low";
  const risks = [];

  if (weatherData) {
    if (weatherData.rainfall > 50) {
      risks.push("heavy rain");
    }
    if (weatherData.temp > 35) {
      risks.push("high temperature");
    }
    if (weatherData.humidity > 80) {
      risks.push("high humidity");
    }
    if (weatherData.wind > 30) {
      risks.push("strong wind");
    }
  }

  if (risks.length >= 2) riskLevel = "High";
  else if (risks.length === 1) riskLevel = "Medium";

  const bestHarvestWindowStart = new Date(harvestDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const bestHarvestWindowEnd = new Date(harvestDate.getTime() + 3 * 24 * 60 * 60 * 1000);

  let recommendation = "Monitor crop regularly. ";
  if (riskLevel === "High") {
    recommendation += "Adverse weather expected. Consider early harvesting if crop is mature enough. Ensure proper drainage and support.";
  } else if (riskLevel === "Medium") {
    recommendation += "Weather conditions need monitoring. Plan harvest within the optimal window.";
  } else {
    recommendation += "Weather conditions are favorable. Proceed with normal harvest planning.";
  }

  if (daysUntil <= 0) {
    recommendation = "Crop is past expected harvest date. Harvest immediately if not already done.";
  }

  return {
    cropName: cropEntry.cropName,
    plantingDate: cropEntry.plantingDate,
    expectedHarvestDate: harvestDate,
    bestHarvestWindowStart,
    bestHarvestWindowEnd,
    demandPeakTiming: daysUntil <= 7 ? "Now" : daysUntil <= 30 ? "Soon" : "Later",
    riskLevel,
    recommendation,
    daysUntilHarvest: daysUntil,
    generatedAt: now
  };
};

module.exports = { predictHarvest };
