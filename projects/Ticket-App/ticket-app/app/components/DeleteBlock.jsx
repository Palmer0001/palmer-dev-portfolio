"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteBlock = ({ id }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteTicket = async () => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete ticket");
      }

      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={faXmark}
        className="text-red-400 hover:text-red-200 cursor-pointer"
        onClick={isDeleting ? undefined : deleteTicket}
      />
    </div>
  );
};

export default DeleteBlock;
