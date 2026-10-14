import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioProject } from '../types';
import { Heart, Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import { api } from '../api/client';

interface ProjectCardProps {
  project: PortfolioProject;
  priority?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [likes, setLikes] = useState(project.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasLiked) return;

    setLikes((prev) => prev + 1);
    setHasLiked(true);

    try {
      await api.likeProject(project._id);
    } catch (err) {
      console.error('Failed to like project:', err);
    }
  };

  // Aspect ratio class mapper
  const getAspectClass = (ar: string) => {
    switch (ar) {
      case '16:9':
        return 'aspect-[16/9]';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:4':
        return 'aspect-[3/4]';
      case '9:16':
        return 'aspect-[9/16]';
      case '1:1':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="group relative flex flex-col bg-[#0c0c12] rounded-xl border border-zinc-800/80 hover:border-violet-500/50 transition-all duration-200 overflow-hidden shadow-sm">
      {/* Media Container with Aspect Ratio */}
      <Link
        to={`/projects/${project._id}`}
        className={`relative w-full overflow-hidden bg-zinc-950 block ${getAspectClass(
          project.aspectRatio
        )}`}
      >
        {!imageError ? (
          <img
            src={project.mediaUrl}
            alt={project.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-linear-to-br from-zinc-900 to-zinc-950">
            <Sparkles className="w-8 h-8 text-violet-400/60 mb-2" />
            <p className="text-xs font-medium text-zinc-400">{project.title}</p>
          </div>
        )}

        {/* Measured bottom scrim overlay for hover details */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between text-xs text-zinc-200">
            <span className="truncate max-w-50 text-zinc-300">
              {project.toolsUsed.slice(0, 2).join(' · ')}
            </span>
            <span className="flex items-center gap-1 font-semibold text-white">
              Details <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>

      {/* Card Content & Zero-Pill Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata Header (NO PILLS) */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5">
            <span className="text-violet-400 font-medium">{project.contentType}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{project.aspectRatio}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{project.workflowSteps?.length || 1} steps</span>
          </div>

          {/* Project Title */}
          <Link to={`/projects/${project._id}`}>
            <h3 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
              {project.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Card Footer: Creator info + Actions */}
        <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
          {project.creator ? (
            <Link
              to={`/creators/@${project.creator.handle}`}
              className="flex items-center gap-2 group/creator min-w-0"
            >
              <img
                src={project.creator.avatarUrl}
                alt={project.creator.displayName}
                className="w-5 h-5 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs text-zinc-300 group-hover/creator:text-white truncate">
                @{project.creator.handle}
              </span>
            </Link>
          ) : (
            <span className="text-xs text-zinc-500">CreatorSpace Creator</span>
          )}

          {/* Like & View stats */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-xs text-zinc-400 tabular-nums">
              <Eye className="w-3 h-3 text-zinc-500" />
              <span>{project.views}</span>
            </span>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs tabular-nums transition-colors ${
                hasLiked ? 'text-rose-400 font-medium' : 'text-zinc-400 hover:text-white'
              }`}
              title="Like project"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                  hasLiked ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
