export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'creator' | 'client';
  createdAt: string;
}

export interface ICreatorProfile {
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
}

export interface IWorkflowStep {
  stepNumber: number;
  title: string;
  tool: string;
  description: string;
}

export interface IPromptDetails {
  promptSnippet?: string;
  negativePrompt?: string;
  seed?: string;
  cfgScale?: number;
  sampler?: string;
}

export interface IPortfolioProject {
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
  workflowSteps: IWorkflowStep[];
  commercialUseDisclosure: 'Commercial Use Permitted' | 'Editorial / Non-Commercial Only' | 'Custom License Upon Request';
  promptDetails?: IPromptDetails;
  tags: string[];
  likes: number;
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: ICreatorProfile;
}
