'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import StatusDisplay from './StatusDisplay';
import PriorityDisplay from './PriorityDisplay';
import ProgressDisplay from './ProgressDisplay';
import { formatDate } from '@/app/lib/utils';

export default function TicketCard({ ticket, onDelete, onEdit }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!ticket?._id) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/tickets/${ticket._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Delete failed');
      }

      onDelete?.(ticket._id);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="card group animate-slide-in">
      <div className="flex justify-between items-start mb-3">
        <PriorityDisplay priority={ticket.priority} />

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit?.(ticket)}
            className="text-white/40 hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="text-white/40 hover:text-red-400 transition-colors"
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2 line-clamp-1">{ticket.title}</h3>
      <p className="text-white/70 mb-4 text-sm line-clamp-2">{ticket.description}</p>

      <div className="space-y-3">
        <ProgressDisplay progress={ticket.progress} />

        <div className="flex justify-between items-center">
          <StatusDisplay status={ticket.status} />
          <span className="text-xs text-white/40">
            {formatDate(ticket.createdAt)}
          </span>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass p-6 max-w-sm w-full mx-4">
            <h4 className="text-lg font-semibold mb-2">Delete Ticket</h4>
            <p className="text-white/70 mb-4">
              Are you sure you want to delete this ticket?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-primary bg-red-600 hover:bg-red-500"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
