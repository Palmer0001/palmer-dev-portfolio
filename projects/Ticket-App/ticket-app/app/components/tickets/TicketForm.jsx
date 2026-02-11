'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function TicketForm({ ticket, onSubmit }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: ticket?.title || '',
    description: ticket?.description || '',
    category: ticket?.category || 'General',
    status: ticket?.status || 'open',
    priority: ticket?.priority || 3,
    progress: ticket?.progress || 0,
  });

  const categories = ['General', 'Bug', 'Feature Request', 'Support', 'Billing'];
  const statuses = ['open', 'in progress', 'done', 'resolved', 'closed'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = ticket?._id 
        ? `/api/tickets/${ticket._id}`
        : '/api/tickets';
      
      const method = ticket?._id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save ticket');
      }

      onSubmit?.(data.ticket);
      router.push('/tickets');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium mb-2 text-white/80">
          Title
        </label>
        <input
          type="text"
          required
          className="input"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter ticket title"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white/80">
          Description
        </label>
        <textarea
          required
          rows="4"
          className="input resize-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the issue or request"
          maxLength={1000}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">
            Category
          </label>
          <select
            className="input"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-800">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">
            Status
          </label>
          <select
            className="input"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            {statuses.map((status) => (
              <option key={status} value={status} className="bg-slate-800">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">
            Priority (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            className="input"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">
            Progress (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="input"
            value={formData.progress}
            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary min-w-[120px]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Saving...</span>
            </div>
          ) : (
            ticket ? 'Update Ticket' : 'Create Ticket'
          )}
        </button>
      </div>
    </form>
  );
}