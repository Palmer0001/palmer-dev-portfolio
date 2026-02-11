import { connectDB, Ticket } from "@/app/models/Ticket";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ticket }, { status: 200 });
  } catch (err) {
    console.error("GET Ticket Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();
    const ticketData = body.formData;

    const updatedTicket = await Ticket.findByIdAndUpdate(id, ticketData, {
      new: true,
      runValidators: true
    });

    if (!updatedTicket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Ticket Updated", ticket: updatedTicket },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT Ticket Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Ticket Deleted", ticket: deletedTicket },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE Ticket Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message },
      { status: 500 }
    );
  }
}
