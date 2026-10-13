import React, { useState, useEffect } from 'react';
import { CreatorProfile, FilterMeta } from '../types';
import { api } from '../api/client';
import { CreatorCard } from '../components/CreatorCard';
import { Search, X, Check, Users, Sparkles, Filter } from 'lucide-react';

export const CreatorsPage: React.FC = () => {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [filterMeta, setFilterMeta] = useState<FilterMeta | null>(null);

  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedTool, setSelectedTool] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.getFilterMeta();
        setFilterMeta(res.data);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const fetchCreators = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getCreators({
          search,
          specialization: selectedSpecialization,
          tool: selectedTool,
          availableOnly,
        });
        setCreators(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load creators');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCreators();
    }, 150);

    return () => clearTimeout(timer);
  }, [search, selectedSpecialization, selectedTool, availableOnly]);

  const handleReset = () => {
    setSearch('');
    setSelectedSpecialization('all');
    setSelectedTool('all');
    setAvailableOnly(false);
  };

  const isFiltered = Boolean(search) || selectedSpecialization !== 'all' || selectedTool !== 'all' || availableOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
          Creator Directory · Verified Studios
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-['Outfit']">
          AI Creators & Visual Directors
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Connect directly with specialized generative artists mastering cinematic diffusion, procedural 3D pipelines, custom LoRA architectures, and commercial fashion aesthetics.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-[#0a0a0f] p-4 rounded-xl border border-zinc-800/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, handle, bio, or skills..."
              className="w-full bg-[#12121a] border border-zinc-800 text-white placeholder-zinc-500 text-sm rounded-lg pl-10 pr-9 py-2 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialization Filter */}
          <div>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full bg-[#12121a] border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="all">All Specializations</option>
              {filterMeta?.specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* AI Tool Filter */}
          <div>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full bg-[#12121a] border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="all">All AI Tools</option>
              {filterMeta?.aiTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Availability toggle & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-850 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300 hover:text-white">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-violet-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Show only creators currently available for commissions</span>
          </label>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Creators */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#0c0c12] border border-zinc-800/80 rounded-xl p-6 h-56 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-zinc-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-zinc-900 rounded w-1/4" />
                </div>
              </div>
              <div className="h-3 bg-zinc-900 rounded w-full" />
              <div className="h-3 bg-zinc-900 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creators.map((c) => (
            <CreatorCard key={c._id} creator={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0a0a0f] rounded-2xl border border-zinc-800/80 p-8">
          <Users className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No creators match your search</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Try adjusting your specialization or tool filters.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 text-xs font-semibold text-violet-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
