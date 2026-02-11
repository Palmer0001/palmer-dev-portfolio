import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import { Ticket } from '@/app/models/Ticket';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const ticket = await Ticket.findById(params.id);
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ ticket, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ticket', success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const ticket = await Ticket.findByIdAndDelete(params.id);
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Ticket deleted successfully', success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete ticket', success: false },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    
    const ticket = await Ticket.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ ticket, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update ticket', success: false },
      { status: 500 }
    );
  }
}