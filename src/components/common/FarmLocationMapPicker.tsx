import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Search, 
  LocateFixed, 
  Satellite, 
  Layers, 
  Check, 
  AlertCircle, 
  Sparkles,
  Compass,
  X,
  Loader2
} from 'lucide-react';
import { useI18n } from '@/src/lib/i18n/context';

interface FarmLocationMapPickerProps {
  initialLatitude: number;
  initialLongitude: number;
  initialAddress: string;
  initialRegion?: string;
  onLocationChange: (loc: {
    address: string;
    region: string;
    latitude: number;
    longitude: number;
  }) => void;
  showAutoTriggerNotice?: boolean;
}

// Global Agricultural Region Presets & Fallback Coordinates
const AGRO_PRESETS = [
  { name: 'Indo-Gangetic Basin (Bengal Delta)', lat: 23.8103, lon: 90.4125, region: 'Bengal Agro-Climatic Basin', country: 'Bangladesh / India' },
  { name: 'Rangpur & Dinajpur Agro-Belt', lat: 25.7439, lon: 89.2752, region: 'North Bengal Floodplain', country: 'Bangladesh' },
  { name: 'Jessore & Khulna Coastal Zone', lat: 23.1664, lon: 89.2081, region: 'Southern Deltaic Saline-Fresh Zone', country: 'Bangladesh' },
  { name: 'Corn Belt (Iowa, USA)', lat: 41.8780, lon: -93.0977, region: 'Midwest Agricultural Corridor', country: 'United States' },
  { name: 'Central Valley (California, USA)', lat: 36.6500, lon: -119.8500, region: 'California Central Basin', country: 'United States' },
  { name: 'Punjab & Haryana Basin', lat: 30.7333, lon: 76.7794, region: 'Indus-Gangetic Plain', country: 'India' },
  { name: 'Mato Grosso Savanna (Cerrado)', lat: -12.6819, lon: -55.9926, region: 'Cerrado Agricultural Hub', country: 'Brazil' },
  { name: 'Darling Downs (Queensland)', lat: -27.5598, lon: 151.9507, region: 'Queensland Grain Basin', country: 'Australia' }
];

