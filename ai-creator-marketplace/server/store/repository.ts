import { IUser, ICreatorProfile, IPortfolioProject } from '../models/types';
import { SEED_USERS, SEED_CREATORS, SEED_PROJECTS } from '../seed/seedData';
import { isMongoConnected } from '../config/db';
import { UserModel, CreatorProfileModel, PortfolioProjectModel } from '../models/mongooseSchemas';

// In-memory collections initialized with seed data
let users: IUser[] = JSON.parse(JSON.stringify(SEED_USERS));
let creators: ICreatorProfile[] = JSON.parse(JSON.stringify(SEED_CREATORS));
let projects: IPortfolioProject[] = JSON.parse(JSON.stringify(SEED_PROJECTS));

export const Repository = {
  // User methods
  async findUserByEmail(email: string): Promise<IUser | null> {
    if (isMongoConnected()) {
      try {
        const u = await UserModel.findOne({ email: email.toLowerCase() }).lean();
        if (u) {
          return { ...u, _id: (u as any)._id?.toString() || (u as any)._id } as any;
        }
      } catch (err) {
        console.error('Mongo findUserByEmail error, fallback to memory:', err);
      }
    }
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found ? { ...found } : null;
  },

  async findUserById(id: string): Promise<IUser | null> {
    if (isMongoConnected()) {
      try {
        const u = await UserModel.findById(id).lean();
        if (u) {
          return { ...u, _id: (u as any)._id?.toString() || (u as any)._id } as any;
        }
      } catch (err) {
        // CastError or other Mongo error, safely fall through to memory store
      }
    }
    const found = users.find((u) => u._id === id);
    return found ? { ...found } : null;
  },

  async createUser(userData: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser> {
    const newUser: IUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'creator',
      createdAt: new Date().toISOString(),
    };

    if (isMongoConnected()) {
      try {
        const doc = await UserModel.create({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        });
        newUser._id = doc._id.toString();
      } catch (err) {
        console.error('Mongo createUser error, saving in memory:', err);
      }
    }

    users.push(newUser);
    return newUser;
  },

  // Creator methods
  async getCreators(filters: {
    search?: string;
    specialization?: string;
    skill?: string;
    tool?: string;
    availableOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ creators: ICreatorProfile[]; total: number }> {
    let result = [...creators];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.displayName.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.specialization.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)) ||
          c.aiTools.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.specialization && filters.specialization !== 'all') {
      result = result.filter(
        (c) => c.specialization.toLowerCase() === filters.specialization!.toLowerCase()
      );
    }

    if (filters.skill && filters.skill !== 'all') {
      result = result.filter((c) =>
        c.skills.some((s) => s.toLowerCase() === filters.skill!.toLowerCase())
      );
    }

    if (filters.tool && filters.tool !== 'all') {
      result = result.filter((c) =>
        c.aiTools.some((t) => t.toLowerCase() === filters.tool!.toLowerCase())
      );
    }

    if (filters.availableOnly) {
      result = result.filter((c) => c.availableForWork);
    }

    // Update project count dynamically from projects
    result = result.map((c) => {
      const pCount = projects.filter((p) => p.creatorId === c._id).length;
      return { ...c, projectCount: pCount };
    });

    const total = result.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return { creators: paginated, total };
  },

  async findCreatorByIdOrHandle(idOrHandle: string): Promise<ICreatorProfile | null> {
    const clean = idOrHandle.replace(/^@/, '').toLowerCase();
    const found = creators.find(
      (c) => c._id === idOrHandle || c.handle.toLowerCase() === clean
    );
    if (!found) return null;
    const pCount = projects.filter((p) => p.creatorId === found._id).length;
    return { ...found, projectCount: pCount };
  },

  async findCreatorByUserId(userId: string): Promise<ICreatorProfile | null> {
    const found = creators.find((c) => c.userId === userId);
    return found ? { ...found } : null;
  },

  async createCreatorProfile(profileData: Omit<ICreatorProfile, '_id' | 'createdAt' | 'updatedAt' | 'projectCount' | 'likesCount'>): Promise<ICreatorProfile> {
    const newProfile: ICreatorProfile = {
      _id: `cr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...profileData,
      projectCount: 0,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    creators.push(newProfile);
    return newProfile;
  },

  async updateCreatorProfile(
    creatorId: string,
    updates: Partial<ICreatorProfile>
  ): Promise<ICreatorProfile | null> {
    const index = creators.findIndex((c) => c._id === creatorId);
    if (index === -1) return null;

    creators[index] = {
      ...creators[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return { ...creators[index] };
  },

  // Project methods
  async getProjects(filters: {
    search?: string;
    contentType?: string;
    tool?: string;
    aspectRatio?: string;
    creatorId?: string;
    sort?: 'newest' | 'popular' | 'views';
    page?: number;
    limit?: number;
  }): Promise<{ projects: IPortfolioProject[]; total: number }> {
    let result = [...projects];

    if (filters.creatorId) {
      result = result.filter((p) => p.creatorId === filters.creatorId);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.contentType.toLowerCase().includes(q) ||
          p.toolsUsed.some((t) => t.toLowerCase().includes(q)) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (filters.contentType && filters.contentType !== 'all') {
      result = result.filter(
        (p) => p.contentType.toLowerCase() === filters.contentType!.toLowerCase()
      );
    }

    if (filters.tool && filters.tool !== 'all') {
      result = result.filter((p) =>
        p.toolsUsed.some((t) => t.toLowerCase() === filters.tool!.toLowerCase())
      );
    }

    if (filters.aspectRatio && filters.aspectRatio !== 'all') {
      result = result.filter((p) => p.aspectRatio === filters.aspectRatio);
    }

    // Sorting
    if (filters.sort === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (filters.sort === 'views') {
      result.sort((a, b) => b.views - a.views);
    } else {
      // Default: newest
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Attach creator profile
    const populated = result.map((p) => {
      const creator = creators.find((c) => c._id === p.creatorId);
      return { ...p, creator };
    });

    const total = populated.length;
    const page = filters.page || 1;
    const limit = filters.limit || 24;
    const startIndex = (page - 1) * limit;
    const paginated = populated.slice(startIndex, startIndex + limit);

    return { projects: paginated, total };
  },

  async findProjectById(id: string): Promise<IPortfolioProject | null> {
    const found = projects.find((p) => p._id === id);
    if (!found) return null;

    // Increment views count quietly
    found.views = (found.views || 0) + 1;

    const creator = creators.find((c) => c._id === found.creatorId);
    return { ...found, creator };
  },

  async createProject(
    projectData: Omit<IPortfolioProject, '_id' | 'createdAt' | 'updatedAt' | 'likes' | 'views'>
  ): Promise<IPortfolioProject> {
    const newPrj: IPortfolioProject = {
      _id: `prj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...projectData,
      likes: 0,
      views: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.unshift(newPrj);

    // Update creator project count
    const creator = creators.find((c) => c._id === newPrj.creatorId);
    if (creator) {
      creator.projectCount = (creator.projectCount || 0) + 1;
    }

    return { ...newPrj, creator };
  },

  async updateProject(
    id: string,
    creatorId: string,
    updates: Partial<IPortfolioProject>
  ): Promise<IPortfolioProject | null> {
    const index = projects.findIndex((p) => p._id === id);
    if (index === -1) return null;

    // Authorization check
    if (projects[index].creatorId !== creatorId) {
      throw new Error('UNAUTHORIZED_ACTION');
    }

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const creator = creators.find((c) => c._id === projects[index].creatorId);
    return { ...projects[index], creator };
  },

  async deleteProject(id: string, creatorId: string): Promise<boolean> {
    const index = projects.findIndex((p) => p._id === id);
    if (index === -1) return false;

    // Authorization check
    if (projects[index].creatorId !== creatorId) {
      throw new Error('UNAUTHORIZED_ACTION');
    }

    projects.splice(index, 1);

    // Update creator project count
    const creator = creators.find((c) => c._id === creatorId);
    if (creator && creator.projectCount > 0) {
      creator.projectCount -= 1;
    }

    return true;
  },

  async toggleLikeProject(id: string): Promise<{ likes: number }> {
    const found = projects.find((p) => p._id === id);
    if (!found) throw new Error('NOT_FOUND');
    found.likes = (found.likes || 0) + 1;
    return { likes: found.likes };
  },

  // Discovery filter metadata
  async getFilterMetadata() {
    const specializations = Array.from(new Set(creators.map((c) => c.specialization)));
    const skills = Array.from(new Set(creators.flatMap((c) => c.skills)));
    const aiTools = Array.from(
      new Set([...creators.flatMap((c) => c.aiTools), ...projects.flatMap((p) => p.toolsUsed)])
    );
    const contentTypes = Array.from(new Set(projects.map((p) => p.contentType)));
    const aspectRatios = ['16:9', '4:3', '1:1', '9:16', '3:4'];

    return {
      specializations,
      skills,
      aiTools,
      contentTypes,
      aspectRatios,
      totalCreators: creators.length,
      totalProjects: projects.length,
    };
  },
};
