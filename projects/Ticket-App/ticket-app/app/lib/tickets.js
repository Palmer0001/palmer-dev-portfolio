import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    status: {
      type: String,
      default: "open",
    },
  },
  { timestamps: true }
);

export const Ticket =
  mongoose.models.Ticket ||
  mongoose.model("Ticket", TicketSchema);
