import { connectDB } from '@/app/lib/db';
import { Ticket } from '@/app/models/Ticket';
import KanbanBoard from '@/app/components/tickets/KanbanBoard';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default async function TicketsPage() {
  await connectDB();
  const tickets = await Ticket.find().sort({ createdAt: -1 }).lean();
  
  const serializedTickets = tickets.map(ticket => ({
    ...ticket,
    _id: ticket._id.toString(),
    createdAt: ticket.createdAt?.toISOString(),
    updatedAt: ticket.updatedAt?.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tickets</h1>
          <p className="text-white/60">Drag and drop to update ticket status</p>
        </div>
        
        <Link
          href="/tickets/new"
          className="btn-primary flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          New Ticket
        </Link>
      </div>

      <KanbanBoard tickets={serializedTickets} />
    </div>
  );
}