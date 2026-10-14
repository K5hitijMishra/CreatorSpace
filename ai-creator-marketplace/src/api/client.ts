import { CreatorProfile, PortfolioProject, User, FilterMeta } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('creatorspace_jwt_token') || localStorage.getItem('kroma_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    (error as any).errors = data.errors;
    (error as any).status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }): Promise<{
    success: boolean;
    token: string;
    user: User;
    creator?: CreatorProfile;
  }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    handle?: string;
    specialization?: string;
    role?: string;
  }): Promise<{
    success: boolean;
    token: string;
    user: User;
    creator?: CreatorProfile;
  }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<{
    success: boolean;
    user: User;
    creator?: CreatorProfile;
  }> {
    return request('/auth/me');
  },

  // Creators
  async getCreators(params: {
    search?: string;
    specialization?: string;
    skill?: string;
    tool?: string;
    availableOnly?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    success: boolean;
    data: CreatorProfile[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.specialization && params.specialization !== 'all')
      query.set('specialization', params.specialization);
    if (params.skill && params.skill !== 'all') query.set('skill', params.skill);
    if (params.tool && params.tool !== 'all') query.set('tool', params.tool);
    if (params.availableOnly) query.set('availableOnly', 'true');
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    return request(`/creators?${query.toString()}`);
  },

  async getCreator(handleOrId: string): Promise<{
    success: boolean;
    data: CreatorProfile & { projects: PortfolioProject[] };
  }> {
    return request(`/creators/${encodeURIComponent(handleOrId)}`);
  },

  async updateProfile(updates: Partial<CreatorProfile>): Promise<{
    success: boolean;
    data: CreatorProfile;
    message: string;
  }> {
    return request('/creators/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async getFilterMeta(): Promise<{
    success: boolean;
    data: FilterMeta;
  }> {
    return request('/creators/meta/filters');
  },

  // Projects
  async getProjects(params: {
    search?: string;
    contentType?: string;
    tool?: string;
    aspectRatio?: string;
    creatorId?: string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    success: boolean;
    data: PortfolioProject[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.contentType && params.contentType !== 'all')
      query.set('contentType', params.contentType);
    if (params.tool && params.tool !== 'all') query.set('tool', params.tool);
    if (params.aspectRatio && params.aspectRatio !== 'all')
      query.set('aspectRatio', params.aspectRatio);
    if (params.creatorId) query.set('creatorId', params.creatorId);
    if (params.sort) query.set('sort', params.sort);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    return request(`/projects?${query.toString()}`);
  },

  async getProject(id: string): Promise<{
    success: boolean;
    data: PortfolioProject;
  }> {
    return request(`/projects/${id}`);
  },

  async createProject(project: Partial<PortfolioProject>): Promise<{
    success: boolean;
    data: PortfolioProject;
    message: string;
  }> {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  async updateProject(id: string, updates: Partial<PortfolioProject>): Promise<{
    success: boolean;
    data: PortfolioProject;
    message: string;
  }> {
    return request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteProject(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return request(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  async likeProject(id: string): Promise<{
    success: boolean;
    likes: number;
  }> {
    return request(`/projects/${id}/like`, {
      method: 'POST',
    });
  },

  // Media Upload
  async uploadMedia(file: File): Promise<{
    success: boolean;
    data: { url: string; isCloudinary: boolean };
  }> {
    const formData = new FormData();
    formData.append('media', file);

    const token = localStorage.getItem('creatorspace_jwt_token') || localStorage.getItem('kroma_jwt_token');
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'File upload failed');
    }
    return data;
  },
};
