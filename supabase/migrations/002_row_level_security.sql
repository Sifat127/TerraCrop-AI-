-- Migration 002: Row Level Security (RLS) & Security Hardening
-- Enforces strict user isolation across all tables.

-- Enable RLS on every user-facing table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_decisions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can read their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Farms Policies
CREATE POLICY "Users can view their own farms"
    ON public.farms FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own farms"
    ON public.farms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms"
    ON public.farms FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farms"
    ON public.farms FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Plots Policies (Inherited from farm ownership)
CREATE POLICY "Users can view plots belonging to their farms"
    ON public.plots FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = plots.farm_id AND f.user_id = auth.uid()));

CREATE POLICY "Users can insert plots for their farms"
    ON public.plots FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = plots.farm_id AND f.user_id = auth.uid()));

CREATE POLICY "Users can update plots for their farms"
    ON public.plots FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = plots.farm_id AND f.user_id = auth.uid()));

CREATE POLICY "Users can delete plots for their farms"
    ON public.plots FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = plots.farm_id AND f.user_id = auth.uid()));

-- 4. Crop History Policies
CREATE POLICY "Users can manage crop history of their farms"
    ON public.crop_history FOR ALL
    USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = crop_history.farm_id AND f.user_id = auth.uid()));

-- 5. Crops (Public Global Catalog - Read Only for Authenticated & Anon)
CREATE POLICY "Anyone can view crops catalog"
    ON public.crops FOR SELECT
    USING (true);

-- 6. Rotation Plans Policies
CREATE POLICY "Users can view rotation plans of their farms"
    ON public.rotation_plans FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = rotation_plans.farm_id AND f.user_id = auth.uid()));

CREATE POLICY "Users can insert rotation plans for their farms"
    ON public.rotation_plans FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = rotation_plans.farm_id AND f.user_id = auth.uid()));

CREATE POLICY "Users can update rotation plans of their farms"
    ON public.rotation_plans FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = rotation_plans.farm_id AND f.user_id = auth.uid()));

CREATE POLICY "Users can delete rotation plans of their farms"
    ON public.rotation_plans FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = rotation_plans.farm_id AND f.user_id = auth.uid()));

-- 7. Rotation Items Policies
CREATE POLICY "Users can manage rotation items of their plans"
    ON public.rotation_items FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.rotation_plans p 
        JOIN public.farms f ON f.id = p.farm_id 
        WHERE p.id = rotation_items.plan_id AND f.user_id = auth.uid()
    ));

-- 8. Scenarios Policies
CREATE POLICY "Users can manage scenarios of their farms"
    ON public.scenarios FOR ALL
    USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = scenarios.farm_id AND f.user_id = auth.uid()));

-- 9. Scenario Results Policies
CREATE POLICY "Users can manage scenario results of their farms"
    ON public.scenario_results FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.scenarios s
        JOIN public.farms f ON f.id = s.farm_id
        WHERE s.id = scenario_results.scenario_id AND f.user_id = auth.uid()
    ));

-- 10. Environmental Snapshots Policies
CREATE POLICY "Users can view environmental snapshots of their farms"
    ON public.environmental_snapshots FOR SELECT
    USING (farm_id IS NULL OR EXISTS (SELECT 1 FROM public.farms f WHERE f.id = environmental_snapshots.farm_id AND f.user_id = auth.uid()));

CREATE POLICY "Users can insert environmental snapshots for their farms"
    ON public.environmental_snapshots FOR INSERT
    WITH CHECK (farm_id IS NULL OR EXISTS (SELECT 1 FROM public.farms f WHERE f.id = environmental_snapshots.farm_id AND f.user_id = auth.uid()));

-- 11. AI Conversations Policies
CREATE POLICY "Users can manage their own AI conversations"
    ON public.ai_conversations FOR ALL
    USING (auth.uid() = user_id);

-- 12. AI Messages Policies
CREATE POLICY "Users can manage their own AI messages"
    ON public.ai_messages FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.ai_conversations c 
        WHERE c.id = ai_messages.conversation_id AND c.user_id = auth.uid()
    ));

-- 13. Game Progress Policies
CREATE POLICY "Users can view their own game progress"
    ON public.game_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game progress"
    ON public.game_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game progress"
    ON public.game_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- 14. Game Decisions Policies
CREATE POLICY "Users can manage their own game decisions"
    ON public.game_decisions FOR ALL
    USING (auth.uid() = user_id);

-- Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  );
  
  -- Create initial game progress for the new farmer
  INSERT INTO public.game_progress (user_id, farm_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'farm_name', 'Terra Farm')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
