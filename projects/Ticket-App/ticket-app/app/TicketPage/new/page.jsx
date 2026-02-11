import TicketForm from "@/app/components/TicketForm";

export default function NewTicketPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create New Ticket
      </h1>

      <TicketForm />
    </div>
  );
}
