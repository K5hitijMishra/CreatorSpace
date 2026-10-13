import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeContentType: string;
  onContentTypeChange: (value: string) => void;
  selectedTool: string;
  onToolChange: (value: string) => void;
  selectedAspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  availableTools: string[];
  contentTypes?: string[];
  onReset: () => void;
  isFiltered: boolean;
}

const DEFAULT_CONTENT_TYPES = [
  'all',
  'Concept Art',
  'Cinematic Film',
  'Editorial Fashion',
  'Architecture',
];

const ASPECT_RATIOS = ['all', '16:9', '4:3', '1:1', '3:4'];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  activeContentType,
  onContentTypeChange,
  selectedTool,
  onToolChange,
  selectedAspectRatio,
  onAspectRatioChange,
  selectedSort,
  onSortChange,
  availableTools,
  contentTypes = DEFAULT_CONTENT_TYPES,
  onReset,
  isFiltered,
}) => {
  return (
    <div className="space-y-3 bg-[#0a0a0f] p-4 rounded-xl border border-zinc-800/80">
      {/* Top Row: Search input + Select controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects, prompts, tools, or tags..."
            className="w-full bg-[#12121a] border border-zinc-800 text-white placeholder-zinc-500 text-sm rounded-lg pl-10 pr-9 py-2 focus:outline-none focus:border-violet-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Tool Dropdown */}
          <div className="relative">
            <select
              value={selectedTool}
              onChange={(e) => onToolChange(e.target.value)}
              className="bg-[#12121a] border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All AI Tools</option>
              {availableTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>

          {/* Aspect Ratio */}
          <select
            value={selectedAspectRatio}
            onChange={(e) => onAspectRatioChange(e.target.value)}
            className="bg-[#12121a] border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            <option value="all">All Ratios</option>
            {ASPECT_RATIOS.filter((r) => r !== 'all').map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-[#12121a] border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-violet-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Liked</option>
              <option value="views">Most Viewed</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-950/30 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Segmented Content Type Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-xs font-medium text-zinc-500 mr-2 shrink-0">Discipline:</span>
        {contentTypes.map((type) => {
          const isActive = activeContentType === type;
          const label = type === 'all' ? 'All Works' : type;
          return (
            <button
              key={type}
              onClick={() => onContentTypeChange(type)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-violet-600 text-white font-semibold shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
