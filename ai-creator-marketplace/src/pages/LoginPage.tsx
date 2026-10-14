import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const DEMO_CREATORS = [
  { name: 'Elena Rostova', handle: 'elena_synth', spec: 'Concept Art & Worldbuilding' },
  { name: 'Marcus Chen', handle: 'marcus_visuals', spec: 'Architectural Futurism' },
  { name: 'Aria Valen', handle: 'aria_couture', spec: 'AI Haute Couture' },
  { name: 'Tate Kincaid', handle: 'tate_motion', spec: 'Generative Cinema' },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemoCreator } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async (handle: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginAsDemoCreator(handle);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand & Title */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-lg mx-auto shadow-md shadow-violet-900/30">
          C
        </div>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">Sign In to CreatorSpace</h1>
        <p className="text-xs text-zinc-400">
          Access your studio profile and publish verified neural workflows.
        </p>
      </div>

      {/* Demo Fast Login Strip */}
      <div className="bg-[#0f0f18] p-4 rounded-xl border border-violet-900/30 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Quick Evaluation Access (One-Click Login)</span>
        </div>
        <p className="text-[11px] text-zinc-400">
          Click any seeded studio account below to instantly authenticate and test project management:
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {DEMO_CREATORS.map((c) => (
            <button
              key={c.handle}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDemoClick(c.handle)}
              className="text-left p-2.5 rounded-lg bg-zinc-900/80 hover:bg-violet-950/40 border border-zinc-800 hover:border-violet-700/50 transition-colors text-xs space-y-0.5"
            >
              <p className="font-semibold text-white truncate">{c.name}</p>
              <p className="text-[10px] text-zinc-400 font-mono">@{c.handle}</p>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Standard Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0c0c12] p-6 rounded-2xl border border-zinc-800/80 space-y-4 text-xs"
      >
        <div>
          <label className="block text-zinc-300 font-semibold mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@creatorspace.ai"
              className="w-full bg-[#14141e] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#14141e] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors shadow-sm shadow-violet-900/30 flex items-center justify-center gap-2"
        >
          <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Register redirect */}
      <div className="text-center text-xs text-zinc-400">
        <span>Don't have a creator studio account yet? </span>
        <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold">
          Register Here
        </Link>
      </div>
    </div>
  );
};
