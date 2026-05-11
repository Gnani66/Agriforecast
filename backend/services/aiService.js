const axios = require("axios");

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3:1.7b";

const systemPrompt = `You are AgriForecast AI, an expert agricultural and retail assistant for Indian farmers and retailers.
For farmers, you provide advice on:
- Crop selection and planting timing
- Weather impact on farming decisions
- Market price analysis for Indian mandis
- Harvest optimization and timing
- Pest and disease management
- Irrigation scheduling and water conservation

For retailers, you provide advice on:
- Inventory management and stock optimization
- Waste reduction and spoilage prevention
- Demand forecasting and sales trends
- Reorder recommendations and procurement
- Product pricing and promotion strategies
- Weather impact on customer footfall and demand

Keep responses practical, specific, and actionable. Use simple language.`;

const getAIResponse = async (prompt, context = {}) => {
  try {
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/chat`,
      {
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...(context.history || []),
          { role: "user", content: prompt }
        ],
        stream: false,
        options: { temperature: 0.7, num_predict: 500 }
      },
      { headers: { "Content-Type": "application/json" }, timeout: 30000 }
    );

    if (response.data?.message?.content) {
      return response.data.message.content;
    }
  } catch (error) {
    console.log("Ollama not available, using local fallback:", error.message);
  }

  return getLocalFallbackResponse(prompt);
};

const getLocalFallbackResponse = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("crop") || lowerPrompt.includes("plant") || lowerPrompt.includes("recommend")) {
    return `Crop Recommendations for Maharashtra:

Tomato - Best Choice
- Demand: High (+18% this week)
- Price: Rs 45/kg
- Water: Medium (500-700mm/season)
- Tips: Use hybrid seeds, support plants

Onion - Good Option
- Demand: High (+12%)
- Price: Rs 32/kg
- Water: Low (350-500mm/season)
- Tips: Harvest when leaves yellow

Green Chili - Steady Returns
- Demand: Medium-High
- Price: Rs 80/kg
- Tips: Year-round possible

Consult local Krishi Vigyan Kendra for variety-specific advice.`;
  }

  if (lowerPrompt.includes("harvest") || lowerPrompt.includes("when") || lowerPrompt.includes("ready")) {
    return `Harvest Timing Guide:

Onion - Ready in 8 days
- Signs: 50% leaf yellowing, soft neck
- Harvest: Morning (avoid afternoon)
- Dry: In shade for 5-7 days

Potato - Ready in 18 days
- Signs: Leaves yellow, vines dry
- Tip: Wait for complete vine death
- Yield: ~3000kg/acre

Tomato - Ready in 45 days
- Signs: Color changes, slight soft
- Stage: Harvest at breaker stage

Check weather - heavy rain expected.`;
  }

  if (lowerPrompt.includes("weather") || lowerPrompt.includes("rain") || lowerPrompt.includes("rainfall")) {
    return `Weather Advisory:

Today: Partly cloudy, 28C
Tomorrow: Cloudy, chance of rain
Wed-Thu: Heavy rainfall (85mm) - precaution needed

Farming Actions:
1. Skip irrigation - rain expected
2. Harvest mature crops now
3. No pesticide spraying
4. Check storage roof
5. Avoid field work

After Rain:
- Check waterlogging
- Apply fungicide (high humidity)
- Resume irrigation after 2 days`;
  }

  if (lowerPrompt.includes("price") || lowerPrompt.includes("market") || lowerPrompt.includes("sell")) {
    return `Today's Market Prices (Pune Mandi):

SELL NOW:
- Tomato: Rs 45/kg (+18%)
- Green Chili: Rs 80/kg (+22%)
- Cauliflower: Rs 35/kg (+15%)

WAIT:
- Onion: Rs 32/kg (+12%) - sell in 5 days
- Potato: Rs 22/kg (-5%) - wait 10 days

Tips for Better Prices:
- Sell directly at mandi (not to traders)
- Use price alert notifications
- Time sales with demand peaks
- Grade produce quality-wise`;
  }

  if (lowerPrompt.includes("water") || lowerPrompt.includes("irrigation") || lowerPrompt.includes("drought")) {
    return `Irrigation Guide:

Daily Need (per plant):
- Tomato: 5-6 liters
- Onion: 3-4 liters
- Potato: 4-5 liters

Best Time:
- Morning: 6-8 AM (best)
- Evening: 5-7 PM (okay)

Methods:
- Drip irrigation - saves 40% water
- Flood - traditional but wasteful
- Sprinkler - for large areas

During Rain:
- Stop irrigation for 3 days
- Check drainage

Do not overwater - causes root rot.`;
  }

  if (lowerPrompt.includes("reorder") || lowerPrompt.includes("restock") || lowerPrompt.includes("procurement")) {
    return `Reorder Recommendations:

Based on your current inventory:

HIGH PRIORITY — Reorder Now:
- Milk: Stock low, demand rising (+12%)
- Tomatoes: High demand, limited shelf life
- Vegetables: Fast-moving, restock every 2-3 days

MEDIUM PRIORITY — Reorder Soon:
- Rice: Steady demand, adequate stock for 7 days
- Onions: Stable demand, reorder in 3 days
- Cooking Oil: Low turnover, monitor before reorder

LOW PRIORITY — Reduce Stock:
- Spices: Overstock detected, slow sales
- Canned Goods: Excess inventory, run promotion

Suggested Order Quantities:
1. Milk: 50 units (covers 3 days)
2. Vegetables: 100 units (covers 2 days)
3. Tomatoes: 30 kg (covers 4 days)

Tip: Check weather forecast — heavy rain may reduce footfall, adjust quantities.`;
  }

  if (lowerPrompt.includes("waste") || lowerPrompt.includes("spoil") || lowerPrompt.includes("expir") || lowerPrompt.includes("spoilage")) {
    return `Waste Risk Analysis:

CRITICAL RISK:
- Tomatoes: Expiring in 1 day — run discount immediately
- Milk: Expiring in 2 days — move to front display

HIGH RISK:
- Paneer: 4 days to expiry — consider promotion
- Leafy Vegetables: High humidity accelerating spoilage

MEDIUM RISK:
- Yogurt: 6 days to expiry, monitor stock levels
- Bread: Slow sales, reduce order quantity

Recommendations:
1. Apply "today only" discounts on near-expiry items
2. Move expiring products to high-traffic areas
3. Reduce next order for slow-moving items
4. Check storage temperature — current heat may shorten shelf life

Action: Review and act on critical items within 24 hours.`;
  }

  if (lowerPrompt.includes("fast") || lowerPrompt.includes("selling") || lowerPrompt.includes("bestseller") || lowerPrompt.includes("popular")) {
    return `Fast-Moving Products Report:

TOP SELLERS:
1. Milk — 45 units/day (↑12% vs last week)
2. Tomatoes — 30 kg/day (↑18% demand spike)
3. Vegetables (mixed) — 25 kg/day (↑8%)
4. Bread — 20 units/day (stable)
5. Eggs — 18 trays/day (↑5%)

TRENDING UP:
- Seasonal fruits: demand rising (+15%)
- Cooking essentials: steady growth

SLOW MOVERS (Consider reducing):
- Packaged snacks: down 8%
- Soft drinks: seasonal low

Recommendations:
1. Ensure Milk and Vegetables stock is always available
2. Increase Tomato order by 20%
3. Reduce snack orders until weekend
4. Use end-cap displays for trending items

Monitor daily — demand patterns shift with weather and events.`;
  }

  if (lowerPrompt.includes("reduce") || lowerPrompt.includes("overstock") || lowerPrompt.includes("excess") || lowerPrompt.includes("too much")) {
    return `Products to Reduce or Stop Ordering:

OVERSTOCK DETECTED:
1. Rice (25 bags) — 40% above optimal — stop ordering for 2 weeks
2. Cooking Oil (30 liters) — excess stock — reduce next order by 50%
3. Canned Vegetables (60 units) — slow turnover — run BOGO offer

NEXT ORDER ADJUSTMENTS:
- Milk: Increase by 10% (rising demand)
- Vegetables: Maintain current levels
- Spices: Reduce by 30% (current stock covers 3 weeks)

Suggested Actions:
- Create combo deals to move overstock items
- Use "clearance" section for excess inventory
- Donate near-expiry items (tax benefit)
- Adjust min/max stock levels based on actual sales velocity

Track weekly and adjust orders accordingly.`;
  }

  if (lowerPrompt.includes("pest") || lowerPrompt.includes("disease") || lowerPrompt.includes("bug")) {
    return `Common Pests and Solutions:

Tomato:
- Fruit Borer: Use neem spray, remove affected fruits
- White Fly: Yellow sticky traps, insecticide
- Early Blight: Copper fungicide

Onion:
- Thrips: Spray neem + soap solution
- Purple Blotch: Fungicide, proper spacing

General Prevention:
- Rotate crops yearly
- Use disease-resistant varieties
- Remove infected plants immediately
- Maintain field hygiene

Always follow waiting period after pesticide.`;
  }

  return `Namaste! I can help you with:

- Crops: Best crops for your region
- Weather: Forecast and farming impact
- Markets: Prices and selling timing
- Water: Irrigation schedules
- Pests: Disease identification and treatment
- Harvest: Optimal timing

What would you like to know about?`;
};

const generateCropRecommendation = async (region, season, soilType, weatherData) => {
  const prompt = `Recommend best crops for:
  - Region: ${region || "Maharashtra"}
  - Season: ${season || "Rabi"}
  - Soil: ${soilType || "Loamy"}
  - Weather: ${JSON.stringify(weatherData || {})}

Give specific crop names with reasons and practical tips.`;

  return getAIResponse(prompt);
};

const generateMarketInsight = async (cropData, weatherData) => {
  const prompt = `Analyze market outlook for:
  ${JSON.stringify(cropData || [])}
  Weather: ${JSON.stringify(weatherData || {})}

Give demand prediction, price trends, and selling recommendations.`;

  return getAIResponse(prompt);
};

const generateHarvestAdvice = async (crop, plantingDate, weatherForecast) => {
  const prompt = `Give harvest timing advice for:
  - Crop: ${crop || "Tomato"}
  - Planted: ${plantingDate || "Unknown"}
  - Weather: ${JSON.stringify(weatherForecast || [])}

Include optimal harvest window and tips.`;

  return getAIResponse(prompt);
};

const generateInsight = async (data) => {
  const prompt = `Analyze the following agricultural data and provide a concise, actionable insight:

${JSON.stringify(data, null, 2)}

Provide specific observations and recommendations based on this data.`;

  return getAIResponse(prompt);
};

module.exports = {
  getAIResponse,
  generateCropRecommendation,
  generateMarketInsight,
  generateHarvestAdvice,
  generateInsight
};
