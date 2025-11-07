import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: "Remote" },
  stipend: { type: String, default: "Unpaid" },
  skillsRequired: { type: [String], default: [] },
  lastDateToApply: { type: Date },
  postedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Internship = mongoose.models.Internship || mongoose.model("Internship", internshipSchema);
