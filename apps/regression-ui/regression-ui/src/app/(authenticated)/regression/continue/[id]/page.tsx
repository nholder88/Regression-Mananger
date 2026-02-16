'use client';

import { useEffect, useState, use } from 'react';
import {
  regressionService,
  TestPass,
  ScenarioResult,
  FeatureScenarioContainer,
  Scenario,
} from '../../../../../lib/services/regression.service';

const STATUS_OPTIONS = ['Passed', 'Failed', 'Un-Tested', 'Blocked', 'Skipped'];

const STATUS_COLORS: Record<string, string> = {
  Passed: 'bg-green-500/20 text-green-400',
  Failed: 'bg-red-500/20 text-red-400',
  'Un-Tested': 'bg-gray-500/20 text-gray-400',
  Blocked: 'bg-yellow-500/20 text-yellow-400',
  Skipped: 'bg-blue-500/20 text-blue-400',
};

interface ScenarioFormState {
  status: string;
  notes: string;
  bugCreated: boolean;
  completedSteps: number[];
  resultId?: string;
}

export default function RegressionContinuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [testPass, setTestPass] = useState<TestPass | null>(null);
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedContainers, setExpandedContainers] = useState<Set<string>>(
    new Set()
  );
  const [scenarioForms, setScenarioForms] = useState<
    Record<string, ScenarioFormState>
  >({});
  const [savingScenarios, setSavingScenarios] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [testPassData, resultsData] = await Promise.all([
          regressionService.getTestPass(id),
          regressionService.getScenarioResults(id),
        ]);
        setTestPass(testPassData);
        setScenarioResults(resultsData);

        // Initialize form state from existing results
        const forms: Record<string, ScenarioFormState> = {};
        resultsData.forEach((result) => {
          if (result.scenario) {
            forms[result.scenario.id] = {
              status: result.status || 'Un-Tested',
              notes: result.notes || '',
              bugCreated: result.bugCreated || false,
              completedSteps: result.completedSteps || [],
              resultId: result.id,
            };
          }
        });
        setScenarioForms(forms);

        // Expand all containers by default
        if (testPassData.featureScenarioContainers) {
          setExpandedContainers(
            new Set(testPassData.featureScenarioContainers.map((c) => c.id))
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load test pass'
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  function getFormState(scenarioId: string): ScenarioFormState {
    return (
      scenarioForms[scenarioId] ?? {
        status: 'Un-Tested',
        notes: '',
        bugCreated: false,
        completedSteps: [],
      }
    );
  }

  function updateFormState(
    scenarioId: string,
    update: Partial<ScenarioFormState>
  ) {
    setScenarioForms((prev) => ({
      ...prev,
      [scenarioId]: { ...getFormState(scenarioId), ...update },
    }));
  }

  function toggleContainer(containerId: string) {
    setExpandedContainers((prev) => {
      const next = new Set(prev);
      if (next.has(containerId)) {
        next.delete(containerId);
      } else {
        next.add(containerId);
      }
      return next;
    });
  }

  async function handleSaveScenario(scenario: Scenario) {
    const form = getFormState(scenario.id);
    setSavingScenarios((prev) => new Set(prev).add(scenario.id));

    try {
      const payload: Partial<ScenarioResult> = {
        status: form.status,
        notes: form.notes,
        bugCreated: form.bugCreated,
        completedSteps: form.completedSteps,
        scenario: scenario,
        testPass: testPass!,
      };

      if (form.resultId) {
        await regressionService.updateScenarioResult(form.resultId, payload);
      } else {
        const created = await regressionService.createScenarioResult(payload);
        updateFormState(scenario.id, { resultId: created.id });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save scenario result'
      );
    } finally {
      setSavingScenarios((prev) => {
        const next = new Set(prev);
        next.delete(scenario.id);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Loading test pass...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!testPass) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Test pass not found.</div>
      </div>
    );
  }

  const containers: FeatureScenarioContainer[] =
    testPass.featureScenarioContainers ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{testPass.title}</h1>
        <p className="text-sm text-gray-400 mt-1">
          Role: {testPass.testingRole || '—'} &bull; Tester:{' '}
          {testPass.testingLoginUserName || '—'}
        </p>
      </div>

      {containers.length === 0 ? (
        <p className="text-gray-400">
          No feature scenario containers in this test pass.
        </p>
      ) : (
        <div className="space-y-4">
          {containers.map((container) => (
            <div
              key={container.id}
              className="bg-surface-100-800 rounded-xl shadow overflow-hidden"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleContainer(container.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-200-700 transition-colors text-left"
              >
                <div>
                  <span className="font-semibold">{container.name}</span>
                  {container.team && (
                    <span className="ml-2 text-sm text-gray-400">
                      ({container.team})
                    </span>
                  )}
                </div>
                <span className="text-gray-400">
                  {expandedContainers.has(container.id) ? '▲' : '▼'}
                </span>
              </button>

              {/* Accordion Content */}
              {expandedContainers.has(container.id) && (
                <div className="border-t border-surface-200-700 p-4 space-y-6">
                  {(container.scenarios ?? []).length === 0 ? (
                    <p className="text-sm text-gray-400">
                      No scenarios in this container.
                    </p>
                  ) : (
                    container.scenarios.map((scenario) => {
                      const form = getFormState(scenario.id);
                      const isSaving = savingScenarios.has(scenario.id);

                      return (
                        <div
                          key={scenario.id}
                          className="bg-surface-200-700 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{scenario.name}</h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                STATUS_COLORS[form.status] ?? ''
                              }`}
                            >
                              {form.status}
                            </span>
                          </div>

                          {/* Steps */}
                          {scenario.steps && scenario.steps.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs text-gray-400 font-semibold uppercase">
                                Steps
                              </p>
                              <ol className="list-decimal list-inside text-sm space-y-1">
                                {scenario.steps
                                  .sort((a, b) => a.order - b.order)
                                  .map((step) => (
                                    <li key={step.id} className="text-gray-300">
                                      {step.name}
                                    </li>
                                  ))}
                              </ol>
                            </div>
                          )}

                          {/* Status Dropdown */}
                          <div>
                            <label htmlFor={`status-${scenario.id}`} className="block text-xs font-medium text-gray-400 mb-1">
                              Status
                            </label>
                            <select
                              id={`status-${scenario.id}`}
                              value={form.status}
                              onChange={(e) =>
                                updateFormState(scenario.id, {
                                  status: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded bg-surface-100-800 border border-surface-200-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Notes */}
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Notes
                            </label>
                            <textarea
                              value={form.notes}
                              onChange={(e) =>
                                updateFormState(scenario.id, {
                                  notes: e.target.value,
                                })
                              }
                              rows={2}
                              className="w-full px-3 py-2 rounded bg-surface-100-800 border border-surface-200-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              placeholder="Add notes..."
                            />
                          </div>

                          {/* Bug Created */}
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={form.bugCreated}
                              onChange={(e) =>
                                updateFormState(scenario.id, {
                                  bugCreated: e.target.checked,
                                })
                              }
                              className="rounded"
                            />
                            Bug Created
                          </label>

                          {/* Save Button */}
                          <button
                            onClick={() => handleSaveScenario(scenario)}
                            disabled={isSaving}
                            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50 text-sm"
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
