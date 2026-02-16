'use client';

import { useEffect, useState } from 'react';
import {
  regressionService,
  RegressionHeader,
  ScenarioResult,
} from '../../../lib/services/regression.service';

const STATUS_COLORS: Record<string, string> = {
  Passed: 'bg-green-500/20 text-green-400',
  Failed: 'bg-red-500/20 text-red-400',
  'Un-Tested': 'bg-gray-500/20 text-gray-400',
  Blocked: 'bg-yellow-500/20 text-yellow-400',
  Skipped: 'bg-blue-500/20 text-blue-400',
};

const BAR_COLORS: Record<string, string> = {
  Passed: 'bg-green-500',
  Failed: 'bg-red-500',
  'Un-Tested': 'bg-gray-500',
  Blocked: 'bg-yellow-500',
  Skipped: 'bg-blue-500',
};

export default function DashboardPage() {
  const [headers, setHeaders] = useState<RegressionHeader[]>([]);
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [headersData, resultsData] = await Promise.all([
          regressionService.getHeaders(),
          regressionService.getScenarioResults(),
        ]);
        setHeaders(headersData);
        setResults(resultsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Loading dashboard...</div>
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

  const totalRegressions = headers.length;
  const activeTestPasses = headers.reduce(
    (count, h) =>
      count + h.testPasses.filter((tp) => tp.isStarted && !tp.isComplete).length,
    0
  );
  const completedCount = results.filter((r) => r.status === 'Passed').length;
  const passRate =
    results.length > 0
      ? ((completedCount / results.length) * 100).toFixed(1)
      : '0';

  const statusCounts: Record<string, number> = {
    Passed: 0,
    Failed: 0,
    'Un-Tested': 0,
    Blocked: 0,
    Skipped: 0,
  };
  results.forEach((r) => {
    if (statusCounts[r.status] !== undefined) {
      statusCounts[r.status]++;
    }
  });
  const maxCount = Math.max(...Object.values(statusCounts), 1);

  const recentResults = [...results]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-100-800 rounded-xl p-6 shadow">
          <p className="text-sm text-gray-400">Total Regressions</p>
          <p className="text-3xl font-bold mt-2">{totalRegressions}</p>
        </div>
        <div className="bg-surface-100-800 rounded-xl p-6 shadow">
          <p className="text-sm text-gray-400">Active Test Passes</p>
          <p className="text-3xl font-bold mt-2">{activeTestPasses}</p>
        </div>
        <div className="bg-surface-100-800 rounded-xl p-6 shadow">
          <p className="text-sm text-gray-400">Completed</p>
          <p className="text-3xl font-bold mt-2">{completedCount}</p>
        </div>
        <div className="bg-surface-100-800 rounded-xl p-6 shadow">
          <p className="text-sm text-gray-400">Pass Rate</p>
          <p className="text-3xl font-bold mt-2">{passRate}%</p>
        </div>
      </div>

      {/* Status Bar Chart */}
      <div className="bg-surface-100-800 rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Results by Status</h2>
        <div className="flex items-end gap-4 h-48">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="flex flex-col items-center flex-1 h-full justify-end"
            >
              <span className="text-sm font-medium mb-1">{count}</span>
              <div
                className={`${BAR_COLORS[status]} w-full rounded-t transition-all`}
                style={{
                  height: `${(count / maxCount) * 100}%`,
                  minHeight: count > 0 ? '8px' : '0px',
                }}
              />
              <span className="text-xs text-gray-400 mt-2 text-center">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Scenario Results Table */}
      <div className="bg-surface-100-800 rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Scenario Results</h2>
        {recentResults.length === 0 ? (
          <p className="text-gray-400">No scenario results yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-200-700">
                  <th className="text-left p-3 text-sm font-semibold">
                    Scenario
                  </th>
                  <th className="text-left p-3 text-sm font-semibold">
                    Status
                  </th>
                  <th className="text-left p-3 text-sm font-semibold">
                    Completed By
                  </th>
                  <th className="text-left p-3 text-sm font-semibold">Date</th>
                  <th className="text-left p-3 text-sm font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((result) => (
                  <tr
                    key={result.id}
                    className="border-t border-surface-200-700"
                  >
                    <td className="p-3 text-sm">
                      {result.scenario?.name ?? '—'}
                    </td>
                    <td className="p-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          STATUS_COLORS[result.status] ?? ''
                        }`}
                      >
                        {result.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{result.completedBy || '—'}</td>
                    <td className="p-3 text-sm">
                      {result.timestamp
                        ? new Date(result.timestamp).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="p-3 text-sm truncate max-w-xs">
                      {result.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
