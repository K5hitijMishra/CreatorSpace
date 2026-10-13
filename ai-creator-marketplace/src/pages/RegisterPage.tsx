import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, AtSign, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('Concept Art & Worldbuilding');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        handle: handle.trim().replace(/^@/, ''),
        specialization,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-lg mx-auto shadow-md shadow-violet-900/30">
          K
        </div>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">Join as an AI Creator</h1>
        <p className="text-xs text-zinc-400">
          Establish your verified studio profile and showcase multi-model pipelines.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#0c0c12] p-6 rounded-2xl border border-zinc-800/80 space-y-4 text-xs"
      >
        <div>
          <label className="block text-zinc-300 font-semibold mb-1">Full Name / Studio Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!handle) {
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                }
              }}
              placeholder="e.g. Maya Lin"
              className="w-full bg-[#14141e] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-1">Creator Handle</label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="maya_synth"
              className="w-full bg-[#14141e] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya@example.com"
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-[#14141e] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-1">Primary Specialization</label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full bg-[#14141e] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
          >
            <option value="Concept Art & Worldbuilding">Concept Art & Worldbuilding</option>
            <option value="Architectural Visualization">Architectural Visualization</option>
            <option value="Editorial Fashion">Editorial Fashion</option>
            <option value="Cinematic Motion & Video">Cinematic Motion & Video</option>
            <option value="Character Design & Lore">Character Design & Lore</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors shadow-sm shadow-violet-900/30 flex items-center justify-center gap-2"
        >
          <span>{isSubmitting ? 'Creating Studio Profile...' : 'Complete Registration'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="text-center text-xs text-zinc-400">
        <span>Already have an account? </span>
        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
};
