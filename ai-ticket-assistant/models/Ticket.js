import mongoose, { mongo } from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "TODO",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    priority: {
      type: String,
    },
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Tickets", ticketSchema);
