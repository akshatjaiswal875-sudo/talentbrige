import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  testType: { type: String, enum: ["aptitude", "gn"], default: "aptitude" },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: { type: [mongoose.Schema.Types.Mixed], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Assessment = mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);
