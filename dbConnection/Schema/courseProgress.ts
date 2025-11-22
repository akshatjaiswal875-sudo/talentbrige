import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completedLectures: { type: [String], default: [] }, // Storing lecture IDs
  lastPlayedLectureId: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index to ensure one progress record per user per course
courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export const CourseProgress = mongoose.models.CourseProgress || mongoose.model("CourseProgress", courseProgressSchema);
