'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TicketCard from './TicketCard';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function KanbanBoard({ tickets = [], onTicketUpdate }) {
  const [loading, setLoading] = useState(false);

  const columns = {
    open: {
      name: 'Open',
      items: tickets.filter(t => t.status === 'open'),
    },
    'in progress': {
      name: 'In Progress',
      items: tickets.filter(t => t.status === 'in progress'),
    },
    done: {
      name: 'Done',
      items: tickets.filter(t => t.status === 'done'),
    },
    resolved: {
      name: 'Resolved',
      items: tickets.filter(t => t.status === 'resolved'),
    },
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setLoading(true);
    try {
      const ticket = tickets.find(t => t._id === draggableId);
      
      const res = await fetch(`/api/tickets/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: destination.droppableId,
          progress: destination.droppableId === 'done' || destination.droppableId === 'resolved' ? 100 : 50,
        }),
      });

      if (res.ok) {
        onTicketUpdate?.();
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
          <LoadingSpinner />
        </div>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`glass p-4 min-h-[500px] ${
                    snapshot.isDraggingOver ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">{column.name}</h2>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-sm">
                      {column.items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {column.items.map((ticket, index) => (
                      <Draggable
                        key={ticket._id}
                        draggableId={ticket._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                          >
                            <TicketCard ticket={ticket} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}