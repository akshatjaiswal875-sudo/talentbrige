import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true, index: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeLink: { type: String },
  message: { type: String },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);
