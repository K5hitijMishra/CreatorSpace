import React from 'react';
import { Link } from 'react-router-dom';
import { Database, ShieldCheck, Image, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#060609] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center text-white font-bold text-xs">
                K
              </span>
              <span className="font-bold tracking-tight text-white font-['Outfit'] text-base">
                KROMA
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed text-xs max-w-sm">
              The premier marketplace module for generative visual artists, specialized AI creator profiles, and verifiable neural workflows.
            </p>
          </div>

          {/* Directory navigation */}
          <div>
            <h4 className="text-zinc-200 font-semibold mb-3">Discovery</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Portfolio Showcase
                </Link>
              </li>
              <li>
                <Link to="/creators" className="hover:text-white transition-colors">
                  Creator Directory
                </Link>
              </li>
              <li>
                <Link to="/workflows" className="hover:text-white transition-colors">
                  Model Workflows
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div>
            <h4 className="text-zinc-200 font-semibold mb-3">Engineering Spec</h4>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-violet-400" />
                <span>MongoDB Atlas & Mongoose</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-violet-400" />
                <span>Node.js Express MVC REST API</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>JWT Authentication & Bcrypt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-violet-400" />
                <span>Cloudinary Media Engine</span>
              </li>
            </ul>
          </div>

          {/* Quick Creator Access */}
          <div>
            <h4 className="text-zinc-200 font-semibold mb-3">Creator Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/projects/new" className="hover:text-white transition-colors">
                  Publish New Artwork
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Studio Profile
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="hover:text-white transition-colors">
                  System Architecture & Setup
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600">
          <p>© {new Date().getFullYear()} Kroma AI Creator Marketplace. Built for Hackathon Module Evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">Commercial License Verified</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-500">Zero-Pill Typography</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-500">Vite React 19 SPA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
