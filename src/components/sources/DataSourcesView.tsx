import React from 'react';
import { 
  Database, 
  Satellite, 
  Sun, 
  Layers, 
  Sprout, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Info
} from 'lucide-react';
import { DataSourceInfo } from '@/src/types';
import { useI18n } from '@/src/lib/i18n/context';

interface DataSourcesViewProps {
  sources: DataSourceInfo[];
}

export const DataSourcesView: React.FC<DataSourcesViewProps> = ({ sources }) => {
  const { language } = useI18n();

  const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    'NASA Earth Observation': Satellite,
    'Weather & Climate': Sun,
    'Soil Database': Layers,
    'Crop Knowledge': Sprout,
    'AI & Optimization': Sparkles,
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-7 bg-[#F1F4EF] min-h-full">
      {/* Header */}
      <div className="pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#71966B] uppercase tracking-[0.14em] mb-1">
          <Database className="w-4 h-4" />
          <span>{language === 'bn' ? 'বৈজ্ঞানিক তথ্যের স্বচ্ছতা' : 'Scientific Provenance & Audit Trail'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#193D25] tracking-tight">
          {language === 'bn' ? 'তথ্যের উৎস ও স্যাটেলাইট সংযোগ' : 'Data Sources & Telemetry Transparency'}
        </h2>
        <p className="text-xs sm:text-sm text-[#697568] mt-1 max-w-3xl leading-relaxed">
          {language === 'bn'
            ? 'টেরাক্রপ এআই সরাসরি নাসার ওপেন সায়েন্স এবং বৈজ্ঞানিক পর্যবেক্ষণ ব্যবহার করে। কোনো কাল্পনিক বা অসত্য তথ্য দেখানো হয় না।'
            : 'TerraCrop AI maintains complete transparency over every data stream. We never fabricate sensor readings or claim live connectivity where models or benchmarks are in use.'}
        </p>
      </div>

      {/* Truth in Provenance Card — Warm Cream Adaline Style */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DCE2D8] flex items-start gap-4 shadow-2xs">
        <div className="p-2.5 rounded-xl bg-[#DDE8D8] text-[#193D25] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-semibold text-sm text-[#193D25]">Full Agro-Climatic Traceability</div>
          <p className="text-[#697568] leading-relaxed">
            Data indicators below specify exact spatial resolution, orbital repeat frequencies, and specific influence on the deterministic rotation optimizer.
          </p>
        </div>
      </div>

      {/* Grid of Data Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sources.map((src) => {
          const Icon = categoryIcons[src.category] || Database;
          return (
            <div
              key={src.id}
              className="bg-white rounded-2xl p-6 border border-[#DCE2D8] shadow-2xs hover:border-[#71966B]/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE2D8]/70 mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#697568]">
                    <Icon className="w-4 h-4 text-[#71966B]" />
                    <span>{src.category}</span>
                  </div>

                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold ${
                    src.status === 'Live API'
                      ? 'bg-[#DDE8D8] text-[#193D25]'
                      : 'bg-[#F2F1E8] text-[#697568]'
                  }`}>
                    {src.status}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#193D25] mb-1 leading-snug">
                  {src.name}
                </h3>
                <div className="text-xs text-[#697568] font-medium mb-3">
                  Provider: <span className="text-[#243428] font-semibold">{src.provider}</span>
                </div>

                <p className="text-xs text-[#697568] leading-relaxed mb-4">
                  {src.description}
                </p>

                {/* Specs Box */}
                <div className="p-3.5 bg-[#F8F7F0] rounded-xl border border-[#DCE2D8] space-y-2 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#697568] font-medium">Data Type:</span>
                    <span className="text-[#243428] font-medium text-right max-w-[200px] truncate">{src.dataType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697568] font-medium">Spatial Resolution:</span>
                    <span className="text-[#243428] font-mono">{src.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697568] font-medium">Cadence / Latency:</span>
                    <span className="text-[#243428]">{src.frequency}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Role in Optimization */}
              <div className="pt-3 border-t border-[#DCE2D8]/70 text-xs">
                <div className="text-[11px] font-bold text-[#8A9286] uppercase tracking-wider mb-1">
                  Engine Utilization
                </div>
                <p className="text-[11px] text-[#697568] leading-normal">
                  {src.influenceOnPlan}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
