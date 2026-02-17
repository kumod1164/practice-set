import mongoose, { Schema, Model } from "mongoose";

export interface ITest {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  questions: mongoose.Types.ObjectId[];
  answers: (0 | 1 | 2 | 3 | null)[];
  markedForReview: boolean[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  timeTaken: number;
  timeExtensions: number;
  startedAt: Date;
  submittedAt: Date;
  topicWisePerformance: {
    topic: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
  difficultyWisePerformance: {
    difficulty: "easy" | "medium" | "hard";
    correct: number;
    total: number;
    accuracy: number;
  }[];
}

const TestSchema = new Schema<ITest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    answers: [
      {
        type: Number,
        min: 0,
        max: 3,
        default: null,
      },
    ],
    markedForReview: [
      {
        type: Boolean,
        default: false,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
    },
    unansweredQuestions: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
    timeExtensions: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      required: true,
    },
    topicWisePerformance: [
      {
        topic: String,
        correct: Number,
        total: Number,
        accuracy: Number,
      },
    ],
    difficultyWisePerformance: [
      {
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
        },
        correct: Number,
        total: Number,
        accuracy: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient history queries
TestSchema.index({ userId: 1, submittedAt: -1 });

const Test: Model<ITest> = 
  (mongoose.models && mongoose.models.Test) || 
  mongoose.model<ITest>("Test", TestSchema);

export default Test;
