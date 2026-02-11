import { connectDB, Ticket } from "@/app/models/Ticket";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    return NextResponse.json({ tickets }, { status: 200 });
  } catch (err) {
    console.error("GET Tickets Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const ticketData = body.formData;

    // Validate required fields
    if (!ticketData.title || !ticketData.description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    const newTicket = await Ticket.create(ticketData);
    return NextResponse.json(
      { message: "Ticket Created", ticket: newTicket },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST Ticket Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message },
      { status: 500 }
    );
  }
}
