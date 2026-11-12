import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trendText: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  explanation: string;
  source?: string;
  lastUpdated?: string;
  sparklineData?: number[];
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  trendText,
  trendDirection = 'neutral',
  explanation,
  source = 'NASA Earth Obs',
  lastUpdated = 'Today',
  sparklineData = [24, 28, 25, 30, 32, 29, 34]
}) => {
  // SVG mini sparkline path
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const width = 80;
  const height = 28;

  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#DCE2D8] shadow-2xs hover:border-[#71966B]/60 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-[#697568] uppercase tracking-[0.1em]">
            {label}
          </span>
          <div className="p-1.5 rounded-lg bg-[#F1F4EF] text-[#193D25]">
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-medium tracking-tight text-[#193D25]">
              {value}
            </span>
            {unit && <span className="text-xs font-medium text-[#8A9286]">{unit}</span>}
          </div>

          {/* Understated mini green sparkline */}
          <div className="w-20 h-7">
            <svg width={width} height={height} className="overflow-visible">
              <polygon points={areaPoints} fill="#DDE8D8" opacity="0.6" />
              <polyline
                fill="none"
                stroke="#285C35"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#DCE2D8]/60 space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-0.5 font-medium text-[#285C35]">
            {trendDirection === 'up' && <ArrowUpRight className="w-3 h-3" />}
            {trendDirection === 'down' && <ArrowDownRight className="w-3 h-3 text-[#B9822A]" />}
            <span className={trendDirection === 'down' ? 'text-[#B9822A]' : 'text-[#285C35]'}>
              {trendText}
            </span>
          </span>
          <span className="text-[10px] text-[#8A9286] font-mono">{source}</span>
        </div>
        <p className="text-[11px] text-[#697568] leading-tight line-clamp-1">{explanation}</p>
      </div>
    </div>
  );
};
