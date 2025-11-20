import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  googleId: { type: String },
  image: { type: String },
  bestScores: {
    aptitude: { type: Number, default: 0 },
    gn: { type: Number, default: 0 },
  },
  enrolledCourses: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
