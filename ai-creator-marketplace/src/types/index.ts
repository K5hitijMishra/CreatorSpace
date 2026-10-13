export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'creator' | 'client';
}

export interface CreatorProfile {
  _id: string;
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  coverUrl?: string;
  tagline: string;
  bio: string;
  location: string;
  specialization: string;
  skills: string[];
  aiTools: string[];
  socialLinks?: {
    website?: string;
    twitter?: string;
    instagram?: string;
    artstation?: string;
    github?: string;
  };
  rates?: {
    hourly?: string;
    projectStartingAt?: string;
  };
  availableForWork: boolean;
  featured: boolean;
  projectCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  projects?: PortfolioProject[];
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  tool: string;
  description: string;
}

export interface PromptDetails {
  promptSnippet?: string;
  negativePrompt?: string;
  seed?: string;
  cfgScale?: number;
  sampler?: string;
}

export interface PortfolioProject {
  _id: string;
  creatorId: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16' | '3:4';
  contentType: 'Concept Art' | 'Cinematic Film' | 'Editorial Fashion' | 'Architecture' | 'Character Design' | 'Motion Graphic';
  toolsUsed: string[];
  workflowSteps: WorkflowStep[];
  commercialUseDisclosure: 'Commercial Use Permitted' | 'Editorial / Non-Commercial Only' | 'Custom License Upon Request';
  promptDetails?: PromptDetails;
  tags: string[];
  likes: number;
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: CreatorProfile;
}

export interface FilterMeta {
  specializations: string[];
  skills: string[];
  aiTools: string[];
  contentTypes: string[];
  aspectRatios: string[];
  totalCreators: number;
  totalProjects: number;
}
