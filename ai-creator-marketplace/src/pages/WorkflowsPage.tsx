import React, { useState, useEffect } from 'react';
import { PortfolioProject } from '../types';
import { api } from '../api/client';
import { Link } from 'react-router-dom';
import { Layers, Sparkles, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

export const WorkflowsPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.getProjects({ limit: 8 });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="space-y-3">
        <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
          Neural Workflow Registry
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-['Outfit']">
          Step-by-Step Generative Pipelines
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          CreatorSpace demands complete transparency: every featured project includes verifiable procedural generation steps, tool provenance, and model parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-[#0c0c12] border border-zinc-800/80 rounded-2xl p-6 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header with image thumbnail & title */}
              <div className="flex items-start gap-4">
                <img
                  src={project.mediaUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover shrink-0 ring-1 ring-zinc-800"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
                    <span className="text-violet-400 font-semibold">{project.contentType}</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>{project.aspectRatio}</span>
                  </div>
                  <Link
                    to={`/projects/${project._id}`}
                    className="font-bold text-white hover:text-violet-300 transition-colors line-clamp-1 text-base"
                  >
                    {project.title}
                  </Link>
                  {project.creator && (
                    <p className="text-xs text-zinc-400">by @{project.creator.handle}</p>
                  )}
                </div>
              </div>

              {/* Tools list */}
              <div className="text-xs text-zinc-400 flex items-center gap-1.5 flex-wrap">
                <Cpu className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="text-zinc-300 font-medium">{project.toolsUsed.join(' · ')}</span>
              </div>

              {/* Workflow Steps Sequence */}
              <div className="space-y-3 pt-3 border-t border-zinc-850">
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                  Generation Timeline
                </p>
                <div className="space-y-2 text-xs">
                  {project.workflowSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3 bg-[#08080c] rounded-lg border border-zinc-900 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-200">
                          {step.stepNumber}. {step.title}
                        </span>
                        <span className="text-violet-400 font-mono text-[11px]">{step.tool}</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{project.commercialUseDisclosure}</span>
              </span>
              <Link
                to={`/projects/${project._id}`}
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
              >
                <span>Inspect Artwork</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
