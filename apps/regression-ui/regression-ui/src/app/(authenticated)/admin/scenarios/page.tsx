'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  scenarioService,
  Scenario,
  Step,
} from '../../../../lib/services/admin.service';

interface StepFormData {
  name: string;
  order: number;
}

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    order: 0,
  });
  const [steps, setSteps] = useState<StepFormData[]>([]);

  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scenarioService.getAll();
      setScenarios(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch scenarios'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const resetForm = () => {
    setFormData({ name: '', order: 0 });
    setSteps([]);
    setEditingScenario(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setFormData({
      name: scenario.name,
      order: scenario.order,
    });
    setSteps(
      scenario.steps?.map((step) => ({
        name: step.name,
        order: step.order,
      })) ?? []
    );
    setShowForm(true);
  };

  const handleDelete = async (scenario: Scenario) => {
    if (
      !confirm(
        `Are you sure you want to delete scenario "${scenario.name}"?`
      )
    ) {
      return;
    }
    try {
      await scenarioService.delete(scenario.id);
      await fetchScenarios();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete scenario'
      );
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      const payload: Partial<Scenario> = {
        name: formData.name,
        order: formData.order,
        steps: steps.map((step, index) => ({
          id: '',
          name: step.name,
          order: step.order,
          userId: '',
        })) as Step[],
      };

      if (editingScenario) {
        await scenarioService.update(editingScenario.id, payload);
      } else {
        await scenarioService.create(payload);
      }
      resetForm();
      await fetchScenarios();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save scenario'
      );
    }
  };

  const addStep = () => {
    setSteps([...steps, { name: '', order: steps.length }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (
    index: number,
    field: keyof StepFormData,
    value: string | number
  ) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-surface-900-50 text-lg">
          Loading scenarios...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchScenarios}
          className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Scenarios</h1>
        <button
          onClick={handleAdd}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Add Scenario
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-100-800 rounded-xl p-6 shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingScenario ? 'Edit Scenario' : 'Add Scenario'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-surface-200-700 border border-surface-300-600 focus:border-primary-500 focus:outline-none"
                placeholder="Scenario name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-surface-200-700 border border-surface-300-600 focus:border-primary-500 focus:outline-none"
                placeholder="Order"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Steps</h3>
              <button
                type="button"
                onClick={addStep}
                className="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600 transition-colors"
              >
                Add Step
              </button>
            </div>

            {steps.length === 0 ? (
              <p className="text-surface-900-50/60 text-sm">
                No steps added yet. Click &quot;Add Step&quot; to begin.
              </p>
            ) : (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-surface-200-700 rounded-lg p-3"
                  >
                    <span className="text-xs font-mono text-surface-900-50/60 w-6 text-center">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) =>
                        updateStep(index, 'name', e.target.value)
                      }
                      className="flex-1 px-4 py-2 rounded-lg bg-surface-100-800 border border-surface-300-600 focus:border-primary-500 focus:outline-none"
                      placeholder="Step name"
                    />
                    <input
                      type="number"
                      value={step.order}
                      onChange={(e) =>
                        updateStep(
                          index,
                          'order',
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-24 px-4 py-2 rounded-lg bg-surface-100-800 border border-surface-300-600 focus:border-primary-500 focus:outline-none"
                      placeholder="Order"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={resetForm}
              className="bg-surface-300-600 text-surface-900-50 px-4 py-2 rounded-lg hover:bg-surface-400-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface-100-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-200-700">
              <th className="text-left px-4 py-3 text-sm font-semibold">
                Name
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold">
                Steps Count
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold">
                Order
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {scenarios.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-surface-900-50/60"
                >
                  No scenarios found.
                </td>
              </tr>
            ) : (
              scenarios.map((scenario) => (
                <tr key={scenario.id} className="even:bg-surface-200-700">
                  <td className="px-4 py-3">{scenario.name}</td>
                  <td className="px-4 py-3">
                    {scenario.steps?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">{scenario.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(scenario)}
                        className="bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(scenario)}
                        className="bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
