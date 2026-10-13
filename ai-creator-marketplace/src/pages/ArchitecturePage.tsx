import React from 'react';
import { Database, Server, ShieldCheck, Image, Terminal, GitBranch, Check, Copy } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const envSample = `# Environment Variables (.env)
PORT=3000
NODE_ENV=development

# MongoDB Atlas URI (Mongoose)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/kroma?retryWrites=true&w=majority"

# JWT Auth Secret
JWT_SECRET="kroma_super_secure_jwt_secret_key_2026_hackathon"
JWT_EXPIRES_IN="7d"

# Cloudinary Integration (Stored securely on backend)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"`;

  const runCommands = `# Clone and Run Locally:
git clone <your-repo-url>
cd <repo-name>
npm install
cp .env.example .env
npm run dev
# Server boots at http://localhost:3000 with Vite SPA`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="space-y-3">
        <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
          Hackathon Technical Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-['Outfit']">
          Full-Stack MVC System Design & Setup
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Comprehensive specification of the backend MVC architecture, MongoDB Atlas Mongoose integration, JWT authentication pipeline, and Cloudinary media engine.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Database */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2.5 text-violet-400">
            <Database className="w-5 h-5" />
            <h2 className="text-base font-bold text-white font-['Outfit']">
              1. MongoDB Atlas & Mongoose
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Structured into three decoupled Mongoose models with indexes:
          </p>
          <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">UserModel:</strong> Authentication credentials, bcrypt hash, and role hierarchy.
            </li>
            <li>
              <strong className="text-white">CreatorProfileModel:</strong> Studio handle, bio, specializations, skills, verified tools, rates, and availability.
            </li>
            <li>
              <strong className="text-white">PortfolioProjectModel:</strong> Generative media URLs, aspect ratios, content types, multi-phase workflow steps, and commercial use licensing.
            </li>
          </ul>
          <div className="p-3 bg-violet-950/20 border border-violet-900/40 rounded-lg text-[11px] text-violet-300">
            <strong>Resilient Startup:</strong> If <code className="text-white">MONGODB_URI</code> is configured, the server connects directly to your Atlas cluster. If absent or in sandbox mode, an in-memory repository seamlessly powers all queries and CRUD operations.
          </div>
        </div>

        {/* Pillar 2: Express MVC */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2.5 text-violet-400">
            <Server className="w-5 h-5" />
            <h2 className="text-base font-bold text-white font-['Outfit']">
              2. Express.js MVC Backend
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Clean Model-View-Controller separation mounted at <code className="text-zinc-200">/api</code>:
          </p>
          <ul className="text-xs text-zinc-300 space-y-1.5 font-mono text-[11px]">
            <li>• POST /api/auth/register & login</li>
            <li>• GET /api/creators (filtered by tool, skill, spec)</li>
            <li>• GET /api/creators/:handle (profile + works)</li>
            <li>• GET /api/projects (filtered by type, tool, aspect)</li>
            <li>• POST / PUT / DELETE /api/projects (creator-authorized)</li>
            <li>• POST /api/upload (Cloudinary media handler)</li>
          </ul>
          <p className="text-xs text-zinc-400">
            Full Zod request schema validation with centralized error handling.
          </p>
        </div>

        {/* Pillar 3: Auth & Security */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2.5 text-violet-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-base font-bold text-white font-['Outfit']">
              3. JWT & Authorization
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Stateless authentication using JSON Web Tokens and salted bcrypt password hashing:
          </p>
          <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside">
            <li>
              Tokens are issued on registration and login, sent as <code className="text-violet-300">Bearer &lt;token&gt;</code> headers.
            </li>
            <li>
              <strong className="text-white">Resource Ownership Guard:</strong> Creators can modify or delete only their own projects. Unauthorized modification attempts return <code className="text-rose-400">403 Forbidden</code>.
            </li>
            <li>Zero secrets or credentials exposed to client bundles.</li>
          </ul>
        </div>

        {/* Pillar 4: Media Engine */}
        <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2.5 text-violet-400">
            <Image className="w-5 h-5" />
            <h2 className="text-base font-bold text-white font-['Outfit']">
              4. Cloudinary Integration
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Cloudinary stream uploader integrated via Multer memory storage:
          </p>
          <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside">
            <li>Buffers files in memory and streams directly to Cloudinary folder <code className="text-zinc-200">kroma_portfolios</code>.</li>
            <li>Credentials configured through backend environment variables (<code className="text-zinc-200">CLOUDINARY_API_KEY</code>, <code className="text-zinc-200">CLOUDINARY_API_SECRET</code>).</li>
            <li>Graceful fallback allows local media selection and external CDN images without disruption.</li>
          </ul>
        </div>
      </div>

      {/* Environment Variables Reference */}
      <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Environment Variables (.env)
            </h2>
          </div>
          <button
            onClick={() => copyToClipboard(envSample, 'env')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
          >
            {copiedSection === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'env' ? 'Copied' : 'Copy .env'}</span>
          </button>
        </div>
        <pre className="p-4 bg-[#08080c] rounded-xl border border-zinc-900 text-xs text-zinc-300 font-mono overflow-x-auto leading-relaxed select-all">
          {envSample}
        </pre>
      </div>

      {/* Export to GitHub & Run Locally */}
      <div className="p-6 rounded-2xl bg-[#0c0c12] border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Local Execution & GitHub Export
            </h2>
          </div>
          <button
            onClick={() => copyToClipboard(runCommands, 'run')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
          >
            {copiedSection === 'run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'run' ? 'Copied' : 'Copy Commands'}</span>
          </button>
        </div>
        <pre className="p-4 bg-[#08080c] rounded-xl border border-zinc-900 text-xs text-zinc-300 font-mono overflow-x-auto leading-relaxed select-all">
          {runCommands}
        </pre>
      </div>
    </div>
  );
};
