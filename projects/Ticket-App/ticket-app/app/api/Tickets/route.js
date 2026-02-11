import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Ticket } from "@/app/models/Ticket";

export async function GET() {
  await connectDB();
  const tickets = await Ticket.find().sort({
    createdAt: -1,
  });
  return NextResponse.json({ tickets });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const newTicket = await Ticket.create(body);

  return NextResponse.json({
    ticket: newTicket,
  });
}
