import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Ticket } from "@/app/models/Ticket";

export async function DELETE(req, { params }) {
  await connectDB();

  await Ticket.findByIdAndDelete(params.id);

  return NextResponse.json({
    message: "Deleted",
  });
}
