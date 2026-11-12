import { GameWeatherScenario, GameQuest, NPCCharacter, KnowledgeCard } from '@/src/types/game';

export const WEATHER_SCENARIOS: GameWeatherScenario[] = [
  {
    id: 'scenario_drought',
    name: 'Dry Spell / Limited Water',
    nameBn: 'খরা ও সীমিত পানি',
    season: 'Summer',
    temperatureC: 34,
    rainfallMm: 35,
    soilMoisturePercent: 18,
    waterAvailability: 'Limited',
    description: 'Hot summer winds with below-normal rainfall. Groundwater canals are restricted.',
    nasaContext: 'NASA SMAP indicates root-zone moisture below 20th percentile. GPM rainfall anomalies show -40% deficit.',
    defaultPriority: 'Save water and protect soil'
  },
  {
    id: 'scenario_normal',
    name: 'Optimal Balance Season',
    nameBn: 'অনুকূল স্বাভাবিক মৌসুম',
    season: 'Spring',
    temperatureC: 24,
    rainfallMm: 120,
    soilMoisturePercent: 32,
    waterAvailability: 'Moderate',
    description: 'Gentle showers, balanced sunlight, and ideal soil temperatures for early season vigor.',
    nasaContext: 'NASA MODIS NDVI tracks steady greening vigor across the regional agro-grid.',
    defaultPriority: 'Maximize balanced yield'
  },
  {
    id: 'scenario_heat',
    name: 'Heatwave Alert',
    nameBn: 'তীব্র তাপপ্রবাহ',
    season: 'Summer',
    temperatureC: 39,
    rainfallMm: 20,
    soilMoisturePercent: 14,
    waterAvailability: 'Limited',
    description: 'High land surface temperatures approaching 40°C. Transpiration and evaporative loss peak.',
    nasaContext: 'NASA POWER shows 22.8 MJ/m² solar irradiance with severe heat stress flags.',
    defaultPriority: 'Handle extreme heat'
  },
  {
    id: 'scenario_heavy_rain',
    name: 'Monsoon Torrent',
    nameBn: 'ভারী বর্ষণ / বর্ষাকাল',
    season: 'Monsoon',
    temperatureC: 28,
    rainfallMm: 380,
    soilMoisturePercent: 44,
    waterAvailability: 'Abundant',
    description: 'Copious monsoon deluges. Lowland fields are waterlogged; upland drainage is critical.',
    nasaContext: 'NASA GPM IMERG registers over 85mm in 48-hour satellite constellation precipitation scans.',
    defaultPriority: 'Manage drainage & moisture'
  },
  {
    id: 'scenario_soil_recovery',
    name: 'Soil Regeneration Cycle',
    nameBn: 'মাটির উর্বরতা পুনরুদ্ধার',
    season: 'Winter',
    temperatureC: 20,
    rainfallMm: 65,
    soilMoisturePercent: 26,
    waterAvailability: 'Moderate',
    description: 'After years of repetitive monoculture, soil organic matter and nitrogen are depleted.',
    nasaContext: 'ISRIC SoilGrids & MODIS baseline indicate depleted topsoil carbon needing biological cover.',
    defaultPriority: 'Rebuild soil organic health'
  }
];

export const INITIAL_QUESTS: GameQuest[] = [
  {
    id: 'q_explore',
    title: 'Explore the Farm',
    titleBn: 'খামার ঘুরে দেখুন',
    description: 'Walk around your farm using WASD / Arrow Keys and inspect the landmarks.',
    rewardKnowledge: 15,
    rewardCoins: 25,
    completed: false,
    targetObject: 'farm'
  },
  {
    id: 'q_weather',
    title: 'Check Weather Station',
    titleBn: 'আবহাওয়া কেন্দ্র পর্যবেক্ষণ',
    description: 'Visit the rooftop anemometer weather station to check temperature and rain.',
    rewardKnowledge: 20,
    rewardCoins: 30,
    completed: false,
    targetObject: 'weather'
  },
  {
    id: 'q_nasa',
    title: 'Visit NASA Earth Station',
    titleBn: 'নাসা আর্থ স্টেশন ভিজিট',
    description: 'Learn how NASA satellites (GPM, SMAP, MODIS) observe farm conditions from space.',
    rewardKnowledge: 30,
    rewardCoins: 40,
    completed: false,
    targetObject: 'nasa'
  },
  {
    id: 'q_terra',
    title: 'Consult Terra AI',
    titleBn: 'টেরা এআই-এর পরামর্শ নিন',
    description: 'Ask Terra AI about water constraints and crop heat tolerance before planting.',
    rewardKnowledge: 25,
    rewardCoins: 35,
    completed: false,
    targetObject: 'terra'
  },
  {
    id: 'q_plant',
    title: 'Plant Your First Season',
    titleBn: 'প্রথম মৌসুমের ফসল রোপণ',
    description: 'Walk to the plowed field, select a climate-resilient crop, and plant seeds.',
    rewardKnowledge: 40,
    rewardCoins: 50,
    completed: false,
    targetObject: 'field'
  },
  {
    id: 'q_rotation',
    title: 'Master Crop Rotation',
    titleBn: 'ফসল আবর্তন আয়ত্ত করুন',
    description: 'Analyze multi-year rotation to protect soil nutrients and save groundwater.',
    rewardKnowledge: 50,
    rewardCoins: 80,
    completed: false,
    targetObject: 'rotation'
  }
];

