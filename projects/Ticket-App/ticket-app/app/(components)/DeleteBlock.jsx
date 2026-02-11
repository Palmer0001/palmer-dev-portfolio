"use client";

import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteBlock = ({ id }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteTicket = async () => {
    if (!confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/Tickets/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete ticket");
      }

      router.refresh();
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={faX}
        className={`text-red-400 hover:cursor-pointer hover:text-red-200 ${
          isDeleting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={isDeleting ? undefined : deleteTicket}
        title={isDeleting ? "Deleting..." : "Delete ticket"}
      />
      {isDeleting && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Deleting...
        </span>
      )}
      {error && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {error}
        </span>
      )}
    </div>
  );
};

export default DeleteBlock;