import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import { Ticket } from '@/app/models/Ticket';

export async function GET() {
  try {
    await connectDB();
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    return NextResponse.json({ tickets, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tickets', success: false },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    const newTicket = await Ticket.create({
      ...body,
      progress: body.status === 'done' ? 100 : body.progress || 0,
    });

    return NextResponse.json({ ticket: newTicket, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create ticket', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required', success: false },
        { status: 400 }
      );
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ ticket: updatedTicket, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update ticket', success: false },
      { status: 500 }
    );
  }
}