export const GAME_NPCS: NPCCharacter[] = [
  {
    id: 'grandparent',
    name: 'Farmer Kabir (Grandpa)',
    role: 'Traditional Agri Elder',
    avatarColor: '#8D5524',
    dialogue: [
      "Welcome, grandchild! For forty years I tilled this soil with bullocks and hand sickles.",
      "The seasons used to arrive like clockwork, but now the rains come either too late or all at once.",
      "Remember this ancient rule: Never plant the same heavy feeder crop twice in a row. Let legumes heal the earth!"
    ],
    dialogueBn: [
      "স্বাগতম নাতি! চল্লিশ বছর ধরে আমি এই মাটিতে লাঙল টেনেছি।",
      "আগে ঋতুগুলো ঘড়ির মতো নির্দিষ্ট ছিল, কিন্তু এখন বৃষ্টি হয় খুব দেরিতে আসে নয়তো একসাথে প্লাবন আনে।",
      "একটি প্রাচীন নিয়ম মনে রেখো: কখনোই একটানা একই ফসল লাগাবে না। ডালজাতীয় ফসল মাটিকে নতুন জীবন দেয়!"
    ],
    tip: 'Legumes after cereals restore nitrogen naturally.'
  },
  {
    id: 'young_farmer',
    name: 'Maya (Agri Student)',
    role: 'Modern Agroecologist',
    avatarColor: '#285C35',
    dialogue: [
      "Hey there! I am testing regenerative micro-drip irrigation and digital soil testing.",
      "Farmers today have satellite data at their fingertips! We don't have to guess when drought strikes.",
      "Check the NASA station near the pond to see soil moisture maps before choosing your seeds."
    ],
    dialogueBn: [
      "কেমন আছো! আমি রিজেনারেটিভ ড্রিপ ইরিগেশন ও ডিজিটাল মৃত্তিকা পরীক্ষা নিয়ে কাজ করছি।",
      "আজকের কৃষকদের হাতের মুঠোয় স্যাটেলাইট ডেটা আছে! খরা এলে আমাদের আর অন্ধকারে থাকতে হয় না।",
      "বীজ নির্বাচনের আগে পুকুরের পাশের নাসা আর্থ স্টেশনে গিয়ে মাটির আর্দ্রতা দেখে নাও।"
    ],
    tip: 'Pairing local knowledge with satellite telemetry creates resilient harvests.'
  },
  {
    id: 'scientist',
    name: 'Dr. Alena Vance',
    role: 'NASA Earth Scientist',
    avatarColor: '#0B1220',
    dialogue: [
      "Greetings from the Earth Observation program! Satellites like SMAP orbit 685 kilometers above us.",
      "Using microwave radiometers, SMAP measures water in the top 5 centimeters of soil through clouds and vegetation.",
      "Combined with GPM precipitation and MODIS vegetation vigor, we help farmers forecast risk before plants wilt."
    ],
    dialogueBn: [
      "নাসা আর্থ অবজারভেশন প্রোগ্রাম থেকে স্বাগতম! আমাদের স্যাটেলাইট ভূপৃষ্ঠের ৬৮৫ কিমি ওপর দিয়ে ঘুরছে।",
      "মাইক্রোওয়েভ রেডিওমিটার দিয়ে SMAP মাটির ওপরের ৫ সেমি আর্দ্রতা পরিমাপ করে।",
      "ফসল শুকিয়ে যাওয়ার আগেই স্যাটেলাইট ডেটা ঝুঁকি পূর্বাভাস দিতে পারে।"
    ],
    tip: 'Microwave remote sensing sees moisture regardless of day or night.'
  },
  {
    id: 'shopkeeper',
    name: 'Rahim (Seed Master)',
    role: 'Certified Seed Merchant',
    avatarColor: '#B9822A',
    dialogue: [
      "Good day! Certified climate-smart seeds are in stock.",
      "Notice that lentil and chickpea seeds cost less in irrigation, while paddy rice requires abundant water.",
      "Choose wisely based on your current seasonal forecast!"
    ],
    dialogueBn: [
      "শুভ দিন! উন্নত জাতের জলবায়ু-সহনশীল বীজ প্রস্তুত আছে।",
      "খেয়াল রেখো, ডালের ক্ষেত্রে সেচের খরচ নেই বললেই চলে, আর ধানে প্রচুর পানি লাগে।",
      "বর্তমান আবহাওয়া পরিস্থিতি বুঝে সেরা বীজটি বেছে নাও!"
    ],
    tip: 'Match seed genetics with root-zone moisture conditions.'
  }
];

