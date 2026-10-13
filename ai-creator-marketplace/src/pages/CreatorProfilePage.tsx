import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CreatorProfile, PortfolioProject } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ProjectCard } from '../components/ProjectCard';
import {
  Globe,
  Twitter,
  Instagram,
  MapPin,
  Briefcase,
  Mail,
  Plus,
  Edit3,
  Share2,
  Check,
  Sparkles,
  ArrowLeft,
  X,
  ExternalLink,
} from 'lucide-react';

export const CreatorProfilePage: React.FC = () => {
  const { handleOrId } = useParams<{ handleOrId: string }>();
  const { creator: currentCreator } = useAuth();

  const [creator, setCreator] = useState<(CreatorProfile & { projects: PortfolioProject[] }) | null>(
    null
  );
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inquiry modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    projectScope: '',
    budget: '$1,000 - $3,000',
  });

  // Copied link toast state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!handleOrId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getCreator(handleOrId);
        setCreator(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load creator profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [handleOrId]);

  const isOwner = currentCreator && creator && currentCreator._id === creator._id;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquiryModalOpen(false);
      setInquirySent(false);
      setInquiryForm({ name: '', email: '', projectScope: '', budget: '$1,000 - $3,000' });
    }, 2200);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-64 bg-zinc-900 rounded-2xl" />
        <div className="h-32 bg-zinc-900 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-zinc-900 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Creator Profile Not Found</h2>
        <p className="text-sm text-zinc-400">{error || 'This creator profile does not exist.'}</p>
        <Link
          to="/creators"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Creators Directory</span>
        </Link>
      </div>
    );
  }

  const projects = creator.projects || [];
  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.contentType === activeFilter);

  const contentTypes = ['all', ...Array.from(new Set(projects.map((p) => p.contentType)))];

  return (
    <div className="min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/creators"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Creators Directory</span>
        </Link>
      </div>

      {/* Profile Header Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#0c0c12]">
        {/* Cover Photo Banner */}
        <div className="h-56 sm:h-72 w-full bg-zinc-950 relative overflow-hidden">
          {creator.coverUrl ? (
            <img
              src={creator.coverUrl}
              alt={`${creator.displayName} cover`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-violet-950/40 via-zinc-900 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/40 to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="relative px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-5">
              <img
                src={creator.avatarUrl}
                alt={creator.displayName}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-[#0c0c12] shadow-xl shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
                    {creator.displayName}
                  </h1>
                </div>
                <p className="text-sm text-zinc-400 font-mono">@{creator.handle}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{creator.location}</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span
                    className={`font-medium ${
                      creator.availableForWork ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  >
                    {creator.availableForWork ? 'Available for commissions' : 'Booked'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isOwner ? (
                <>
                  <Link
                    to="/profile/edit"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </Link>
                  <Link
                    to="/projects/new"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleShare}
                    className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
                    title="Share profile link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setInquiryModalOpen(true)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Commission Studio</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio & Details Grid */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bio & Tagline */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-400 font-semibold mb-1">
                  {creator.specialization}
                </p>
                <p className="text-base text-zinc-200 font-medium">{creator.tagline}</p>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">{creator.bio}</p>

              {/* Skills - Zero Pill (Unboxed text with dots) */}
              <div className="pt-2">
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Specialized Skills</p>
                <div className="text-xs text-zinc-300 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {creator.skills.map((skill, index) => (
                    <React.Fragment key={skill}>
                      <span>{skill}</span>
                      {index < creator.skills.length - 1 && (
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar metadata: Rates, AI Tools, Socials */}
            <div className="space-y-5 bg-[#09090d] p-5 rounded-xl border border-zinc-800/60 text-xs">
              {/* AI Tools */}
              <div>
                <p className="text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                  Verified AI Stack
                </p>
                <div className="text-zinc-200 space-y-1">
                  {creator.aiTools.map((tool) => (
                    <div key={tool} className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-violet-400 shrink-0" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rates */}
              {creator.rates && (
                <div className="pt-3 border-t border-zinc-800/80">
                  <p className="text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                    Commercial Rates
                  </p>
                  <div className="space-y-1 text-zinc-300">
                    {creator.rates.hourly && (
                      <p>
                        Hourly Consultation:{' '}
                        <span className="text-white font-semibold">{creator.rates.hourly}</span>
                      </p>
                    )}
                    {creator.rates.projectStartingAt && (
                      <p>
                        Projects starting at:{' '}
                        <span className="text-white font-semibold">
                          {creator.rates.projectStartingAt}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Social links */}
              {creator.socialLinks && (
                <div className="pt-3 border-t border-zinc-800/80">
                  <p className="text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                    External Presence
                  </p>
                  <div className="flex items-center gap-3 text-zinc-400">
                    {creator.socialLinks.website && (
                      <a
                        href={creator.socialLinks.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                        title="Personal Portfolio"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {creator.socialLinks.twitter && (
                      <a
                        href={creator.socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                        title="Twitter / X"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {creator.socialLinks.instagram && (
                      <a
                        href={creator.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Creator's Portfolio Projects Gallery */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-['Outfit']">Studio Portfolio</h2>
            <span className="text-xs text-zinc-500">({projects.length} documented artworks)</span>
          </div>

          {/* Filter tabs */}
          {contentTypes.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {contentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeFilter === type
                      ? 'bg-violet-600 text-white font-semibold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <ProjectCard key={p._id} project={{ ...p, creator }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0a0a0f] rounded-2xl border border-zinc-800/80 p-8">
            <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No projects published yet</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              {isOwner
                ? 'Publish your first generative artwork with step-by-step model workflows!'
                : 'This creator has not published projects under this discipline yet.'}
            </p>
            {isOwner && (
              <Link
                to="/projects/new"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish First Project</span>
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Commission Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f0f16] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Commission {creator.displayName}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Direct inquiry for commercial generative art, look-dev, or cinematic workflows.
              </p>
            </div>

            {inquirySent ? (
              <div className="py-8 text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-white">Inquiry Sent Successfully</p>
                <p className="text-xs text-zinc-400">
                  {creator.displayName} will receive your proposal and response timeline.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Your Name / Agency</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    placeholder="e.g. Sylvan Studios"
                    className="w-full bg-[#151520] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    placeholder="client@company.com"
                    className="w-full bg-[#151520] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Target Budget</label>
                  <select
                    value={inquiryForm.budget}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                    className="w-full bg-[#151520] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                  >
                    <option>$500 - $1,500</option>
                    <option>$1,500 - $3,000</option>
                    <option>$3,000 - $7,500</option>
                    <option>$7,500+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Project Scope & Timeline</label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryForm.projectScope}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, projectScope: e.target.value })}
                    placeholder="Describe the aesthetic, deliverable formats, required AI models, and timeline..."
                    className="w-full bg-[#151520] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg shadow-sm"
                  >
                    Send Commission Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
