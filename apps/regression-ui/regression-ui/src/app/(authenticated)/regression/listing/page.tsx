'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  regressionService,
  TestPass,
} from '../../../../lib/services/regression.service';

export default function RegressionListingPage() {
  const [testPasses, setTestPasses] = useState<TestPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    testingRole: '',
    testingLoginUserName: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTestPasses();
  }, []);

  async function fetchTestPasses() {
    try {
      setLoading(true);
      const data = await regressionService.getTestPasses();
      setTestPasses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load test passes'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTestPass(e: React.FormEvent) {
    e.preventDefault();
    try {
      setCreating(true);
      await regressionService.createTestPass({
        title: formData.title,
        testingRole: formData.testingRole,
        testingLoginUserName: formData.testingLoginUserName,
      });
      setFormData({ title: '', testingRole: '', testingLoginUserName: '' });
      setShowForm(false);
      await fetchTestPasses();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create test pass'
      );
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Loading test passes...</div>
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Test Passes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
        >
          {showForm ? 'Cancel' : 'New Test Pass'}
        </button>
      </div>

      {/* Inline Create Form */}
      {showForm && (
        <div className="bg-surface-100-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Create New Test Pass</h2>
          <form onSubmit={handleCreateTestPass} className="space-y-4">
            <div>
              <label htmlFor="tp-title" className="block text-sm font-medium mb-1">Title</label>
              <input
                id="tp-title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-surface-200-700 border border-surface-200-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="tp-role" className="block text-sm font-medium mb-1">
                Testing Role
              </label>
              <input
                id="tp-role"
                type="text"
                value={formData.testingRole}
                onChange={(e) =>
                  setFormData({ ...formData, testingRole: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-surface-200-700 border border-surface-200-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="tp-username" className="block text-sm font-medium mb-1">
                Testing Login Username
              </label>
              <input
                id="tp-username"
                type="text"
                value={formData.testingLoginUserName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    testingLoginUserName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded bg-surface-200-700 border border-surface-200-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Test Pass'}
            </button>
          </form>
        </div>
      )}

      {/* Test Passes Table */}
      <div className="bg-surface-100-800 rounded-xl p-6 shadow overflow-x-auto">
        {testPasses.length === 0 ? (
          <p className="text-gray-400">No test passes found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-200-700">
                <th className="text-left p-3 text-sm font-semibold">Title</th>
                <th className="text-left p-3 text-sm font-semibold">
                  Started
                </th>
                <th className="text-left p-3 text-sm font-semibold">
                  Completed
                </th>
                <th className="text-left p-3 text-sm font-semibold">Role</th>
                <th className="text-left p-3 text-sm font-semibold">Tester</th>
                <th className="text-left p-3 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {testPasses.map((tp) => (
                <tr key={tp.id} className="border-t border-surface-200-700">
                  <td className="p-3 text-sm">{tp.title}</td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tp.isStarted
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {tp.isStarted ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tp.isComplete
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {tp.isComplete ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{tp.testingRole || '—'}</td>
                  <td className="p-3 text-sm">
                    {tp.testingLoginUserName || '—'}
                  </td>
                  <td className="p-3 text-sm">
                    <Link
                      href={`/regression/continue/${tp.id}`}
                      className="text-primary-500 hover:text-primary-400 font-medium"
                    >
                      Continue
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