export const NASA_STATION_CARDS = [
  {
    id: 'gpm',
    title: 'NASA GPM / IMERG',
    subtitle: 'Global Precipitation Measurement',
    shortDesc: 'Constellation of international satellites measuring global rain and snowfall every 30 minutes.',
    whatIsIt: 'The Global Precipitation Measurement (GPM) Core Observatory uses advanced Dual-frequency Precipitation Radar (DPR) and high-resolution radiometers to map rainfall rates from space.',
    howItHelps: 'Farmers use precipitation history and forecasts to schedule planting dates, anticipate flood runoff, and calculate remaining seasonal water budgets.',
    icon: '🌧️',
    spec: '0.1° (~10 km) resolution · 30-min latency',
    color: '#527DA5'
  },
  {
    id: 'smap',
    title: 'NASA SMAP',
    subtitle: 'Soil Moisture Active Passive',
    shortDesc: 'Measures moisture stored in topsoil and root zones, monitoring agricultural drought in real-time.',
    whatIsIt: 'SMAP carries an L-band (1.4 GHz) microwave radiometer that senses thermal emissions from land surfaces, which directly correlate with liquid water in soil pores.',
    howItHelps: 'Provides early drought warnings before crops exhibit visible water stress. Identifies when soil has sufficient moisture for seed germination without wasting groundwater.',
    icon: '🌱',
    spec: '9 km / 36 km root zone · 2-3 day revisit',
    color: '#36764A'
  },
  {
    id: 'modis',
    title: 'NASA MODIS (Terra & Aqua)',
    subtitle: 'Vegetation & Land Surface Temperature',
    shortDesc: 'Scans the entire Earth daily to compute NDVI (Normalized Difference Vegetation Index) and canopy heat.',
    whatIsIt: 'MODIS measures red and near-infrared reflectance. Healthy chlorophyll strongly reflects near-infrared light, allowing calculation of live green biomass density.',
    howItHelps: 'Enables crop health tracking across vast regions, detects pest outbreaks or heat stress early, and monitors harvest maturity timing.',
    icon: '🛰️',
    spec: '250m - 1km resolution · Daily global coverage',
    color: '#285C35'
  },
  {
    id: 'power',
    title: 'NASA POWER Project',
    subtitle: 'Prediction of Worldwide Energy Resources',
    shortDesc: 'Solar irradiance, surface air temperatures, wind vectors, and relative humidity for agro-climatology.',
    whatIsIt: 'Synthesizes satellite solar observations and Goddard Earth Observing System (GEOS) atmospheric assimilation models for renewable agriculture modeling.',
    howItHelps: 'Calculates growing degree days (GDD), evapotranspiration rates (ET₀), and potential heat injury thresholds for sensitive flowering crops.',
    icon: '☀️',
    spec: '0.5° latitude/longitude grid · 40+ year archive',
    color: '#B9822A'
  }
];

