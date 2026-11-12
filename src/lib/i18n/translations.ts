export type Language = 'en' | 'bn';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  home: string;
  farm: string;
  cropPlan: string;
  askTerra: string;
  climateMap: string;
  scenarioLab: string;
  dataSources: string;
  settings: string;
  more: string;
  guidedSetup: string;
  
  // Header & Accessibility
  readAloud: string;
  readingAloud: string;
  stopAudio: string;
  textSize: string;
  normalText: string;
  largeText: string;
  extraLargeText: string;
  soundGuide: string;

  // Home Screen
  greeting: string;
  homeSubtitle: string;
  farmConditionGood: string;
  farmConditionAttention: string;
  farmConditionDrying: string;
  waterStatusLabel: string;
  weatherStatusLabel: string;
  cropHealthLabel: string;
  waterGood: string;
  waterModerate: string;
  waterLow: string;
  weatherNormal: string;
  weatherHot: string;
  weatherCool: string;
  cropHealthy: string;
  cropModerate: string;
  cropStressed: string;
  waterExplanationGood: string;
  waterExplanationLow: string;
  weatherExplanation: string;
  cropExplanation: string;
  lastUpdated: string;
  sourceNASA: string;

  // Actions
  chooseNextCrop: string;
  checkMyFarm: string;
  planReadyHeadline: string;
  seeMyPlan: string;
  whyThisPlan: string;
  askTerraWhy: string;
  showTechnicalData: string;
  hideTechnicalData: string;

  // Onboarding
  step: string;
  of: string;
  back: string;
  next: string;
  skip: string;
  step1Title: string;
  step1Desc: string;
  useMyLocation: string;
  step2Title: string;
  step2Desc: string;
  acres: string;
  hectares: string;
  step3Title: string;
  step3Desc: string;
  notSure: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;
  finishOnboarding: string;
  analyzingFarm: string;

  // Crop Planner
  yourCropPlan: string;
  cropPlanDesc: string;
  year1: string;
  year2: string;
  year3: string;
  currentCropBadge: string;
  recommendedBadge: string;
  whyThisCrop: string;
  benefits: string;
  waterNeeded: string;
  growingTime: string;
  soilImpact: string;
  compareScenarios: string;
  bestBalanced: string;
  waterSaver: string;
  repeatCurrent: string;

  // Soil Types
  soilLoamy: string;
  soilSandy: string;
  soilClay: string;
  soilSilty: string;
  soilMixed: string;
  soilUnknown: string;

  // Priorities
  prioritySoil: string;
  priorityWater: string;
  priorityClimate: string;
  priorityYield: string;
  priorityDiversity: string;

  // Ask Terra
  askTerraTitle: string;
  askTerraDesc: string;
  askPlaceholder: string;
  listening: string;
  quickQuestionsTitle: string;
  clearChat: string;
  groundedInYourData: string;

  // Common
  cancel: string;
  save: string;
  resetDemo: string;
  demoModeNotice: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "TerraCrop AI",
    appTagline: "See the climate. Understand your soil. Plan your future.",
    home: "Home",
    farm: "My Farm",
    cropPlan: "Crop Plan",
    askTerra: "Ask Terra",
    climateMap: "Climate Map",
    scenarioLab: "Scenario Lab",
    dataSources: "Data Sources",
    settings: "Settings",
    more: "More",
    guidedSetup: "Guided Setup",

    readAloud: "Read Aloud",
    readingAloud: "Speaking...",
    stopAudio: "Stop Voice",
    textSize: "Text Size",
    normalText: "Normal",
    largeText: "Large",
    extraLargeText: "Extra Large",
    soundGuide: "Listen to farm guidance",

    greeting: "Hello, Farmer!",
    homeSubtitle: "Here is how your farm is doing today.",
    farmConditionGood: "Your farm conditions are looking good.",
    farmConditionAttention: "Your farm needs a little attention.",
    farmConditionDrying: "Water in the soil is lower than usual.",
    waterStatusLabel: "Water in Soil",
    weatherStatusLabel: "Weather & Heat",
    cropHealthLabel: "Crop Greenness",
    waterGood: "Good Water",
    waterModerate: "Medium Water",
    waterLow: "Low Water",
    weatherNormal: "Normal Warmth",
    weatherHot: "Very Warm",
    weatherCool: "Mild / Cool",
    cropHealthy: "Green & Strong",
    cropModerate: "Stable",
    cropStressed: "Needs Water",
    waterExplanationGood: "Soil has enough moisture for steady root absorption.",
    waterExplanationLow: "Recent satellite data shows drier soil than normal for this month.",
    weatherExplanation: "Temperature matches typical seasonal conditions.",
    cropExplanation: "Plant greenness shows healthy vegetative growth across the area.",
    lastUpdated: "Updated today",
    sourceNASA: "NASA Earth Observation",

    chooseNextCrop: "Help Me Choose My Next Crop",
    checkMyFarm: "Check My Farm Details",
    planReadyHeadline: "Your next crop plan is ready",
    seeMyPlan: "See My Crop Plan",
    whyThisPlan: "Why This Plan?",
    askTerraWhy: "Ask Terra Why",
    showTechnicalData: "Show NASA Satellite Numbers",
    hideTechnicalData: "Hide Technical Numbers",

    step: "Step",
    of: "of",
    back: "Back",
    next: "Next",
    skip: "Skip",
    step1Title: "Where is your farm located?",
    step1Desc: "We use this to find the right weather, rainfall, and soil measurements for your land.",
    useMyLocation: "Use Current Location",
    step2Title: "How big is your farm?",
    step2Desc: "Enter the land area you cultivate.",
    acres: "Acres",
    hectares: "Hectares",
    step3Title: "What kind of soil do you have?",
    step3Desc: "Pick the one that feels most like your land. If you're not sure, pick 'Not sure'.",
    notSure: "Not sure",
    step4Title: "What crop are you growing now?",
    step4Desc: "Knowing your current crop helps prevent plant diseases and soil exhaustion.",
    step5Title: "What matters most to you right now?",
    step5Desc: "Choose up to 3 goals for your upcoming seasons.",
    finishOnboarding: "Let's Look at Your Farm",
    analyzingFarm: "Connecting with NASA satellites and preparing your farm plan...",

    yourCropPlan: "Your Crop Plan",
    cropPlanDesc: "Simple, healthy crop choices for your upcoming seasons.",
    year1: "Year 1 (Current)",
    year2: "Year 2 (Next)",
    year3: "Year 3 (Future)",
    currentCropBadge: "Your current crop",
    recommendedBadge: "Suggested next crop",
    whyThisCrop: "Why this crop?",
    benefits: "Key Benefits",
    waterNeeded: "Water Needed",
    growingTime: "Growing Period",
    soilImpact: "Soil Impact",
    compareScenarios: "Compare Plans",
    bestBalanced: "Best Balanced",
    waterSaver: "Save Water",
    repeatCurrent: "Repeat Same Crop",

    soilLoamy: "Loamy (Rich & balanced)",
    soilSandy: "Sandy (Light, drains fast)",
    soilClay: "Clay (Heavy, holds water)",
    soilSilty: "Silty (Fine & smooth)",
    soilMixed: "Mixed Soil",
    soilUnknown: "Not sure yet",

    prioritySoil: "Keep soil healthy",
    priorityWater: "Save water",
    priorityClimate: "Reduce weather risk",
    priorityYield: "Get a good harvest",
    priorityDiversity: "Try different crops",

    askTerraTitle: "Ask Terra — Friendly Farm Helper",
    askTerraDesc: "Ask any question in plain words or with your voice.",
    askPlaceholder: "Ask a question about your farm or crops...",
    listening: "Listening... speak now",
    quickQuestionsTitle: "Tap a quick question:",
    clearChat: "Start Fresh",
    groundedInYourData: "Using your farm's real weather, soil, and crop history.",

    cancel: "Cancel",
    save: "Save Changes",
    resetDemo: "Reset to Demo Farm",
    demoModeNotice: "Working in Zero-Key Demo Mode with real NASA baseline data."
  },
  bn: {
    appName: "টেরাক্রপ এআই",
    appTagline: "আবহাওয়া দেখুন। আপনার মাটি বুঝুন। আগামীর পরিকল্পনা করুন।",
    home: "হোম",
    farm: "আমার খামার",
    cropPlan: "ফসল পরিকল্পনা",
    askTerra: "টেরাকে জিজ্ঞাসা",
    climateMap: "আবহাওয়া মানচিত্র",
    scenarioLab: "পরিস্থিতি পরীক্ষা",
    dataSources: "তথ্যের উৎস",
    settings: "সেটিংস",
    more: "আরও",
    guidedSetup: "সহজ প্রস্তুতি",

    readAloud: "পড়ে শোনান",
    readingAloud: "কথা বলছি...",
    stopAudio: "ভয়েস বন্ধ করুন",
    textSize: "অক্ষরের সাইজ",
    normalText: "স্বাভাবিক",
    largeText: "বড়",
    extraLargeText: "অনেক বড়",
    soundGuide: "পরামর্শ শুনে নিন",

    greeting: "নমস্কার / আসসালামু আলাইকুম, কৃষক ভাই!",
    homeSubtitle: "আজ আপনার খামারের সামগ্রিক অবস্থা কেমন তা নিচে দেখুন।",
    farmConditionGood: "আপনার খামারের অবস্থা বর্তমানে বেশ ভালো দেখাচ্ছে।",
    farmConditionAttention: "আপনার খামারে সামান্য একটু নজর দেওয়া প্রয়োজন।",
    farmConditionDrying: "মাটিতে জলের পরিমাণ স্বাভাবিকের চেয়ে কম রয়েছে।",
    waterStatusLabel: "মাটিতে জল বা আর্দ্রতা",
    weatherStatusLabel: "আবহাওয়া ও তাপ",
    cropHealthLabel: "ফসলের সবুজ সতেজতা",
    waterGood: "পর্যাপ্ত জল",
    waterModerate: "মাঝারি জল",
    waterLow: "কম জল / শুকনো",
    weatherNormal: "স্বাভাবিক উষ্ণতা",
    weatherHot: "বেশি গরম",
    weatherCool: "আরামদায়ক / ঠান্ডা",
    cropHealthy: "সবুজ ও তরতাজা",
    cropModerate: "স্থিতিশীল",
    cropStressed: "যত্ন প্রয়োজন",
    waterExplanationGood: "গাছের শিকড়ে জল পৌঁছানোর মতো পর্যাপ্ত আর্দ্রতা মাটিতে রয়েছে।",
    waterExplanationLow: "স্যাটেলাইট তথ্য অনুযায়ী এই মৌসুমে মাটিতে স্বাভাবিকের চেয়ে কম আর্দ্রতা আছে।",
    weatherExplanation: "বর্তমান তাপমাত্রা এই মৌসুমের স্বাভাবিক মাত্রায় রয়েছে।",
    cropExplanation: "জমির ফসলের ক্যানোপি সুস্থ ও স্বাভাবিক বৃদ্ধির সংকেত দিচ্ছে।",
    lastUpdated: "আজকের তথ্য",
    sourceNASA: "নাসার উপগ্রহ তথ্য",

    chooseNextCrop: "পরবর্তী ফসল বেছে নিতে সাহায্য করুন",
    checkMyFarm: "খামারের বিস্তারিত অবস্থা দেখুন",
    planReadyHeadline: "আপনার পরবর্তী ফসলের পরিকল্পনা প্রস্তুত",
    seeMyPlan: "আমার ফসল পরিকল্পনা দেখুন",
    whyThisPlan: "কেন এই পরিকল্পনা?",
    askTerraWhy: "টেরাকে কারণ জিজ্ঞাসা করুন",
    showTechnicalData: "নাসার স্যাটেলাইট নম্বর দেখুন",
    hideTechnicalData: "কারিগরি তথ্য লুকান",

    step: "ধাপ",
    of: "এর",
    back: "পেছনে",
    next: "পরবর্তী",
    skip: "এড়িয়ে যান",
    step1Title: "আপনার খামার কোথায় অবস্থিত?",
    step1Desc: "সঠিক এলাকার উপগ্রহ তথ্য এবং আবহাওয়া জানার জন্য অবস্থান প্রয়োজন।",
    useMyLocation: "বর্তমান অবস্থান ব্যবহার করুন",
    step2Title: "আপনার খামার কত বড়?",
    step2Desc: "আপনার চাষযোগ্য জমির মোট পরিমাণ লিখুন।",
    acres: "একর",
    hectares: "হেক্টর",
    step3Title: "আপনার জমির মাটি কেমন?",
    step3Desc: "যেটি সবচেয়ে বেশি মেলে সেটি বেছে নিন। না জানলে 'নিশ্চিত নই' বেছে নিন।",
    notSure: "নিশ্চিত নই",
    step4Title: "বর্তমানে আপনি কোন ফসল চাষ করছেন?",
    step4Desc: "বর্তমান ফসল জানা থাকলে রোগবালাই দূর করা ও মাটির উর্বরতা বাড়ানো সহজ হয়।",
    step5Title: "আপনার সবচেয়ে প্রধান লক্ষ্য কী?",
    step5Desc: "পরবর্তী মৌসুমের জন্য আপনার কাঙ্ক্ষিত ১ থেকে ৩টি লক্ষ্য বেছে নিন।",
    finishOnboarding: "আমার খামার দেখুন",
    analyzingFarm: "নাসার স্যাটেলাইটের সাথে সংযুক্ত হচ্ছে এবং খামারের পরিকল্পনা তৈরি হচ্ছে...",

    yourCropPlan: "আপনার ফসল পরিকল্পনা",
    cropPlanDesc: "আপনার জমির জন্য সহজ, লাভজনক ও নিরাপদ ফসলের চক্র।",
    year1: "১ম বছর (বর্তমান)",
    year2: "২য় বছর (পরবর্তী)",
    year3: "৩য় বছর (ভবিষ্যত)",
    currentCropBadge: "বর্তমান ফসল",
    recommendedBadge: "প্রস্তাবিত পরবর্তী ফসল",
    whyThisCrop: "এই ফসল কেন?",
    benefits: "প্রধান সুবিধাসমূহ",
    waterNeeded: "প্রয়োজনীয় জল",
    growingTime: "চাষের সময়",
    soilImpact: "মাটির ওপর প্রভাব",
    compareScenarios: "পরিকল্পনা তুলনা করুন",
    bestBalanced: "সেরা সুষম পরিকল্পনা",
    waterSaver: "কম জলে চাষ",
    repeatCurrent: "একই ফসল বারবার চাষ",

    soilLoamy: "দোআঁশ মাটি (উর্বর ও সুষম)",
    soilSandy: "বেলে মাটি (হালকা, জল ধরে রাখে না)",
    soilClay: "এঁটেল মাটি (ভারী, জল জমে থাকে)",
    soilSilty: "পলি মাটি (নরম ও সূক্ষ্ম)",
    soilMixed: "মিশ্র মাটি",
    soilUnknown: "এখনও নিশ্চিত নই",

    prioritySoil: "মাটির উর্বরতা বাড়ানো",
    priorityWater: "জল বাঁচানো",
    priorityClimate: "আবহাওয়ার ঝুঁকি কমানো",
    priorityYield: "ভালো ফলন পাওয়া",
    priorityDiversity: "ভিন্ন ধরনের ফসল চেষ্টা করা",

    askTerraTitle: "টেরা — আপনার খামার সহযোগী",
    askTerraDesc: "সহজ বাংলায় বা মুখে কথা বলে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।",
    askPlaceholder: "আপনার ফসল বা খামার সম্পর্কে প্রশ্ন লিখুন...",
    listening: "শুনছি... এখন মুখে কথা বলুন",
    quickQuestionsTitle: "একটি প্রশ্নে ট্যাপ করুন:",
    clearChat: "নতুন করে শুরু করুন",
    groundedInYourData: "আপনার খামারের আসল আবহাওয়া, মাটি এবং ফসলের তথ্যের ওপর ভিত্তি করে।",

    cancel: "বাতিল",
    save: "সংরক্ষণ করুন",
    resetDemo: "ডেমো খামারে ফেরত যান",
    demoModeNotice: "বিনামূল্যে ডেমো মোডে নাসার স্যাটেলাইট তথ্য ব্যবহার করছে।"
  }
};
