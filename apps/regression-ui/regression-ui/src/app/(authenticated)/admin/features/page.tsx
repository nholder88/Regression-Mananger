'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  featureService,
  Feature,
} from '../../../../lib/services/admin.service';

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    enable: true,
  });

  const fetchFeatures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await featureService.getAll();
      setFeatures(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch features'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const resetForm = () => {
    setFormData({ name: '', enable: true });
    setEditingFeature(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.name,
      enable: feature.enable,
    });
    setShowForm(true);
  };

  const handleDelete = async (feature: Feature) => {
    if (
      !confirm(`Are you sure you want to delete feature "${feature.name}"?`)
    ) {
      return;
    }
    try {
      await featureService.delete(feature.id);
      await fetchFeatures();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete feature'
      );
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      const payload: Partial<Feature> = {
        name: formData.name,
        enable: formData.enable,
      };

      if (editingFeature) {
        await featureService.update(editingFeature.id, payload);
      } else {
        await featureService.create(payload);
      }
      resetForm();
      await fetchFeatures();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save feature'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-surface-900-50 text-lg">Loading features...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchFeatures}
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
        <h1 className="text-2xl font-bold">Features</h1>
        <button
          onClick={handleAdd}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Add Feature
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-100-800 rounded-xl p-6 shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingFeature ? 'Edit Feature' : 'Add Feature'}
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
                placeholder="Feature name"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm font-medium">Enabled</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, enable: !formData.enable })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.enable ? 'bg-green-500' : 'bg-surface-300-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.enable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
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
                Enabled
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {features.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-surface-900-50/60"
                >
                  No features found.
                </td>
              </tr>
            ) : (
              features.map((feature) => (
                <tr key={feature.id} className="even:bg-surface-200-700">
                  <td className="px-4 py-3">{feature.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        feature.enable
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {feature.enable ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(feature)}
                        className="bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(feature)}
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
