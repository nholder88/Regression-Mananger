import { apiClient } from '../api-client';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export interface Feature {
  id: string;
  name: string;
  teams: Team[];
  subFeatures: Feature[];
  enable: boolean;
}

export interface Team {
  id: string;
  name: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>('User');
  },

  async getOne(id: string): Promise<User> {
    return apiClient.get<User>(`User/${id}`);
  },

  async create(user: Partial<User>): Promise<User> {
    return apiClient.post<User>('User', user);
  },

  async update(id: string, user: Partial<User>): Promise<User> {
    return apiClient.patch<User>(`User/${id}`, user);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`User/${id}`);
  },
};

export const featureService = {
  async getAll(): Promise<Feature[]> {
    return apiClient.get<Feature[]>('Feature');
  },

  async getOne(id: string): Promise<Feature> {
    return apiClient.get<Feature>(`Feature/${id}`);
  },

  async create(feature: Partial<Feature>): Promise<Feature> {
    return apiClient.post<Feature>('Feature', feature);
  },

  async update(id: string, feature: Partial<Feature>): Promise<Feature> {
    return apiClient.patch<Feature>(`Feature/${id}`, feature);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`Feature/${id}`);
  },
};

export const scenarioService = {
  async getAll(): Promise<Scenario[]> {
    return apiClient.get<Scenario[]>('Scenario');
  },

  async getOne(id: string): Promise<Scenario> {
    return apiClient.get<Scenario>(`Scenario/${id}`);
  },

  async create(scenario: Partial<Scenario>): Promise<Scenario> {
    return apiClient.post<Scenario>('Scenario', scenario);
  },

  async update(id: string, scenario: Partial<Scenario>): Promise<Scenario> {
    return apiClient.patch<Scenario>(`Scenario/${id}`, scenario);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`Scenario/${id}`);
  },
};

export interface Scenario {
  id: string;
  name: string;
  steps: Step[];
  timestamp: string;
  note: string;
  order: number;
  userId: string;
}

export interface Step {
  id: string;
  name: string;
  order: number;
  userId: string;
}
