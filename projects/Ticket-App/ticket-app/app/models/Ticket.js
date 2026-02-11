import mongoose, { Schema } from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Bug", "Feature", "Enhancement", "Question", "Hardware", "Software", "Network"]
    },
    priority: {
      type: Number,
      required: true,
      min: [1, "Priority must be at least 1"],
      max: [5, "Priority cannot exceed 5"]
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      default: "Open",
      enum: ["Open", "Started", "In Progress", "Resolved", "Closed"]
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for better query performance
ticketSchema.index({ title: "text", description: "text" });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: -1 });

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export { Ticket, connectDB };
