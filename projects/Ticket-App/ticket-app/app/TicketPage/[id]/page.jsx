"use client";

import EditTicketForm from "@/app/(components)/EditTicketForm";
import { fetchTicketById } from "@/app/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link

const TicketPage = ({ params }) => {
  const isEditMode = params.id !== "new";
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await fetchTicketById(params.id);
          setTicketData(data.ticket);
        } catch (err) {
          setError(err.message);
          console.error(`Error fetching ticket ${params.id}:`, err);
        } finally {
          setLoading(false);
        }
      } else {
        setTicketData({ _id: "new" });
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error state
  if (error && isEditMode) {
    return (
      <div className="p-5">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h2 className="text-red-800 dark:text-red-300 font-semibold">Error Loading Ticket</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <div className="mt-4">
            <Link 
              href="/" 
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer mr-2 inline-block"
            >
              Back to Dashboard
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer inline-block"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <EditTicketForm ticket={ticketData} />;
};

export default TicketPage;