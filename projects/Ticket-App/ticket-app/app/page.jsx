import React from "react";
import TicketCard from "./(components)/TicketCard";
import { fetchTickets } from "./lib/api";

const Dashboard = async () => {
  let data;
  let error = null;

  try {
    data = await fetchTickets();
  } catch (err) {
    error = err.message;
    console.error("Error loading tickets: ", err);
  }

  // Show error state
  if (error) {
    return (
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Tickets</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!data?.tickets || data.tickets.length === 0) {
    return (
      <div className="p-5">
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No Tickets Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first ticket to get started!
          </p>
          <a 
            href="/TicketPage/new" 
            className="btn inline-block"
          >
            Create New Ticket
          </a>
        </div>
      </div>
    );
  }

  const tickets = data.tickets;
  const uniqueCategories = [
    ...new Set(tickets?.map(({ category }) => category)),
  ];

  return (
    <div className="p-5">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-default-text">Ticket Dashboard</h1>
          <a 
            href="/TicketPage/new" 
            className="btn"
          >
            New Ticket
          </a>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Total Tickets: {tickets.length}
        </p>
      </div>
      
      <div>
        {tickets &&
          uniqueCategories?.map((uniqueCategory, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                {uniqueCategory}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({tickets.filter((ticket) => ticket.category === uniqueCategory).length})
                </span>
              </h2>
              <div className="lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tickets
                  .filter((ticket) => ticket.category === uniqueCategory)
                  .map((filteredTicket, index) => (
                    <TicketCard
                      key={filteredTicket._id}
                      ticket={filteredTicket}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;