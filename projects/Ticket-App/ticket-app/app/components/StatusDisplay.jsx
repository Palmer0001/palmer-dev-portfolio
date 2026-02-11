"use client";
import React from "react";

const StatusDisplay = ({ status }) => {
  const getColor = (status) => {
    switch (status.toLowerCase()) {
      case "done":
        return "bg-green-200";
      case "started":
        return "bg-yellow-200";
      case "not started":
        return "bg-red-200";
      case "open":
        return "bg-blue-200";
      case "in progress":
        return "bg-orange-200";
      case "resolved":
        return "bg-green-300";
      case "closed":
        return "bg-gray-400";
      default:
        return "bg-slate-700";
    }
  };

  return (
    <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold text-gray-700 ${getColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusDisplay;
