# TerraCrop AI 🛰️🌱

> **"Understand Your Farm. Plan What Comes Next."**  
> Turning NASA Earth observation data, climate science, and agronomic AI into simple, actionable decisions for farmers and inspiring the next generation through interactive agricultural discovery.

---

## 📑 Table of Contents

1. [Overview & The Problem We Solve](#1-overview--the-problem-we-solve)
2. [Our Solution](#2-our-solution)
3. [How Users Benefit](#3-how-users-benefit)
4. [Inspiring the Next Generation: The 2D Cozy Farm Game](#4-inspiring-the-next-generation-the-2d-cozy-farm-game)
5. [Artificial Intelligence (AI) in TerraCrop](#5-artificial-intelligence-ai-in-terracrop)
6. [Key Features & How to Use Them](#6-key-features--how-to-use-them)
7. [NASA Earth Data & APIs Used](#7-nasa-earth-data--apis-used)
8. [System Architecture](#8-system-architecture)
9. [Development Tech Stack](#9-development-tech-stack)
10. [Getting Started & Installation](#10-getting-started--installation)

---

## 1. Overview & The Problem We Solve

### The Real-World Challenge:
- **Erratic Climate Extremes**: Farmers face shifting rainfall windows, flash droughts, delayed monsoons, and extreme heatwaves.
- **Continuous Monoculture & Soil Degradation**: Planting the same cash crop season after season depletes vital soil nitrogen, degrades microbial life, drops the groundwater table, and invites severe pest and fungal infestations.
- **Complex, Inaccessible Science**: NASA and scientific institutes publish petabytes of free Earth satellite observations, but raw satellite measurements (spectral bands, L-band microwave radiometry, multi-angle reflectance) are locked in scientific formats (HDF5, NetCDF, GeoTIFF) that an everyday farmer or agricultural student cannot easily decipher.
- **Disconnected Generative AI**: Many modern "AI farming apps" send raw questions like *"What should I plant?"* directly to an ungrounded chatbot, leading to hallucinations, incompatible crop recommendations, and financial risk for farmers.

---

## 2. Our Solution

TerraCrop AI bridges satellite remote sensing and everyday agriculture through a **transparent, multi-layered architecture**:

1. **Environmental Ingestion**: Automatically grabs climate and soil conditions (temperature, precipitation anomaly, root-zone moisture, vegetation greenness) based on the farm's location.
2. **Deterministic Agro-Ecological Engine**: Uses **Multi-Attribute Utility Theory (MAUT)** and strict botanical rules (preventing Solanaceae back-to-back, mandating nitrogen-fixing legume breaks, accounting for drought and heat tolerance). The recommendations are **100% reproducible, explainable, and scientifically validated**.
3. **Contextual AI (Ask Terra)**: Google Gemini (`gemini-3.8-flash`) acts as an agricultural translator that explains the **"why"** behind every calculation in plain language and provides real-time voice and text answers grounded in farm telemetry.
4. **Interactive 2D Pixel-Art Farm Simulator (TerraFarm)**: An educational, cozy farming game inspired by classics like *Fields of Mistria* and *Stardew Valley* where children, students, and young farmers explore real climate challenges, till soil, plant crops, pet animals, and test NASA satellite tools hands-on.

---

## 3. How Users Benefit

| User Group | Key Benefits |
| :--- | :--- |
| **Smallholder & Commercial Farmers** | • Understand their soil moisture and upcoming weather risk in **5 seconds**.<br>• Get a personalized 1- to 5-year crop rotation schedule that cuts chemical fertilizer costs and protects groundwater.<br>• Listen to explanations in English or Bangla (বাংলা) with Text-to-Speech (TTS). |
| **Agricultural Extension Workers & Agronomists** | • Test climate stress scenarios (e.g. -40% rainfall drought or +3°C heatwave) in the **Scenario Lab** before advising farming communities.<br>• Back up recommendations with verifiable NASA Earth data. |
| **Students, Youth & Next-Gen Learners** | • Learn biology, remote sensing, and sustainable farming through an interactive top-down game.<br>• Connect in-game decisions directly to the real-world agricultural optimization tool. |

---

## 4. Inspiring the Next Generation: The 2D Cozy Farm Game

To bridge the gap between youth and modern climate-smart agriculture, TerraCrop AI includes an authentic **2.5D / 3/4 top-down cozy pixel-art game** directly in the web app:

```
    [ Hoe ⛏️ ]  ──>  [ Water Can 💧 ]  ──>  [ Seeds 🌱 ]  ──>  [ Sun Day ☀️ ]  ──>  [ Harvest 🧺 ]
        │                   │                   │                   │                   │
   Tills soil beds     Hydrates earth     Sows climate seeds   Simulates growth   Earns coins & XP
```

### Why It Inspires:
- **Hands-On Learning**: Young players don't just read about soil science; they use the **Hoe (1)** to prepare beds, the **Water Can (2)** to hydrate soil, and sow crops suited to current weather conditions.
- **Authentic Cozy Art**: Built with procedural pixel art featuring Sakura blossom trees with drifting petals, farm cottages, red barns, stone water wells, and pasture fences.
- **Living Farm Animals**: Children can meet and pet **Bessie the Cow**, **Cotton the Sheep**, **Henrietta the Hen**, and **Pip the Chick**, triggering cheerful sounds and floating heart animations (`❤️`).
- **NASA Earth Station**: Children can visit the rooftop parabolic satellite dish inside the game to learn how NASA SMAP, GPM, and MODIS monitor the planet from orbit.
- **Terra AI Robot Companion**: An adorable floating companion drone (`🤖`) that follows the player, offering helpful agronomic advice chips.
- **Bridge to Real Life**: After harvesting crops in the game, clicking **[ OPEN IN TERRACROP AI PLANNER ]** transfers the game's crop choices directly into the real professional planning tool.

---

## 5. Artificial Intelligence (AI) in TerraCrop

TerraCrop AI uses a hybrid AI approach to guarantee **safety, scientific accuracy, and clarity**:

### 1. Deterministic Agro-Optimization Engine (Mathematical AI)
- Evaluates crops across five criteria:
  $$\text{Suitability Score} = (W_{\text{water}} \cdot S_{\text{water}}) + (W_{\text{temp}} \cdot S_{\text{temp}}) + (W_{\text{soil}} \cdot S_{\text{soil}}) + (W_{\text{season}} \cdot S_{\text{season}}) + (W_{\text{priority}} \cdot S_{\text{priority}})$$
- Enforces botanical rules (e.g., penalties for continuous rice or potato monocultures, rewards for legume nitrogen fixation).

### 2. Generative AI Layer (`@google/genai` with Gemini 3.8 Flash)
- **Role**: Serves as the conversational translator and explanatory guide in **Ask Terra**.
- **Grounding**: Provided with a structured prompt containing the farm's location, soil type, moisture level, NASA anomaly percentage, and recommended crops.
- **No Hallucinations**: The model does not invent numbers. It explains *why* the deterministic engine selected each crop and suggests practical field management practices (such as mulching, drip irrigation, or AWD).
- **Offline / Zero-Key Fallback**: If an API key is not configured, TerraCrop seamlessly falls back to its built-in rule-based agro-reasoning engine so the app works reliably out of the box.

---

## 6. Key Features & How to Use Them

### 🌾 1. Farm Intelligence Dashboard
- **What it does**: Gives a real-time health card of your farm in 3 simple indicators:
  1. **Water in Soil** (Volumetric % from NASA SMAP proxy).
  2. **Weather & Heat** (Current temperature and historical rainfall anomaly from NASA POWER).
  3. **Crop Greenness** (NDVI vegetation index from NASA MODIS).
- **How to use**: Open the app, and view your summary immediately. Click *"Show NASA Satellite Numbers"* to inspect detailed orbital readings.

### 📅 2. Crop Rotation Planner
- **What it does**: Builds a 1- to 5-year succession schedule that maximizes yields while protecting soil and groundwater.
- **How to use**: Select your primary farm goal (**Best Balanced**, **Save Water**, or **Protect Soil**), pick your timeframe, and view the visual timeline. Click *"Why this crop?"* to hear audio explanations via Text-to-Speech.

### 🔬 3. Scenario Lab (Stress Simulator)
- **What it does**: Allows farmers to simulate potential climate shocks:
  - *Dry Spell / Drought* (-40% rainfall)
  - *Excess Monsoon Flood* (+60% rainfall)
  - *Severe Heatwave* (+3°C to +5°C temperature)
- **How to use**: Adjust climate sliders or select a quick preset to instantly see which crops fail and which resilient crops succeed.

### 🤖 4. Ask Terra (Voice & Text Assistant)
- **What it does**: A friendly conversational assistant that answers farming questions in plain English or Bengali.
- **How to use**: Type your question or tap the microphone icon to speak. Terra responds in text and audio.

### 🗺️ 5. Climate Map
- **What it does**: Visual interactive geospatial map displaying drought hazard zones, regional rainfall anomalies, and active farm coordinates.

---

## 7. NASA Earth Data & APIs Used

TerraCrop AI integrates curated datasets from NASA Earth Observation programs:

| Dataset / Mission | Managing NASA Center | Parameters Used | How TerraCrop Uses It | Data Access / API Endpoint |
| :--- | :--- | :--- | :--- | :--- |
| **NASA POWER Agroclimatology** | NASA Langley Research Center (LaRC) | • Surface Air Temperature (°C)<br>• Precipitation (mm/day)<br>• Solar Radiation (MJ/m²/day)<br>• Relative Humidity (%) | Calculates Growing Degree Days (GDD), thermal stress thresholds, and 10-year rainfall anomalies. | **NASA POWER API v2.0**<br>`https://power.larc.nasa.gov/api/temporal/climatology/point` |
| **NASA SMAP** *(Soil Moisture Active Passive)* | NASA Jet Propulsion Laboratory (JPL) | • Top 5cm volumetric soil moisture ($m^3/m^3$)<br>• Surface freeze/thaw state | Tracks root-zone moisture deficits and gates high-water crop planting. | **NASA Earthdata / NSIDC DAAC**<br>`https://nsidc.org/data/smap` |
| **NASA MODIS** *(Terra & Aqua)* | NASA LP DAAC / Goddard Space Flight Center | • Normalized Difference Vegetation Index (NDVI)<br>• Surface Reflectance | Measures living green vegetation density and detects early crop stress. | **NASA LP DAAC / Earthdata Search**<br>`https://lpdaac.usgs.gov/products/mod13q1v061/` |
| **NASA GPM / IMERG** *(Global Precipitation Measurement)* | NASA GSFC | • Half-hourly satellite rain rates<br>• Monthly storm accumulations | Forecasts flood and waterlogging risks during peak monsoon cycles. | **NASA PPS / GES DISC**<br>`https://gpm.nasa.gov/data/imerg` |

### How Data is Collected & Handled:
1. **Latitude/Longitude Lookup**: When a user inputs their farm location or uses GPS detection, the coordinate pair is queried.
2. **Climatological Baseline Calibration**: Data from NASA POWER and orbital radiometers is synthesized into an `EnvironmentalSnapshot` object with drought risk indices.
3. **Resilient Architecture**: To ensure immediate, zero-latency usability in rural areas with poor connectivity, TerraCrop caches local agro-climatic baselines so the application runs smoothly even with intermittent internet access.

---

## 8. System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER (UI/UX)                       │
│  React 19 SPA • Tailwind CSS • Lucide Icons • Motion • Bilingual (EN/BN)  │
│  Dashboard • Planner • Scenario Lab • Ask Terra • 2D Farm Game (Phaser)  │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼─────────────────────────────────────┐
│                      ENVIRONMENT & SATELLITE LAYER                       │
│  NASA POWER Agroclimatology  •  NASA SMAP Moisture  •  NASA MODIS NDVI   │
│  ISRIC SoilGrids Texture     •  FAO AgMIP Crop Biological Ontology       │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼─────────────────────────────────────┐
│                DETERMINISTIC AGRO-ECOLOGICAL OPTIMIZER                    │
│  Multi-Attribute Utility Theory (MAUT) • Water & Heat Constraint Matrix  │
│  100% Reproducible Scoring • Monoculture Disease Break Rules             │
└───────────────────┬──────────────────────────────────┬───────────────────┘
                    │                                  │
┌───────────────────▼──────────────┐   ┌───────────────▼───────────────────┐
│     EXPLAINABLE AI TRANSLATOR    │   │     INTERACTIVE 2D SIMULATOR      │
│  Google Gemini (gemini-3.8-flash)│   │  Phaser 3 Game Engine (60 FPS)    │
│  Voice TTS / STT Assistant       │   │  Tile-based crop simulation       │
└──────────────────────────────────┘   └───────────────────────────────────┘
```

---

## 9. Development Tech Stack

- **Core Framework**: React 19, TypeScript, Vite.
- **Styling & UI**: Tailwind CSS (via `@import "tailwindcss";`), Lucide React.
- **Game Engine**: Phaser 3 (2D canvas pixel art, tile physics, particle emitters).
- **Audio Engine**: Zero-dependency Web Audio API (procedural 8-bit sound effects: footsteps, water, harvest, chimes) + Web Speech API (Text-to-Speech & Speech-to-Text).
- **Backend Server**: Node.js & Express.js (`server.ts`) with Vite dev middleware.
- **AI SDK**: `@google/genai` (Google Gen AI SDK for Gemini 3.8 Flash).
- **Testing**: Node test runner with deterministic agronomic validation suites (`npm test`).

---

## 10. Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
# Optional: Provide Gemini API key for live generative AI responses.
# If omitted, TerraCrop AI runs on its built-in deterministic agro-reasoning engine.
GEMINI_API_KEY="your-gemini-api-key"
```

### Step 3: Launch the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### Step 4: Run the Test Suite
```bash
npm test
```
This runs automated tests validating:
- Agronomic monoculture penalty rules.
- Priority multiplier normalization (strictly sums to 1.000).
- Deterministic optimizer reproducibility across repeated calls.
- Simulated climate stress calculations in the Scenario Lab.

---

## 📄 License
Released under the **Apache-2.0 License**. NASA satellite datasets are open-access public domain data courtesy of NASA Earth Science Division.
