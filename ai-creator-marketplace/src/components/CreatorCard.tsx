import React from 'react';
import { Link } from 'react-router-dom';
import { CreatorProfile } from '../types';
import { MapPin, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

interface CreatorCardProps {
  creator: CreatorProfile;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  return (
    <div className="group relative flex flex-col bg-[#0c0c12] rounded-xl border border-zinc-800/80 hover:border-violet-500/50 transition-all duration-200 p-5 shadow-sm justify-between">
      <div>
        {/* Creator Header with Avatar and Availability */}
        <div className="flex items-start gap-4 mb-4">
          <Link
            to={`/creators/@${creator.handle}`}
            className="relative shrink-0 block group-hover:opacity-95"
          >
            <img
              src={creator.avatarUrl}
              alt={creator.displayName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover ring-1 ring-zinc-800 group-hover:ring-violet-500/40 transition-all"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link to={`/creators/@${creator.handle}`} className="block">
              <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                {creator.displayName}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">@{creator.handle}</p>
            </Link>

            {/* Availability Indicator (clean text, no pulsing dot) */}
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span
                className={`font-medium ${
                  creator.availableForWork ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              >
                {creator.availableForWork ? 'Available for commissions' : 'Booked for Q3'}
              </span>
            </div>
          </div>
        </div>

        {/* Tagline & Specialization */}
        <p className="text-xs font-semibold text-violet-400 mb-1">
          {creator.specialization}
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
          {creator.bio}
        </p>

        {/* AI Tools List - Zero Pill Rule (unboxed text separated by dots) */}
        <div className="mb-4 pt-3 border-t border-zinc-800/60">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-1.5">
            Core AI Stack
          </p>
          <div className="text-xs text-zinc-300 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {creator.aiTools.slice(0, 4).map((tool, index) => (
              <React.Fragment key={tool}>
                <span>{tool}</span>
                {index < Math.min(creator.aiTools.length, 4) - 1 && (
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1 text-zinc-400">
          <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
          <span className="tabular-nums">{creator.projectCount || 0} projects</span>
        </div>

        <Link
          to={`/creators/@${creator.handle}`}
          className="inline-flex items-center gap-1 font-semibold text-violet-400 group-hover:text-violet-300 transition-colors"
        >
          <span>Portfolio</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
