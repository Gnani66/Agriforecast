# 🌾 AgriForecast: Predictive Supply Chain Intelligence

AgriForecast is a unified, multi-tenant SaaS platform backed by Machine Learning and LLMs, designed to eliminate food waste by bringing predictive intelligence to the entire agricultural supply chain. 

We connect Farmers, Distributors, and Retailers on a single data spine, allowing predictive demand from the retail side to dictate the planting cycles on the farm side.

## 🚀 The Problem We Are Solving

Globally, 30% of all food produced is wasted before it reaches a consumer's plate. The agricultural supply chain operates on guesswork:
- Farmers guess what to plant.
- Distributors guess where to send trucks.
- Retailers guess what consumers will buy.

**Our Solution:** AgriForecast eliminates this guesswork. By using Facebook Prophet for robust time-series forecasting and LLMs for actionable insights, we synchronize supply with actual demand.

---

## ✨ Features (The Three Portals)

### 1. Farmer Portal 👨‍🌾
- **Crop Planning:** Log `CropEntries` (e.g., planting 10 acres of tomatoes) and track the timeline from seed to harvest.
- **ML Market Forecasting:** See predictive demand curves months in advance before committing to a crop.
- **Real-Time Market Prices:** Live integration with wholesale pricing (e.g., Agmarknet) via an automated, self-healing background scraper. If the government API goes down, the system mathematically simulates pricing via 7-day moving averages.
- **AI Assistant:** Get instant natural language advice on yields, weather, and market conditions.

### 2. Distributor Portal 🚚
- **3PL Logistics Engine:** Track end-to-end shipments, including variables like weight, priority, and real-time transit progress.
- **Dynamic Route Optimization:** Automatically groups active shipments by destination and calculates total load weights to suggest the most efficient delivery routes.
- **Fleet & Warehouse Management:** Monitor real-time status of fleet vehicles (Active/Idle/Maintenance) and calculate live warehouse utilization capacity.

### 3. Retailer Portal 🏪
- **Inventory Optimization:** Multi-unit tracking (kg, liters, packets) to manage everything from loose produce to packaged dairy.
- **Demand Prediction:** ML models analyze historical retail sales to predict exact stock needs for the next 7-14 days.
- **Automated Alerts:** Prevent food waste with AI-driven flags for "Slow Turnover" items, prompting timely discounts before spoilage.

---

## 🛡️ Current Security & Future Enterprise Deployment

### Current MVP Security Implementation
- **Strict Role-Based Access Control (RBAC):** Custom JWT-based middleware guarantees complete data isolation. A retailer cannot query a farmer's yield data, and a distributor cannot access a retailer's analytics.
- **Environment Isolation:** Secrets and database credentials are fully masked.
- **Cross-Origin Security:** CORS policies strictly lock backend API access to verified frontend domains.

### Future Production Deployment Plan (Zero-Trust Privacy)
Agricultural data is highly proprietary. When deploying to enterprise clients, we plan to implement a **Zero-Trust Data Privacy** moat:
- **AES-256 Encryption:** All data at rest and in transit will be cryptographically secured.
- **Trusted Execution Environment (TEE):** Our AI models (LLMs and Prophet) will execute inside a Secure Enclave. This provides mathematical, hardware-based safety guarantees. 
- **Zero Data Leakage:** Because the memory state inside a TEE is hidden from the host OS and GPUs, user data is never logged on servers and is mathematically prevented from being used to train foundation models.

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js (App Router)](https://nextjs.org/) / React
- TypeScript
- TailwindCSS (Clean, professional SaaS aesthetics)
- Lucide React (Iconography)

**Backend:**
- Node.js / Express
- MongoDB (Mongoose ORM)
- Python (Facebook Prophet for ML Forecasting)
- Redis (Caching and rate-limiting)

**AI & ML:**
- Meta Llama 3 (Quantized, via Ollama) for local, secure NLP.
- Facebook Prophet for missing-data-tolerant time-series forecasting.

---

## 💻 Running the Project Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Running locally or MongoDB Atlas URI)
- Redis Server (Running locally)
- Ollama (For AI Insights, with `llama3` model installed)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/agriculture-app.git
   cd agriculture-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Python requirements for ML
   pip install prophet pandas
   
   # Setup environment variables
   # Create a .env file with your MONGO_URI, REDIS_URL, etc.
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser. You can navigate between the portals via `/farmer`, `/distributor`, and `/retailer`.

---


