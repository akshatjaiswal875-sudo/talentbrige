import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILecture {
  title: string;
  videoUrl: string;
  duration?: string;
  description?: string;
  isPreview?: boolean;
  notesUrl?: string;
}

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface ICourse extends Document {
  title: string;
  category: string;
  price: string;
  duration: string;
  bannerUrl: string;
  description: string;
  syllabus: string[];
  lectures: ILecture[];
  questions: IQuestion[];
  createdAt: Date;
}

const LectureSchema = new Schema<ILecture>({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: String },
  description: { type: String },
  isPreview: { type: Boolean, default: false },
  notesUrl: { type: String },
});

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
});

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String },
  duration: { type: String },
  bannerUrl: { type: String },
  description: { type: String },
  syllabus: { type: [String], default: [] },
  lectures: { type: [LectureSchema], default: [] },
  questions: { type: [QuestionSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
