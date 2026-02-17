import mongoose, { Schema, Model } from "mongoose";

export interface IQuestion {
  _id: mongoose.Types.ObjectId;
  topic: string;
  subtopic: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    topic: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    subtopic: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v.length === 4 && v.every((opt) => opt.length >= 1 && opt.length <= 500);
        },
        message: "Must have exactly 4 options, each between 1-500 characters",
      },
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    explanation: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient filtering
QuestionSchema.index({ topic: 1, subtopic: 1, difficulty: 1 });

const Question: Model<IQuestion> =
  (mongoose.models && mongoose.models.Question) || 
  mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
