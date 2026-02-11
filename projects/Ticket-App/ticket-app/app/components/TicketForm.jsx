"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TicketForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/tickets", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    router.push("/");
    router.refresh();
  };

  return (
    <form className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 space-y-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) =>
          setFormData({
            ...formData,
            title: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Description"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
      />

      <input
        placeholder="Category"
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) =>
          setFormData({
            ...formData,
            category: e.target.value,
          })
        }
      />

      <button className="w-full px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-500 active:scale-95">
        Create Ticket
      </button>
    </form>
  );
}
