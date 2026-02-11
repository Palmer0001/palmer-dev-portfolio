"use client";

import { useRouter } from "next/navigation";

export default function TicketCard({ ticket }) {
  const router = useRouter();

  const deleteTicket = async () => {
    await fetch(`/api/tickets/${ticket._id}`, {
      method: "DELETE",
    });
    router.refresh();
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-5 transition-all duration-300 hover:border-blue-400/40 hover:shadow-2xl">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">
          {ticket.title}
        </h3>

        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold ${
            ticket.status === "open"
              ? "bg-green-500/20 text-green-300"
              : "bg-gray-500/20 text-gray-300"
          }`}
        >
          {ticket.status}
        </span>
      </div>

      <p className="text-gray-300 mb-3">
        {ticket.description}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-blue-300">
          #{ticket.category}
        </span>

        <button
          onClick={deleteTicket}
          className="text-sm bg-red-600/80 hover:bg-red-500 px-3 py-1 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
