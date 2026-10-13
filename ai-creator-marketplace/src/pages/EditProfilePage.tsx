import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Check, AlertCircle, Sparkles } from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const { creator, updateCreatorProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [toolsText, setToolsText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [projectRate, setProjectRate] = useState('');
  const [availableForWork, setAvailableForWork] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (creator) {
      setDisplayName(creator.displayName || '');
      setTagline(creator.tagline || '');
      setBio(creator.bio || '');
      setLocation(creator.location || '');
      setSpecialization(creator.specialization || '');
      setSkillsText((creator.skills || []).join(', '));
      setToolsText((creator.aiTools || []).join(', '));
      setAvatarUrl(creator.avatarUrl || '');
      setCoverUrl(creator.coverUrl || '');
      setHourlyRate(creator.rates?.hourly || '');
      setProjectRate(creator.rates?.projectStartingAt || '');
      setAvailableForWork(creator.availableForWork ?? true);
    }
  }, [creator]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator) return;

    setIsSubmitting(true);
    setError(null);

    const skills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
    const aiTools = toolsText.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      await updateCreatorProfile({
        displayName,
        tagline,
        bio,
        location,
        specialization,
        skills,
        aiTools,
        avatarUrl,
        coverUrl,
        rates: {
          hourly: hourlyRate,
          projectStartingAt: projectRate,
        },
        availableForWork,
      });

      navigate(`/creators/@${creator.handle}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !creator) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-white">Authentication Required</h2>
        <Link to="/login" className="text-violet-400 text-xs font-semibold">
          Please sign in to edit your profile.
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link
          to={`/creators/@${creator.handle}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </Link>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">
          Edit Creator Studio Profile
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Customize your public presence, verified skills, and commercial rates.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="bg-[#0c0c12] p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Studio Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Berlin, Tokyo & Remote"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Tagline</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Sci-Fi Worldbuilder & Generative Art Director"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Studio Biography</label>
              <textarea
                rows={4}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0c0c12] p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Skills & AI Models
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Primary Specialization
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Concept Art & Worldbuilding"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                AI Tools Stack (comma-separated)
              </label>
              <input
                type="text"
                value={toolsText}
                onChange={(e) => setToolsText(e.target.value)}
                placeholder="Midjourney v6, ComfyUI, Flux.1 Pro, Magnific AI"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Technical Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Nodal Prompting, LoRA Training, Look-Dev Lighting"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0c0c12] p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Rates & Availability
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Hourly Rate</label>
              <input
                type="text"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="$120 / hr"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Projects Starting At</label>
              <input
                type="text"
                value={projectRate}
                onChange={(e) => setProjectRate(e.target.value)}
                placeholder="$2,000"
                className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={availableForWork}
                  onChange={(e) => setAvailableForWork(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-violet-600 focus:ring-0"
                />
                <span>Available for new commissions & enterprise consulting</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to={`/creators/@${creator.handle}`}
            className="px-4 py-2 font-semibold text-zinc-400 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg shadow-sm"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
