'use client';

export default function StatusDisplay({ status = 'open' }) {
  const statusConfig = {
    open: {
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      label: 'Open',
    },
    'in progress': {
      color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      label: 'In Progress',
    },
    done: {
      color: 'bg-green-500/20 text-green-300 border-green-500/30',
      label: 'Done',
    },
    resolved: {
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      label: 'Resolved',
    },
    closed: {
      color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      label: 'Closed',
    },
  };

  const config = statusConfig[status] || statusConfig.open;

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full border font-semibold ${config.color}`}
    >
      {config.label}
    </span>
  );
}