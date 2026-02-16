'use client';

import { useEffect, useState } from 'react';
import {
  regressionService,
  RegressionHeader,
} from '../../../../lib/services/regression.service';

export default function RegressionHistoryPage() {
  const [headers, setHeaders] = useState<RegressionHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await regressionService.getHeaders();
        setHeaders(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load regression history'
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
        <div className="text-lg text-gray-400">Loading history...</div>
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
      <h1 className="text-2xl font-bold">Regression History</h1>

      <div className="bg-surface-100-800 rounded-xl p-6 shadow overflow-x-auto">
        {headers.length === 0 ? (
          <p className="text-gray-400">No regression headers found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-200-700">
                <th className="text-left p-3 text-sm font-semibold">Name</th>
                <th className="text-left p-3 text-sm font-semibold">
                  Release
                </th>
                <th className="text-left p-3 text-sm font-semibold">
                  Start Date
                </th>
                <th className="text-left p-3 text-sm font-semibold">
                  End Date
                </th>
                <th className="text-left p-3 text-sm font-semibold">
                  Started
                </th>
                <th className="text-left p-3 text-sm font-semibold">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody>
              {headers.map((header) => (
                <tr
                  key={header.id}
                  className="border-t border-surface-200-700"
                >
                  <td className="p-3 text-sm">{header.name}</td>
                  <td className="p-3 text-sm">{header.releaseName || '—'}</td>
                  <td className="p-3 text-sm">
                    {header.startDate
                      ? new Date(header.startDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="p-3 text-sm">
                    {header.endDate
                      ? new Date(header.endDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        header.isStarted
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {header.isStarted ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        header.isComplete
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {header.isComplete ? 'Yes' : 'No'}
                    </span>
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
