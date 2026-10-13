import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PortfolioProject } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Eye,
  ArrowLeft,
  Share2,
  Check,
  Edit,
  Trash2,
  Maximize2,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  AlertTriangle,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { creator: currentCreator } = useAuth();

  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lightbox full-screen state
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getProject(id);
        setProject(res.data);
        setLikes(res.data.likes);
      } catch (err: any) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const isOwner = Boolean(
    currentCreator && project && currentCreator._id === project.creatorId
  );

  const handleLike = async () => {
    if (!project || hasLiked) return;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    try {
      await api.likeProject(project._id);
    } catch (err) {
      console.error('Failed to like project:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!project) return;
    setIsDeleting(true);
    try {
      await api.deleteProject(project._id);
      navigate(currentCreator ? `/creators/@${currentCreator.handle}` : '/');
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-8 bg-zinc-900 rounded w-48" />
        <div className="aspect-video bg-zinc-900 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-zinc-900 rounded w-3/4" />
            <div className="h-20 bg-zinc-900 rounded" />
          </div>
          <div className="h-48 bg-zinc-900 rounded" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Project Not Found</h2>
        <p className="text-sm text-zinc-400">{error || 'This portfolio project does not exist.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discovery</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-w-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb Navigation & Author Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Showcase</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          {isOwner && (
            <>
              <Link
                to={`/projects/${project._id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 rounded-lg transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Project</span>
              </Link>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cinematic Main Media Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800/80 shadow-2xl group">
        <div className="relative flex items-center justify-center max-h-[75vh] w-full overflow-hidden bg-zinc-950">
          <img
            src={project.mediaUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[75vh] object-contain mx-auto"
          />

          {/* Lightbox full-size toggle button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 p-2.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Inspect Full Resolution"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Media Footer Bar */}
        <div className="p-4 bg-[#0a0a0f] border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Metadata badges - Clean Unboxed */}
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-violet-400 font-semibold">{project.contentType}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>Aspect Ratio: {project.aspectRatio}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>Published {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Views & Likes */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-400 tabular-nums">
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
              <span>{project.views} views</span>
            </span>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                hasLiked
                  ? 'bg-rose-950/40 text-rose-300 border border-rose-900/50'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`}
              />
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Title, Description, Workflow Steps */}
        <div className="lg:col-span-8 space-y-8">
          {/* Project Title and Concept Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-['Outfit']">
              {project.title}
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Workflow Steps Breakdown (CRITICAL REQUIREMENT) */}
          <div className="space-y-4 pt-6 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <h2 className="text-lg font-bold text-white font-['Outfit']">
                  Workflow & Generative Pipeline
                </h2>
              </div>
              <span className="text-xs text-zinc-500">
                {project.workflowSteps.length} Documented Phases
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Verifiable generation timeline detailing prompt calibration, latent structure refinement, upscaling, and grading.
            </p>

            {/* Workflow steps sequence */}
            <div className="space-y-4 pt-2">
              {project.workflowSteps.map((step, idx) => (
                <div
                  key={step.stepNumber || idx}
                  className="relative p-5 rounded-xl bg-[#0c0c12] border border-zinc-800/80 space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-violet-950/60 border border-violet-800/40 text-violet-300 font-mono text-xs font-bold flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                    </div>

                    {/* Tool Tag */}
                    <span className="text-xs font-mono text-violet-400 bg-violet-950/30 px-2 py-0.5 rounded border border-violet-800/30">
                      {step.tool}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed pl-8">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Generation Parameters & Prompt Snippet (if available) */}
          {project.promptDetails && (
            <div className="space-y-3 pt-6 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-violet-400" />
                <h3 className="text-base font-semibold text-white">Generation Parameters</h3>
              </div>

              <div className="bg-[#08080c] rounded-xl p-4 border border-zinc-800/80 font-mono text-xs space-y-3 text-zinc-300">
                {project.promptDetails.promptSnippet && (
                  <div>
                    <span className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1">
                      Prompt Snippet
                    </span>
                    <p className="text-zinc-200 select-all bg-zinc-950 p-2.5 rounded border border-zinc-900 leading-relaxed">
                      {project.promptDetails.promptSnippet}
                    </p>
                  </div>
                )}

                {project.promptDetails.negativePrompt && (
                  <div>
                    <span className="text-zinc-500 block text-[11px] uppercase tracking-wider mb-1">
                      Negative Prompt
                    </span>
                    <p className="text-zinc-400 select-all bg-zinc-950 p-2.5 rounded border border-zinc-900">
                      {project.promptDetails.negativePrompt}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-zinc-400 border-t border-zinc-900">
                  {project.promptDetails.seed && (
                    <div>
                      <span className="text-zinc-500">Seed:</span> {project.promptDetails.seed}
                    </div>
                  )}
                  {project.promptDetails.cfgScale && (
                    <div>
                      <span className="text-zinc-500">CFG Scale:</span>{' '}
                      {project.promptDetails.cfgScale}
                    </div>
                  )}
                  {project.promptDetails.sampler && (
                    <div>
                      <span className="text-zinc-500">Sampler:</span>{' '}
                      {project.promptDetails.sampler}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (4 cols): Creator Info, Commercial License, Tooling */}
        <div className="lg:col-span-4 space-y-6">
          {/* Creator Profile Card */}
          {project.creator && (
            <div className="bg-[#0c0c12] p-5 rounded-xl border border-zinc-800/80 space-y-4">
              <div className="flex items-center gap-3">
                <Link to={`/creators/@${project.creator.handle}`}>
                  <img
                    src={project.creator.avatarUrl}
                    alt={project.creator.displayName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-700"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/creators/@${project.creator.handle}`}
                    className="block font-bold text-white hover:text-violet-300 transition-colors truncate"
                  >
                    {project.creator.displayName}
                  </Link>
                  <p className="text-xs text-zinc-400 font-mono">@{project.creator.handle}</p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {project.creator.tagline}
              </p>

              <div className="pt-2">
                <Link
                  to={`/creators/@${project.creator.handle}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 rounded-lg transition-colors"
                >
                  <span>View Studio Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Commercial Use Disclosure Box (MANDATORY REQUIREMENT) */}
          <div className="bg-[#0c0c12] p-5 rounded-xl border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Commercial License Disclosure
              </h3>
            </div>

            <div className="p-3 bg-[#08080d] rounded-lg border border-zinc-850 space-y-1.5">
              <p className="text-xs font-semibold text-violet-300">
                {project.commercialUseDisclosure}
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {project.commercialUseDisclosure === 'Commercial Use Permitted'
                  ? 'All synthetic training layers and outputs are cleared for commercial brand activations, merchandise, and editorial publishing.'
                  : project.commercialUseDisclosure === 'Editorial / Non-Commercial Only'
                  ? 'Restricted to editorial journalism, research analysis, and educational exhibition. Commercial rights require direct creator agreement.'
                  : 'Contact the studio directly to negotiate bespoke exclusivity, enterprise rights, or high-volume deployment tiers.'}
              </p>
            </div>
          </div>

          {/* AI Tools & Models Verified */}
          <div className="bg-[#0c0c12] p-5 rounded-xl border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Models & Tools Deployed
              </h3>
            </div>

            {/* Zero Pill (Unboxed text with dots) */}
            <div className="text-xs text-zinc-300 flex flex-wrap items-center gap-x-2 gap-y-1.5">
              {project.toolsUsed.map((tool, idx) => (
                <React.Fragment key={tool}>
                  <span>{tool}</span>
                  {idx < project.toolsUsed.length - 1 && (
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Project Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="p-5 rounded-xl bg-[#0c0c12] border border-zinc-800/80 text-xs space-y-2">
              <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[11px] block">
                Tags & Descriptors
              </span>
              <div className="flex flex-wrap gap-1.5 text-zinc-400">
                {project.tags.map((tag) => (
                  <span key={tag} className="bg-zinc-900 px-2 py-0.5 rounded text-[11px]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={project.mediaUrl}
            alt={project.title}
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f16] border border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Portfolio Project?</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{project.title}"</strong>? This will permanently remove this project and its workflow documentation.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
