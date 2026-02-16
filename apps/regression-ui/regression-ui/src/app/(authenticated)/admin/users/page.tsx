'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  userService,
  User,
} from '../../../../lib/services/admin.service';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '' });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
    });
    setShowForm(true);
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return;
    }
    try {
      await userService.delete(user.id);
      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete user'
      );
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      const payload: Partial<User> = {
        username: formData.username,
        email: formData.email,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingUser) {
        await userService.update(editingUser.id, payload);
      } else {
        await userService.create(payload);
      }
      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save user'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-surface-900-50 text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchUsers}
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
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={handleAdd}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-100-800 rounded-xl p-6 shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add User'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-surface-200-700 border border-surface-300-600 focus:border-primary-500 focus:outline-none"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-surface-200-700 border border-surface-300-600 focus:border-primary-500 focus:outline-none"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password{editingUser ? ' (leave blank to keep)' : ''}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-surface-200-700 border border-surface-300-600 focus:border-primary-500 focus:outline-none"
                placeholder="Password"
              />
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
                Username
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold">
                Email
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-surface-900-50/60">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="even:bg-surface-200-700">
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
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