export const FarmLocationMapPicker: React.FC<FarmLocationMapPickerProps> = ({
  initialLatitude,
  initialLongitude,
  initialAddress,
  initialRegion = 'Local Agro-Climatic Zone',
  onLocationChange,
  showAutoTriggerNotice = false
}) => {
  const { language } = useI18n();

  const [addressInput, setAddressInput] = useState(initialAddress);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: initialLatitude,
    lon: initialLongitude
  });

  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('satellite');
  const [isSearching, setIsSearching] = useState(false);
  const [isGpsLocating, setIsGpsLocating] = useState(false);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize and mount Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid double initialization
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lon],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      // Default satellite tile layer with crisp agricultural imagery
      const tileUrl = mapLayer === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 18,
        crossOrigin: true
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Custom animated forest-green SVG pin
      const pinIcon = L.divIcon({
        className: 'custom-farm-pin',
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute -top-1 -left-1 w-11 h-11 bg-[#285C35]/30 rounded-full animate-ping"></span>
            <span class="absolute w-8 h-8 bg-[#36764A]/40 rounded-full"></span>
            <svg width="34" height="42" viewBox="0 0 34 42" fill="none" class="relative filter drop-shadow-md">
              <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="#193D25"/>
              <circle cx="17" cy="17" r="9" fill="#F8F7F0"/>
              <path d="M17 11V23M11 17H23" stroke="#285C35" stroke-width="2.4" stroke-linecap="round"/>
            </svg>
          </div>
        `
      });

      const marker = L.marker([coords.lat, coords.lon], {
        icon: pinIcon,
        draggable: true
      }).addTo(map);

      // Handle map click to reposition marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newLat = Number(e.latlng.lat.toFixed(4));
        const newLon = Number(e.latlng.lng.toFixed(4));
        updatePosition(newLat, newLon, true);
      });

      // Handle marker drag end
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const newLat = Number(pos.lat.toFixed(4));
        const newLon = Number(pos.lng.toFixed(4));
        updatePosition(newLat, newLon, true);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;

      // Invalidate size after container settles
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when layer switch changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const tileUrl = mapLayer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 18,
      crossOrigin: true
    }).addTo(mapInstanceRef.current);
  }, [mapLayer]);

  // Synchronize internal state with coordinates change
  const updatePosition = async (lat: number, lon: number, reverseLookup = false) => {
    setCoords({ lat, lon });
    setHasUserInteracted(true);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], mapInstanceRef.current.getZoom() || 12, {
        animate: true,
        duration: 0.8
      });
    }

    let resolvedAddress = addressInput;
    let resolvedRegion = selectedRegion;

    if (reverseLookup) {
      // Try reverse geocoding via Nominatim
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
          { headers: { 'Accept-Language': language === 'bn' ? 'bn,en' : 'en' } }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.display_name) {
            const parts = data.display_name.split(',');
            const shortName = parts.slice(0, 2).join(',').trim();
            const countryOrState = parts.slice(-2).join(',').trim();
            resolvedAddress = shortName || data.display_name;
            resolvedRegion = countryOrState || `${lat}°, ${lon}°`;
            setAddressInput(resolvedAddress);
            setSelectedRegion(resolvedRegion);
          }
        }
      } catch {
        // Fallback to coordinates label if network offline
        resolvedAddress = `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
        setAddressInput(resolvedAddress);
      }
    }

    onLocationChange({
      address: resolvedAddress,
      region: resolvedRegion,
      latitude: lat,
      longitude: lon
    });
  };

  // Handle GPS location attempt
  const handleGpsDetect = () => {
    setIsGpsLocating(true);
    setGpsErrorMsg(null);

    if (!navigator.geolocation) {
      setGpsErrorMsg(
        language === 'bn'
          ? 'ব্রাউজারে লোকেশন সার্ভিস পাওয়া যায়নি। নিচের নাম লিখে বা মানচিত্রে ক্লিক করে অবস্থান নির্বাচন করুন।'
          : 'Geolocation is unavailable in your browser. Please type your location name or click directly on the map.'
      );
      setIsGpsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(4));
        const newLon = Number(pos.coords.longitude.toFixed(4));
        const defaultName = language === 'bn' ? 'আমার বর্তমান অবস্থান' : 'My Current Location';
        setAddressInput(defaultName);
        updatePosition(newLat, newLon, true);
        setIsGpsLocating(false);
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        setGpsErrorMsg(
          language === 'bn'
            ? 'লোকেশন অনুমতি পাওয়া যায়নি বা অবরুদ্ধ। কোনো সমস্যা নেই! নিচের ঘরে আপনার উপজেলার/খামারের নাম লিখুন অথবা মানচিত্রে ক্লিক করুন।'
            : 'Device location permission is restricted in this preview. Simply type your farm or city name below, or click on the map to place your pin.'
        );
        setIsGpsLocating(false);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  };

  // Handle forward geocoding search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;

    setIsSearching(true);
    setGpsErrorMsg(null);

    // First check our instant agro presets
    const lowerQuery = addressInput.toLowerCase();
    const matchedPreset = AGRO_PRESETS.find(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.region.toLowerCase().includes(lowerQuery) ||
      p.country.toLowerCase().includes(lowerQuery)
    );

    if (matchedPreset) {
      updatePosition(matchedPreset.lat, matchedPreset.lon, false);
      setSelectedRegion(matchedPreset.region);
      onLocationChange({
        address: addressInput,
        region: matchedPreset.region,
        latitude: matchedPreset.lat,
        longitude: matchedPreset.lon
      });
      setIsSearching(false);
      return;
    }

    // Otherwise use OpenStreetMap forward geocoding
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&limit=1`,
        { headers: { 'Accept-Language': language === 'bn' ? 'bn,en' : 'en' } }
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const newLat = Number(parseFloat(item.lat).toFixed(4));
          const newLon = Number(parseFloat(item.lon).toFixed(4));
          const parts = item.display_name.split(',');
          const reg = parts.slice(1, 3).join(',').trim() || 'Agricultural Region';
          setSelectedRegion(reg);
          updatePosition(newLat, newLon, false);
        } else {
          setGpsErrorMsg(
            language === 'bn'
              ? 'স্থানটি খুঁজে পাওয়া যায়নি। অনুগ্রহ করে মানচিত্রে সরাসরি আপনার জমিতে ক্লিক করুন।'
              : 'Could not find that exact location. Please click directly on your farm on the interactive map.'
          );
        }
      }
    } catch {
      setGpsErrorMsg(
        language === 'bn'
          ? 'অনুসন্ধান সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে মানচিত্রে ক্লিক করে অবস্থান চিহ্নিত করুন।'
          : 'Search connection timed out. Please click directly on the interactive map to pin your farm.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyPreset = (preset: typeof AGRO_PRESETS[0]) => {
    setAddressInput(preset.name);
    setSelectedRegion(preset.region);
    updatePosition(preset.lat, preset.lon, false);
    onLocationChange({
      address: preset.name,
      region: preset.region,
      latitude: preset.lat,
      longitude: preset.lon
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Informative notice if device GPS was blocked or unavailable */}
      {(showAutoTriggerNotice || gpsErrorMsg) && (
        <div className="p-3.5 rounded-2xl bg-[#DDE8D8]/70 border border-[#DCE2D8] flex items-start gap-2.5 text-xs text-[#243428] animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#285C35] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-[#193D25]">
              {language === 'bn' ? 'ইন্টারেক্টিভ রিয়েল-টাইম মানচিত্র সক্রিয়:' : 'Interactive Real-Time Map Ready:'}
            </span>{' '}
            <span className="text-[#697568]">
              {gpsErrorMsg || (
                language === 'bn' 
                  ? 'আপনার খামারের নাম বা এলাকা লিখুন, অথবা সরাসরি মানচিত্রে ক্লিক করে আপনার সঠিক জমি চিহ্নিত করুন।' 
                  : 'Type your farm name/region below or click directly on the real-time map to pinpoint your acreage.'
              )}
            </span>
          </div>
          {gpsErrorMsg && (
            <button 
              onClick={() => setGpsErrorMsg(null)} 
              className="text-[#697568] hover:text-[#193D25] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Location Name Input Box & GPS Trigger Bar */}
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <label className="text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em] flex items-center justify-between">
          <span>{language === 'bn' ? 'খামারের অবস্থান বা ঠিকানা লিখুন' : 'Enter Farm Location or Area Name'}</span>
          <span className="font-mono text-[#71966B] font-semibold text-[10px]">
            {coords.lat.toFixed(3)}°N, {coords.lon.toFixed(3)}°E
          </span>
        </label>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: রংপুর, যশোর, দিনাজপুর, বা খামারের নাম...' : 'e.g. Fresno, California or Dinajpur, Bangladesh...'}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[#DCE2D8] bg-white text-sm text-[#243428] placeholder-[#8A9286] focus:outline-none focus:border-[#285C35] focus:ring-2 focus:ring-[#DDE8D8] shadow-2xs transition-all"
            />
            <Search className="w-4 h-4 text-[#8A9286] absolute left-3.5 top-1/2 -translate-y-1/2" />
            {addressInput && (
              <button
                type="button"
                onClick={() => setAddressInput('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A9286] hover:text-[#193D25]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-3 rounded-2xl bg-[#193D25] hover:bg-[#285C35] text-white text-xs font-semibold tracking-wide shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
          </button>

          <button
            type="button"
            onClick={handleGpsDetect}
            disabled={isGpsLocating}
            title="Try Device GPS again"
            className="p-3 rounded-2xl border border-[#DCE2D8] bg-white hover:bg-[#F2F1E8] text-[#193D25] shadow-2xs transition-all flex items-center justify-center cursor-pointer"
          >
            <LocateFixed className={`w-4 h-4 ${isGpsLocating ? 'animate-spin text-[#B9822A]' : 'text-[#285C35]'}`} />
          </button>
        </div>
      </form>

      {/* Real-Time Interactive Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#DCE2D8] bg-[#E8ECE4] shadow-sm">
        {/* Top Floating Controls on Map */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-[400] flex items-center justify-between pointer-events-none gap-2">
          {/* Instruction Pill */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#DCE2D8] text-[10px] sm:text-[11px] font-medium text-[#193D25] shadow-2xs flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-[#36764A] animate-pulse shrink-0" />
            <span className="truncate">{language === 'bn' ? 'জমিতে ক্লিক করুন' : 'Click map to place pin'}</span>
          </div>

          {/* Map Layer Switcher (Satellite vs Street) */}
          <div className="pointer-events-auto flex items-center p-0.5 bg-white/95 backdrop-blur-md rounded-full border border-[#DCE2D8] shadow-2xs text-[10px] sm:text-[11px] shrink-0">
            <button
              type="button"
              onClick={() => setMapLayer('satellite')}
              className={`px-2.5 sm:px-3 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                mapLayer === 'satellite'
                  ? 'bg-[#193D25] text-white shadow-2xs'
                  : 'text-[#697568] hover:text-[#193D25]'
              }`}
            >
              <Satellite className="w-3 h-3" />
              <span>Sat</span>
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('streets')}
              className={`px-2.5 sm:px-3 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                mapLayer === 'streets'
                  ? 'bg-[#193D25] text-white shadow-2xs'
                  : 'text-[#697568] hover:text-[#193D25]'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Leaflet Map DOM Node */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-56 sm:h-72 z-0 cursor-crosshair"
          style={{ minHeight: '220px' }}
        />

        {/* Bottom Floating Coordinates & Verification Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-[400] pointer-events-none flex flex-wrap items-center justify-between gap-1.5">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-[#DCE2D8] shadow-2xs text-xs flex items-center gap-1.5 min-w-0 max-w-[calc(100%-80px)] sm:max-w-xs">
            <MapPin className="w-3.5 h-3.5 text-[#285C35] shrink-0" />
            <div className="font-semibold text-[#193D25] text-[11px] sm:text-xs truncate">
              {addressInput || 'Selected Location'}
            </div>
          </div>

          <div className="pointer-events-auto bg-[#193D25] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 shadow-2xs shrink-0">
            <Check className="w-3 h-3 text-[#DDE8D8]" />
            <span className="hidden xs:inline">NASA Synced</span>
            <span className="xs:hidden">Synced</span>
          </div>
        </div>
      </div>

      {/* Quick Regional Presets for Farmers */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] sm:text-[11px] font-bold text-[#8A9286] uppercase tracking-[0.14em]">
          {language === 'bn' ? 'অথবা এক ক্লিকে কৃষি অঞ্চল বেছে নিন:' : 'Or choose an agricultural region:'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {AGRO_PRESETS.map((preset) => {
            const isSelected = Math.abs(coords.lat - preset.lat) < 0.1 && Math.abs(coords.lon - preset.lon) < 0.1;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-2 sm:p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between min-h-[48px] ${
                  isSelected
                    ? 'border-[#193D25] bg-[#DDE8D8] text-[#193D25] font-semibold shadow-2xs'
                    : 'border-[#DCE2D8] bg-white hover:border-[#71966B]/60 text-[#243428] hover:bg-[#F8F7F0]'
                }`}
              >
                <div className="truncate font-semibold text-[10px] sm:text-[11px] leading-tight">{preset.name.split('(')[0]}</div>
                <div className="text-[9px] sm:text-[10px] text-[#697568] truncate mt-0.5">{preset.country}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
