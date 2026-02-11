'use client';

import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PriorityDisplay({ priority = 3 }) {
  const getPriorityColor = (level) => {
    const colors = {
      1: 'text-gray-400',
      2: 'text-blue-400',
      3: 'text-green-400',
      4: 'text-yellow-400',
      5: 'text-red-400',
    };
    return colors[level] || colors[3];
  };

  const getPriorityLabel = (level) => {
    const labels = {
      1: 'Lowest',
      2: 'Low',
      3: 'Medium',
      4: 'High',
      5: 'Critical',
    };
    return labels[level] || labels[3];
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex gap-1 ${getPriorityColor(priority)}`}>
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faFlag}
            className={i < priority ? 'opacity-100' : 'opacity-20'}
            size="xs"
          />
        ))}
      </div>
      <span className="text-xs text-white/60">{getPriorityLabel(priority)}</span>
    </div>
  );
}