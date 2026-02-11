import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Bug', 'Feature Request', 'Support', 'Billing'],
    },
    status: {
      type: String,
      default: 'open',
      enum: ['open', 'in progress', 'done', 'closed', 'resolved'],
    },
    priority: {
      type: Number,
      default: 3,
      min: 1,
      max: 5,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    assignedTo: {
      type: String,
      default: 'Unassigned',
    },
    createdBy: {
      type: String,
      default: 'System',
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);