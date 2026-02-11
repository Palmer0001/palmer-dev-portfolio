import { connectDB } from "./lib/db";
import { Ticket } from "./models/Ticket";
import TicketCard from "./components/TicketCard";
import Link from "next/link";

export default async function Dashboard() {
  await connectDB();
  const tickets = await Ticket.find().lean();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            🎫 Ticket Dashboard
          </h1>
          <p className="text-gray-400">
            Manage and track support requests
          </p>
        </div>

        <Link
          href="/TicketPage/new"
          className="px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-500 active:scale-95"
        >
          + New Ticket
        </Link>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket._id.toString()}
            ticket={{
              ...ticket,
              _id: ticket._id.toString(),
            }}
          />
        ))}
      </div>
    </div>
  );
}
