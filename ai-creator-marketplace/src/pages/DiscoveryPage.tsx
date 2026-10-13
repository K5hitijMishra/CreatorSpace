import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioProject, CreatorProfile, FilterMeta } from '../types';
import { api } from '../api/client';
import { ProjectCard } from '../components/ProjectCard';
import { CreatorCard } from '../components/CreatorCard';
import { FilterBar } from '../components/FilterBar';
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, Compass, Users } from 'lucide-react';

export const DiscoveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'creators'>('projects');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [filterMeta, setFilterMeta] = useState<FilterMeta | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [activeContentType, setActiveContentType] = useState('all');
  const [selectedTool, setSelectedTool] = useState('all');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch filter metadata on mount
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.getFilterMeta();
        setFilterMeta(res.data);
      } catch (err) {
        console.error('Failed to load filter meta:', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch projects and creators based on current filters
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === 'projects') {
          const res = await api.getProjects({
            search,
            contentType: activeContentType,
            tool: selectedTool,
            aspectRatio: selectedAspectRatio,
            sort: selectedSort,
          });
          setProjects(res.data);
        } else {
          const res = await api.getCreators({
            search,
            tool: selectedTool,
          });
          setCreators(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load marketplace content');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 150);

    return () => clearTimeout(timer);
  }, [activeTab, search, activeContentType, selectedTool, selectedAspectRatio, selectedSort]);

  const handleResetFilters = () => {
    setSearch('');
    setActiveContentType('all');
    setSelectedTool('all');
    setSelectedAspectRatio('all');
    setSelectedSort('newest');
  };

  const isFiltered =
    Boolean(search) ||
    activeContentType !== 'all' ||
    selectedTool !== 'all' ||
    selectedAspectRatio !== 'all' ||
    selectedSort !== 'newest';

  return (
    <div className="min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 2-Column Split Hero Section (per portfolio_photography guidelines) */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0a0a10]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px]">
          {/* Left Column: Typographic impact & lead */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-violet-400 tracking-wider uppercase">
                Curated Generative Showcase · Hackathon Module
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-['Outfit'] leading-[1.1] max-w-xl text-balance">
                Architectural Prompts. Verifiable Neural Artworks.
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-lg">
                Discover world-class generative AI artists with transparent step-by-step model workflows, verified tooling pipelines, and transparent commercial-use licensing.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/creators"
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm shadow-violet-900/30"
              >
                <span>Explore Studios</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/architecture"
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs rounded-lg transition-colors border border-zinc-800"
              >
                Inspect Backend MVC
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Container at Matching Height */}
          <div className="lg:col-span-5 relative bg-zinc-950 min-h-[280px] lg:min-h-full overflow-hidden">
            <img
              src="/src/assets/images/hero_cinematic_scifi_1791884151471.jpg"
              alt="Neon Obsidian Cinematic Artwork"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-transparent to-transparent lg:bg-gradient-to-l" />

            <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-lg border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">District 09 Nightfall</p>
                <p className="text-[11px] text-zinc-400">Elena Rostova · Midjourney v6 + ComfyUI</p>
              </div>
              <Link
                to="/projects/prj_01"
                className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1"
              >
                Inspect <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Column KPI Strip in a full-width row below the split */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-zinc-800/80 bg-[#07070b] divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
          <div className="p-4 sm:p-5 text-center sm:text-left">
            <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] tabular-nums">4 Studios</p>
            <p className="text-xs text-zinc-500 mt-0.5">Specialized Creators</p>
          </div>
          <div className="p-4 sm:p-5 text-center sm:text-left">
            <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] tabular-nums">8+ Works</p>
            <p className="text-xs text-zinc-500 mt-0.5">Documented Portfolios</p>
          </div>
          <div className="p-4 sm:p-5 text-center sm:text-left">
            <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] tabular-nums">100% Verified</p>
            <p className="text-xs text-zinc-500 mt-0.5">Workflow Breakdown</p>
          </div>
          <div className="p-4 sm:p-5 text-center sm:text-left">
            <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] tabular-nums">Multi-Model</p>
            <p className="text-xs text-zinc-500 mt-0.5">Flux · SDXL · Midjourney</p>
          </div>
        </div>
      </section>

      {/* Discovery Explorer Controls */}
      <section className="space-y-6">
        {/* Main Tab Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'projects'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Portfolio Projects ({filterMeta?.totalProjects || projects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'creators'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Creator Profiles ({filterMeta?.totalCreators || 4})</span>
            </button>
          </div>

          <div className="text-xs text-zinc-500">
            {activeTab === 'projects' ? (
              <span>Showing {projects.length} neural artworks</span>
            ) : (
              <span>Showing {creators.length} specialized studios</span>
            )}
          </div>
        </div>

        {/* Backend Filtering Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          activeContentType={activeContentType}
          onContentTypeChange={setActiveContentType}
          selectedTool={selectedTool}
          onToolChange={setSelectedTool}
          selectedAspectRatio={selectedAspectRatio}
          onAspectRatioChange={setSelectedAspectRatio}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          availableTools={filterMeta?.aiTools || ['Midjourney v6', 'Flux.1 Pro', 'Stable Diffusion XL', 'ComfyUI', 'Runway Gen-3', 'Magnific AI']}
          contentTypes={filterMeta?.contentTypes ? ['all', ...filterMeta.contentTypes] : undefined}
          onReset={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-white underline hover:no-underline font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#0c0c12] border border-zinc-800/80 rounded-xl overflow-hidden animate-pulse h-80"
              >
                <div className="h-48 bg-zinc-900" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-5 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-900 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Gallery View */}
        {!isLoading && activeTab === 'projects' && (
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <ProjectCard key={proj._id} project={proj} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0a0a0f] rounded-2xl border border-zinc-800/80 p-8">
                <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">No projects match your filter</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Try clearing your search terms or selecting different AI tools and content types.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-violet-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Creators View */}
        {!isLoading && activeTab === 'creators' && (
          <>
            {creators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creators.map((c) => (
                  <CreatorCard key={c._id} creator={c} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0a0a0f] rounded-2xl border border-zinc-800/80 p-8">
                <Users className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">No creators found</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your search criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-violet-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