export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 'k_rotation',
    category: 'CROPS',
    title: 'Biological Crop Rotation',
    summary: 'Alternating cereal grains with leguminous pulses prevents nutrient exhaustion and pest build-up.',
    details: 'Monoculture (planting the same crop season after season) depletes specific soil horizons and invites fungal pathogens. Rotating deep-rooted legumes like chickpeas after shallow cereals like rice naturally replenishes nitrogen without petroleum-based synthetic fertilizers.',
    icon: '🔄',
    unlocked: true
  },
  {
    id: 'k_smap',
    category: 'NASA',
    title: 'Satellite Soil Moisture (SMAP)',
    summary: 'NASA SMAP measures the moisture in soil from orbit using microwave signals.',
    details: 'Because water changes how soil emits natural microwave energy, NASA SMAP can measure whether soil is dry, moist, or saturated through clouds. This helps farmers plan irrigation precisely when crops actually need it.',
    icon: '🛰️',
    unlocked: true
  },
  {
    id: 'k_nitrogen',
    category: 'SOIL',
    title: 'Biological Nitrogen Fixation',
    summary: 'Legume crops capture nitrogen directly from the air and store it in soil nodules.',
    details: 'Legumes (beans, lentils, soybeans, chickpeas) form a symbiotic partnership with Rhizobium bacteria in their root nodules. They convert inert atmospheric N₂ gas into bioavailable ammonium, leaving behind free fertility for the next season.',
    icon: '🌿',
    unlocked: true
  },
  {
    id: 'k_water',
    category: 'WATER',
    title: 'Agricultural Water Stress',
    summary: 'When soil water falls below field capacity, plants close stomata and growth halts.',
    details: 'During dry spells, crops with low drought tolerance like rice or tomato suffer severe yield losses. Choosing drought-resilient crops with taproots (like chickpeas or sorghum) ensures survival during unpredictable dry spells.',
    icon: '💧',
    unlocked: false
  },
  {
    id: 'k_heat',
    category: 'WEATHER',
    title: 'Terminal Heat Stress',
    summary: 'Extreme temperatures during crop flowering cause pollen sterility and yield drops.',
    details: 'When ambient temperatures exceed 35°C during crop pollination (anthesis), flowers can fail to set seed. Timing planting dates using NASA POWER climatology helps avoid flowering during historical peak heatwaves.',
    icon: '🌡️',
    unlocked: false
  },
  {
    id: 'k_sustainability',
    category: 'SUSTAINABILITY',
    title: 'Groundwater Conservation',
    summary: 'Pumping aquifers faster than rainfall recharge leads to permanent water table decline.',
    details: 'Over 70% of freshwater withdrawn globally goes to irrigation. By substituting high-water crops with water-thrifty pulses in drought-prone regions, farmers protect drinking water reserves for generations to come.',
    icon: '🛡️',
    unlocked: false
  }
];

export const EDUCATIONAL_QUIZ = [
  {
    id: 'q1',
    question: 'Which NASA satellite mission specifically monitors soil moisture from space?',
    options: ['SMAP', 'Hubble Space Telescope', 'James Webb Telescope', 'GPS Navigation'],
    correctIndex: 0,
    explanation: 'NASA SMAP (Soil Moisture Active Passive) uses L-band microwave radiometry to measure soil water content across the globe every 2-3 days.'
  },
  {
    id: 'q2',
    question: 'If rainfall drops 40% below average and groundwater is scarce, which crop is most suitable?',
    options: ['Paddy Rice (Flooded)', 'Lentils / Chickpea (Drought-resilient)', 'Field Tomato (High water)', 'Watermelon'],
    correctIndex: 1,
    explanation: 'Lentils and chickpeas have low water demand and deep taproots that thrive in dry soil, whereas paddy rice requires extensive standing water.'
  },
  {
    id: 'q3',
    question: 'What happens to soil when farmers practice continuous monoculture without rotating crops?',
    options: ['Soil gets healthier every year', 'Nutrients deplete and pest/disease pressure escalates', 'Soil turns into gold', 'Weeds disappear automatically'],
    correctIndex: 1,
    explanation: 'Monoculture depletes specific micro and macronutrients and allows soil-borne pests to multiply. Crop rotation interrupts pest cycles and balances soil health.'
  },
  {
    id: 'q4',
    question: 'What does MODIS NDVI measure on agricultural land?',
    options: ['Internet connection speed', 'Live green vegetation vigor & biomass', 'Depth of groundwater wells', 'Tractor engine speed'],
    correctIndex: 1,
    explanation: 'NDVI (Normalized Difference Vegetation Index) compares red and near-infrared reflectance to determine the density and health of green vegetation.'
  }
];
