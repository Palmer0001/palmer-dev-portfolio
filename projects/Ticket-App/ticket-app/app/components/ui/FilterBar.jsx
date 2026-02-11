'use client';

import { useState } from 'react';

export default function FilterBar({ onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { value: 'all', label: 'All Tickets' },
    { value: 'open', label: 'Open' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'resolved', label: 'Resolved' },
  ];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter.value);
    onFilterChange?.(filter.value);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilterClick(filter)}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            activeFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'glass hover:bg-white/10'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}