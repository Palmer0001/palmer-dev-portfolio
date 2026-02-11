'use client';

import TicketForm from '@/app/components/tickets/TicketForm';

export default function NewTicketPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Create New Ticket</h1>
        <p className="text-white/60">
          Submit a new support request or feature suggestion
        </p>
      </div>

      <TicketForm />
    </div>
  );
}
