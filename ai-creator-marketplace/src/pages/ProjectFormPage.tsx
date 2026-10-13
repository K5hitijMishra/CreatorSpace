import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { WorkflowStep, PortfolioProject } from '../types';
import {
  Upload,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  Layers,
  ShieldCheck,
  Image as ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const COMMON_AI_TOOLS = [
  'Flux.1 Pro',
  'Midjourney v6',
  'Stable Diffusion XL',
  'ComfyUI',
  'Runway Gen-3',
  'Magnific AI',
  'Kling 1.5',
  'Photoshop Beta',
  'ElevenLabs',
  'Topaz Video AI',
];

const PRESET_ARTWORKS = [
  {
    name: 'District 09 Sci-Fi',
    url: '/src/assets/images/hero_cinematic_scifi_1791884151471.jpg',
  },
  {
    name: 'Alpine Bioluminescence',
    url: '/src/assets/images/portfolio_surreal_nature_1791884151544.jpg',
  },
  {
    name: 'Iridescent Fashion',
    url: '/src/assets/images/portfolio_cyber_fashion_1791884153082.jpg',
  },
  {
    name: 'Brutalist Obelisk',
    url: '/src/assets/images/portfolio_architectural_void_1791884152534.jpg',
  },
];

export const ProjectFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { creator, isAuthenticated } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1' | '9:16' | '3:4'>('16:9');
  const [contentType, setContentType] = useState<
    'Concept Art' | 'Cinematic Film' | 'Editorial Fashion' | 'Architecture' | 'Character Design' | 'Motion Graphic'
  >('Concept Art');
  const [toolsUsed, setToolsUsed] = useState<string[]>(['Flux.1 Pro']);
  const [customTool, setCustomTool] = useState('');
  const [commercialUseDisclosure, setCommercialUseDisclosure] = useState<
    'Commercial Use Permitted' | 'Editorial / Non-Commercial Only' | 'Custom License Upon Request'
  >('Commercial Use Permitted');

  // Workflow steps
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      stepNumber: 1,
      title: 'Latent Composition Ideation',
      tool: 'Flux.1 Pro',
      description: 'Explored prompt seeds and cinematic lighting angles.',
    },
    {
      stepNumber: 2,
      title: 'Neural Upscale & Texture Detailing',
      tool: 'Magnific AI',
      description: 'Applied 4x detail magnification for fine surface resolution.',
    },
  ]);

  // Generation parameters
  const [promptSnippet, setPromptSnippet] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState('');
  const [cfgScale, setCfgScale] = useState<number | undefined>(undefined);

  // Tags
  const [tagsInput, setTagsInput] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If editing, load existing project
  useEffect(() => {
    if (!isEditing || !id) return;
    const loadProject = async () => {
      try {
        const res = await api.getProject(id);
        const p = res.data;
        setTitle(p.title);
        setDescription(p.description);
        setMediaUrl(p.mediaUrl);
        setAspectRatio(p.aspectRatio);
        setContentType(p.contentType);
        setToolsUsed(p.toolsUsed);
        setCommercialUseDisclosure(p.commercialUseDisclosure);
        setWorkflowSteps(p.workflowSteps || []);
        if (p.promptDetails) {
          setPromptSnippet(p.promptDetails.promptSnippet || '');
          setNegativePrompt(p.promptDetails.negativePrompt || '');
          setSeed(p.promptDetails.seed || '');
          setCfgScale(p.promptDetails.cfgScale);
        }
        setTagsInput((p.tags || []).join(', '));
      } catch (err: any) {
        setError(err.message || 'Failed to load project for editing');
      }
    };
    loadProject();
  }, [id, isEditing]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const res = await api.uploadMedia(file);
      setMediaUrl(res.data.url);
    } catch (err: any) {
      setError(err.message || 'Media upload failed. You can paste an image URL directly.');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleTool = (tool: string) => {
    if (toolsUsed.includes(tool)) {
      setToolsUsed(toolsUsed.filter((t) => t !== tool));
    } else {
      setToolsUsed([...toolsUsed, tool]);
    }
  };

  const handleAddCustomTool = () => {
    if (!customTool.trim()) return;
    if (!toolsUsed.includes(customTool.trim())) {
      setToolsUsed([...toolsUsed, customTool.trim()]);
    }
    setCustomTool('');
  };

  const handleAddStep = () => {
    const nextStepNum = workflowSteps.length + 1;
    setWorkflowSteps([
      ...workflowSteps,
      {
        stepNumber: nextStepNum,
        title: `Workflow Phase ${nextStepNum}`,
        tool: toolsUsed[0] || 'Midjourney v6',
        description: '',
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    const updated = workflowSteps.filter((_, i) => i !== index);
    const reindexed = updated.map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
    setWorkflowSteps(reindexed);
  };

  const handleStepChange = (index: number, field: keyof WorkflowStep, value: any) => {
    const updated = [...workflowSteps];
    updated[index] = { ...updated[index], [field]: value };
    setWorkflowSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !mediaUrl.trim()) {
      setError('Please provide a title, description, and media image.');
      return;
    }

    if (toolsUsed.length === 0) {
      setError('Please select or specify at least one AI tool.');
      return;
    }

    if (workflowSteps.length === 0) {
      setError('Please provide at least one workflow generation step.');
      return;
    }

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const projectPayload: Partial<PortfolioProject> = {
      title,
      description,
      mediaUrl,
      mediaType: 'image',
      aspectRatio,
      contentType,
      toolsUsed,
      workflowSteps,
      commercialUseDisclosure,
      promptDetails: {
        promptSnippet,
        negativePrompt,
        seed,
        cfgScale: cfgScale ? Number(cfgScale) : undefined,
      },
      tags,
    };

    try {
      if (isEditing && id) {
        await api.updateProject(id, projectPayload);
        navigate(`/projects/${id}`);
      } else {
        const res = await api.createProject(projectPayload);
        navigate(`/projects/${res.data._id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save project. Ensure all fields are filled.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !creator) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-800/40 text-violet-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white font-['Outfit']">
          Creator Authentication Required
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          You need to be signed in as a registered creator to publish and document neural portfolio works.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg shadow-sm"
          >
            Sign In with Demo Creator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={isEditing ? `/projects/${id}` : '/'}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
            {isEditing ? 'Edit Portfolio Artwork' : 'Publish Neural Artwork'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Document your generation pipeline, model provenance, and commercial licensing terms.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Media Asset & Preview */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Artwork Media Asset
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Input & Upload */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Cloudinary / Image File Upload
                </label>
                <div className="border border-dashed border-zinc-800 hover:border-violet-500/60 rounded-xl p-5 text-center bg-[#09090e] transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/mp4"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
                  <p className="text-zinc-300 font-medium">
                    {isUploading ? 'Uploading to Cloudinary...' : 'Click or drop visual file here'}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    PNG, JPG, WebP up to 15MB.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Or Direct Image / CDN URL
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /src/assets/images/..."
                  className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Quick Presets Picker */}
              <div>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Or pick a generated benchmark asset:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_ARTWORKS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setMediaUrl(preset.url)}
                      className={`text-left p-2 rounded-lg border text-[11px] transition-colors ${
                        mediaUrl === preset.url
                          ? 'border-violet-500 bg-violet-950/30 text-white font-medium'
                          : 'border-zinc-850 bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Media Preview Box */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 flex flex-col items-center justify-center min-h-[220px] relative">
              {mediaUrl ? (
                <img
                  src={mediaUrl}
                  alt="Live Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[300px] object-contain"
                />
              ) : (
                <div className="text-center p-6 text-zinc-600">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Visual preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Core Project Metadata */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4 text-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Concept & Visual Metadata
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neon Obsidian: District 09 Nightfall"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Content Discipline</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Concept Art">Concept Art</option>
                <option value="Cinematic Film">Cinematic Film</option>
                <option value="Editorial Fashion">Editorial Fashion</option>
                <option value="Architecture">Architecture</option>
                <option value="Character Design">Character Design</option>
                <option value="Motion Graphic">Motion Graphic</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              >
                <option value="16:9">16:9 (Landscape Cinematic)</option>
                <option value="4:3">4:3 (Editorial Standard)</option>
                <option value="1:1">1:1 (Square Showcase)</option>
                <option value="3:4">3:4 (Portrait Fashion)</option>
                <option value="9:16">9:16 (Vertical Mobile Reel)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">
                Conceptual Description & Narrative
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the aesthetic thesis, atmospheric intent, and technical hurdles solved..."
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 3: AI Tools & Models */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              AI Tools & Models Deployed
            </h2>
            <span className="text-zinc-500">{toolsUsed.length} tools selected</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {COMMON_AI_TOOLS.map((tool) => {
              const isSelected = toolsUsed.includes(tool);
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {tool}
                </button>
              );
            })}
          </div>

          {/* Add custom tool */}
          <div className="flex items-center gap-2 pt-2 max-w-sm">
            <input
              type="text"
              value={customTool}
              onChange={(e) => setCustomTool(e.target.value)}
              placeholder="Add other model (e.g. Wan2.1, Luma)..."
              className="flex-1 bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={handleAddCustomTool}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        {/* Section 4: Workflow Steps Builder (MANDATORY REQUIREMENT) */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                Verifiable Workflow Phases
              </h2>
              <p className="text-zinc-400 mt-0.5">
                Breakdown of how this asset was engineered from prompting through post-processing.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phase</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {workflowSteps.map((step, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#09090e] border border-zinc-800/80 space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded bg-violet-950/80 border border-violet-800/40 text-violet-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <input
                      type="text"
                      required
                      value={step.title}
                      onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                      placeholder="Phase Title (e.g. Prompt Calibration & Lighting)"
                      className="flex-1 bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="w-40 shrink-0">
                    <input
                      type="text"
                      required
                      value={step.tool}
                      onChange={(e) => handleStepChange(index, 'tool', e.target.value)}
                      placeholder="Tool/Model used"
                      className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-1.5 text-violet-300 font-mono text-xs focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {workflowSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                      title="Remove phase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <textarea
                    rows={2}
                    required
                    value={step.description}
                    onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                    placeholder="Describe specific nodes, parameters, weights, or techniques used in this phase..."
                    className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Commercial Use Disclosure & Generation Params */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Commercial Disclosure & Generation Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">
                Commercial Use Terms
              </label>
              <select
                value={commercialUseDisclosure}
                onChange={(e) => setCommercialUseDisclosure(e.target.value as any)}
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500 font-medium"
              >
                <option value="Commercial Use Permitted">
                  Commercial Use Permitted (Free for commercial activations)
                </option>
                <option value="Editorial / Non-Commercial Only">
                  Editorial / Non-Commercial Only (Exhibition & journalism only)
                </option>
                <option value="Custom License Upon Request">
                  Custom License Upon Request (Enterprise negotiation required)
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">
                Primary Prompt Snippet (Optional)
              </label>
              <textarea
                rows={2}
                value={promptSnippet}
                onChange={(e) => setPromptSnippet(e.target.value)}
                placeholder="Cinematic wide film still of..."
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Seed (Optional)</label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="e.g. 849204118"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                CFG Scale / Guidance (Optional)
              </label>
              <input
                type="number"
                step="0.1"
                value={cfgScale || ''}
                onChange={(e) => setCfgScale(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="e.g. 6.5"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">
                Comma-separated Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Cyberpunk, Concept Art, Lighting, 35mm"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to={isEditing ? `/projects/${id}` : '/'}
            className="px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm shadow-violet-900/30 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Project...' : isEditing ? 'Update Artwork' : 'Publish Artwork'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
