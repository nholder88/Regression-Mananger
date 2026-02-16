import { apiClient } from '../api-client';

export interface RegressionHeader {
  id: string;
  name: string;
  isComplete: boolean;
  isStarted: boolean;
  releaseName: string;
  startDate: string;
  endDate: string;
  userId: string;
  testPasses: TestPass[];
}

export interface TestPass {
  id: string;
  title: string;
  timeStamp: string;
  isComplete: boolean;
  isStarted: boolean;
  testingRole: string;
  testingLoginUserName: string;
  userId: string;
  featureScenarioContainers: FeatureScenarioContainer[];
}

export interface FeatureScenarioContainer {
  id: string;
  name: string;
  team: string;
  scenarios: Scenario[];
  userId: string;
}

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

export interface ScenarioResult {
  id: string;
  timestamp: string;
  completedBy: string;
  status: string;
  notes: string;
  bugCreated: boolean;
  completedSteps: number[];
  scenario: Scenario;
  testPass: TestPass;
  userId: string;
}

export const regressionService = {
  async getHeaders(): Promise<RegressionHeader[]> {
    return apiClient.get<RegressionHeader[]>('RegressionHeader');
  },

  async getHeader(id: string): Promise<RegressionHeader> {
    return apiClient.get<RegressionHeader>(`RegressionHeader/${id}`);
  },

  async createHeader(header: Partial<RegressionHeader>): Promise<RegressionHeader> {
    return apiClient.post<RegressionHeader>('RegressionHeader', header);
  },

  async getTestPasses(): Promise<TestPass[]> {
    return apiClient.get<TestPass[]>('TestPass');
  },

  async getTestPass(id: string): Promise<TestPass> {
    return apiClient.get<TestPass>(`TestPass/${id}`);
  },

  async createTestPass(testPass: Partial<TestPass>): Promise<TestPass> {
    return apiClient.post<TestPass>('TestPass', testPass);
  },

  async getScenarioResults(testPassId?: string): Promise<ScenarioResult[]> {
    const query = testPassId ? `?filter=testPass.id||eq||${testPassId}` : '';
    return apiClient.get<ScenarioResult[]>(`ScenarioResult${query}`);
  },

  async updateScenarioResult(id: string, result: Partial<ScenarioResult>): Promise<ScenarioResult> {
    return apiClient.patch<ScenarioResult>(`ScenarioResult/${id}`, result);
  },

  async createScenarioResult(result: Partial<ScenarioResult>): Promise<ScenarioResult> {
    return apiClient.post<ScenarioResult>('ScenarioResult', result);
  },
};
