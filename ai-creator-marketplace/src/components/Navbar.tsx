import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, User as UserIcon, LogOut, Sparkles, Menu, X, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, creator, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Showcase', path: '/' },
    { label: 'Creators', path: '/creators' },
    { label: 'Workflows', path: '/workflows' },
    { label: 'Architecture', path: '/architecture' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07070a]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-white font-['Outfit'] flex items-center gap-2 whitespace-nowrap shrink-0 group"
        >
          <span className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:bg-violet-500 transition-colors">
            C
          </span>
          <span>CreatorSpace</span>
        </Link>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                  isActive ? 'text-violet-400 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action / account slot */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && creator ? (
            <div className="flex items-center gap-3">
              <Link
                to="/projects/new"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-violet-900/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Project</span>
              </Link>

              {/* Creator dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-zinc-800 hover:border-zinc-700 transition-colors focus:outline-none"
                  aria-label="User menu"
                >
                  <img
                    src={creator.avatarUrl}
                    alt={creator.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-[#0f0f15] border border-zinc-800 rounded-xl shadow-2xl py-1 text-sm z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-zinc-800/80">
                      <p className="font-semibold text-white truncate">{creator.displayName}</p>
                      <p className="text-xs text-zinc-500 truncate">@{creator.handle}</p>
                    </div>

                    <Link
                      to={`/creators/@${creator.handle}`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-zinc-400" />
                      <span>My Profile & Works</span>
                    </Link>

                    <Link
                      to="/profile/edit"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-zinc-400" />
                      <span>Edit Creator Info</span>
                    </Link>

                    <Link
                      to="/projects/new"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex sm:hidden items-center gap-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-zinc-400" />
                      <span>Publish Project</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-zinc-800/50 transition-colors border-t border-zinc-800/80"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                Join as Creator
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c12] border-b border-zinc-800 px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-zinc-300 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/projects/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-violet-400 font-semibold"
            >
              + Publish Project
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
