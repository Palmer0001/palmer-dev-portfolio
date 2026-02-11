"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const EditTicketForm = ({ ticket = {}, onError }) => {
  const router = useRouter();
  const isEditMode = ticket && ticket._id && ticket._id !== "new";
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: 1,
    progress: 0,
    status: "Open",
    category: "Hardware",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || 1,
        progress: ticket.progress || 0,
        status: ticket.status || "Open",
        category: ticket.category || "Hardware",
      });
    }
  }, [isEditMode, ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" || name === "progress" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);

    try {
      const url = isEditMode ? `/api/Tickets/${ticket._id}` : "/api/Tickets";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Request failed");
      }

      router.refresh();
      router.push("/");
    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Hardware",
    "Software",
    "Network",
    "Bug",
    "Feature",
    "Enhancement",
    "Question",
  ];

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h3>{isEditMode ? "Update Your Ticket" : "Create New Ticket"}</h3>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <label>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required
          value={formData.title}
        />

        <label>Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required
          value={formData.description}
          rows="5"
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label>Priority</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <label key={level}>
              <input
                type="radio"
                name="priority"
                value={level}
                checked={formData.priority === level}
                onChange={handleChange}
              />
              {level}
            </label>
          ))}
        </div>

        <label>Progress</label>
        <input
          type="range"
          id="progress"
          name="progress"
          value={formData.progress}
          min="0"
          max="100"
          onChange={handleChange}
        />

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Open">Open</option>
          <option value="Started">Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          type="submit"
          className="btn max-w-xs"
          value={loading ? "Saving..." : isEditMode ? "Update Ticket" : "Create Ticket"}
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default EditTicketForm;
