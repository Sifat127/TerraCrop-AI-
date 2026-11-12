-- Migration 001: TerraCrop AI Core Normalized Schema
-- Covers: profiles, farms, plots, crop_history, crops, rotation_plans, 
-- rotation_items, scenarios, scenario_results, environmental_snapshots, 
-- ai_conversations, ai_messages, game_progress, game_decisions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    phone_number TEXT,
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'bn')),
    experience_years INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. FARMS
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    region_name VARCHAR(255) NOT NULL DEFAULT 'Unknown Region',
    size_value NUMERIC(10, 2) NOT NULL DEFAULT 10.0,
    size_unit VARCHAR(20) NOT NULL DEFAULT 'acres' CHECK (size_unit IN ('acres', 'hectares', 'bigha')),
    soil_type VARCHAR(100) NOT NULL DEFAULT 'Loamy',
    current_crop_id VARCHAR(50) NOT NULL DEFAULT 'rice',
    previous_crop_id VARCHAR(50) NOT NULL DEFAULT 'wheat',
    water_availability VARCHAR(50) NOT NULL DEFAULT 'Medium' CHECK (water_availability IN ('Low', 'Medium', 'High', 'Abundant')),
    irrigation_available BOOLEAN NOT NULL DEFAULT true,
    priorities TEXT[] NOT NULL DEFAULT ARRAY['Improve soil health', 'Save water'],
    planning_horizon_years INTEGER NOT NULL DEFAULT 3,
    is_primary BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PLOTS
CREATE TABLE IF NOT EXISTS public.plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    area_value NUMERIC(10, 2) NOT NULL,
    soil_texture VARCHAR(100),
    drainage_quality VARCHAR(50) DEFAULT 'Moderate',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CROP HISTORY
CREATE TABLE IF NOT EXISTS public.crop_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.plots(id) ON DELETE SET NULL,
    season_year INTEGER NOT NULL,
    season_name VARCHAR(50) NOT NULL,
    crop_id VARCHAR(50) NOT NULL,
    yield_recorded NUMERIC(10, 2),
    yield_unit VARCHAR(50) DEFAULT 'tons/ha',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CROPS (Global Reference Catalog)
CREATE TABLE IF NOT EXISTS public.crops (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bengali_name VARCHAR(150),
    category VARCHAR(50) NOT NULL,
    growth_duration_days INTEGER NOT NULL,
    water_demand VARCHAR(20) NOT NULL,
    nitrogen_demand VARCHAR(20) NOT NULL,
    phosphorus_demand VARCHAR(20) NOT NULL,
    potassium_demand VARCHAR(20) NOT NULL,
    soil_improvement_factor NUMERIC(3, 2) NOT NULL DEFAULT 0.5,
    drought_tolerance NUMERIC(3, 2) NOT NULL DEFAULT 0.5,
    market_return_index NUMERIC(3, 2) NOT NULL DEFAULT 0.5,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ROTATION PLANS
CREATE TABLE IF NOT EXISTS public.rotation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    strategy VARCHAR(50) NOT NULL DEFAULT 'AI Optimized',
    horizon_years INTEGER NOT NULL DEFAULT 3,
    overall_score NUMERIC(5, 2) NOT NULL DEFAULT 85.0,
    soil_health_score NUMERIC(5, 2) NOT NULL DEFAULT 80.0,
    water_efficiency_score NUMERIC(5, 2) NOT NULL DEFAULT 78.0,
    economic_stability_score NUMERIC(5, 2) NOT NULL DEFAULT 82.0,
    climate_resilience_score NUMERIC(5, 2) NOT NULL DEFAULT 84.0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ROTATION ITEMS
CREATE TABLE IF NOT EXISTS public.rotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.rotation_plans(id) ON DELETE CASCADE,
    year_index INTEGER NOT NULL,
    season_name VARCHAR(50) NOT NULL,
    crop_id VARCHAR(50) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    rationale TEXT NOT NULL,
    soil_impact_summary TEXT,
    water_need_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. SCENARIOS
CREATE TABLE IF NOT EXISTS public.scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    rainfall_change_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    temperature_change_c NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    water_availability_override VARCHAR(50),
    primary_priority_override VARCHAR(100),
    is_preset BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. SCENARIO RESULTS
CREATE TABLE IF NOT EXISTS public.scenario_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
    crop_id VARCHAR(50) NOT NULL,
    viability_score NUMERIC(5, 2) NOT NULL,
    water_stress_index NUMERIC(5, 2) NOT NULL,
    economic_risk_level VARCHAR(50) NOT NULL,
    recommended_mitigation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. ENVIRONMENTAL SNAPSHOTS (NASA Earth Observations Telemetry)
CREATE TABLE IF NOT EXISTS public.environmental_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    soil_moisture_m3 NUMERIC(6, 4) NOT NULL,
    soil_temperature_c NUMERIC(5, 2) NOT NULL,
    solar_radiation_mj NUMERIC(6, 2) NOT NULL,
    precipitation_7d_mm NUMERIC(6, 2) NOT NULL,
    ndvi_vegetation_index NUMERIC(4, 3) NOT NULL,
    drought_index_spei NUMERIC(4, 2) NOT NULL,
    frost_risk_days INTEGER NOT NULL DEFAULT 0,
    data_source_provider VARCHAR(100) DEFAULT 'NASA POWER + SMAP + MODIS',
    raw_payload JSONB DEFAULT '{}'::jsonb
);

-- 11. AI CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Agronomic Consultation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. AI MESSAGES
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    referenced_sources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. GAME PROGRESS (2D Farm Simulation)
CREATE TABLE IF NOT EXISTS public.game_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name VARCHAR(150) NOT NULL DEFAULT 'Sunny Acres',
    day_count INTEGER NOT NULL DEFAULT 1,
    current_season VARCHAR(20) NOT NULL DEFAULT 'Spring',
    coins INTEGER NOT NULL DEFAULT 120,
    soil_health_meter NUMERIC(5, 2) NOT NULL DEFAULT 75.0,
    water_reserve_liters NUMERIC(10, 2) NOT NULL DEFAULT 1000.0,
    inventory JSONB NOT NULL DEFAULT '{"seeds": {"rice": 10, "wheat": 5}, "harvest": {}}'::jsonb,
    farm_grid JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. GAME DECISIONS
CREATE TABLE IF NOT EXISTS public.game_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_day INTEGER NOT NULL,
    season VARCHAR(20) NOT NULL,
    decision_type VARCHAR(100) NOT NULL,
    crop_selected VARCHAR(50),
    climate_condition VARCHAR(100),
    soil_impact NUMERIC(5, 2),
    coin_delta INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_plots_farm_id ON public.plots(farm_id);
CREATE INDEX IF NOT EXISTS idx_crop_history_farm_id ON public.crop_history(farm_id);
CREATE INDEX IF NOT EXISTS idx_rotation_plans_farm_id ON public.rotation_plans(farm_id);
CREATE INDEX IF NOT EXISTS idx_rotation_items_plan_id ON public.rotation_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_farm_id ON public.scenarios(farm_id);
CREATE INDEX IF NOT EXISTS idx_env_snapshots_farm_id ON public.environmental_snapshots(farm_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv_id ON public.ai_messages(conversation_id);
