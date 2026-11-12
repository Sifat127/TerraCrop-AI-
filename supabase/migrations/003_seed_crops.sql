-- Migration 003: Seed agronomic crop catalog
INSERT INTO public.crops (id, name, bengali_name, category, growth_duration_days, water_demand, nitrogen_demand, phosphorus_demand, potassium_demand, soil_improvement_factor, drought_tolerance, market_return_index, icon_name)
VALUES
('rice', 'Rice (Paddy)', 'ধান', 'Cereal', 120, 'High', 'High', 'Medium', 'Medium', 0.35, 0.25, 0.70, 'Wheat'),
('wheat', 'Wheat', 'গম', 'Cereal', 110, 'Medium', 'Medium', 'Medium', 'Medium', 0.50, 0.60, 0.65, 'Wheat'),
('lentil', 'Lentil (Masoor)', 'মসুর ডাল', 'Legume', 95, 'Low', 'Low', 'Low', 'Low', 0.90, 0.75, 0.80, 'Bean'),
('chickpea', 'Chickpea (Gram)', 'ছোলা', 'Legume', 105, 'Low', 'Low', 'Low', 'Low', 0.92, 0.82, 0.78, 'Bean'),
('mustard', 'Mustard / Rapeseed', 'সরিষা', 'Oilseed', 85, 'Low', 'Medium', 'Low', 'Medium', 0.60, 0.65, 0.72, 'Flower2'),
('potato', 'Potato', 'আলু', 'Tuber', 90, 'Medium', 'High', 'High', 'High', 0.40, 0.45, 0.85, 'Sprout'),
('maize', 'Maize / Corn', 'ভুট্টা', 'Cereal', 100, 'Medium', 'High', 'Medium', 'High', 0.45, 0.55, 0.75, 'Wheat'),
('jute', 'Jute (Golden Fiber)', 'পাট', 'Fiber', 120, 'High', 'Medium', 'Low', 'Medium', 0.65, 0.30, 0.68, 'Trees'),
('soybean', 'Soybean', 'সয়াবিন', 'Legume', 105, 'Medium', 'Low', 'Medium', 'Medium', 0.88, 0.70, 0.76, 'Bean'),
('groundnut', 'Groundnut / Peanut', 'বাদাম', 'Legume', 115, 'Low', 'Low', 'Low', 'Medium', 0.85, 0.80, 0.74, 'Bean'),
('mungbean', 'Mung Bean (Moong)', 'মুগ ডাল', 'Legume', 70, 'Low', 'Low', 'Low', 'Low', 0.95, 0.72, 0.82, 'Bean'),
('sunflower', 'Sunflower', 'সূর্যমুখী', 'Oilseed', 95, 'Medium', 'Medium', 'Medium', 'High', 0.58, 0.78, 0.79, 'Sun')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bengali_name = EXCLUDED.bengali_name,
  category = EXCLUDED.category,
  growth_duration_days = EXCLUDED.growth_duration_days,
  water_demand = EXCLUDED.water_demand,
  soil_improvement_factor = EXCLUDED.soil_improvement_factor,
  drought_tolerance = EXCLUDED.drought_tolerance,
  market_return_index = EXCLUDED.market_return_index;
