import mongoose, { Schema, Model } from "mongoose";

export interface ITestSession {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  questions: mongoose.Types.ObjectId[];
  answers: (0 | 1 | 2 | 3 | null)[];
  markedForReview: boolean[];
  currentQuestionIndex: number;
  remainingTime: number;
  timeExtensions: number;
  startedAt: Date;
  expiresAt: Date;
}

const TestSessionSchema = new Schema<ITestSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
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
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  remainingTime: {
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
  expiresAt: {
    type: Date,
    required: true,
  },
});

// TTL index to auto-delete expired sessions after 24 hours
// Note: The index is created with expireAfterSeconds option
TestSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

const TestSession: Model<ITestSession> =
  (mongoose.models && mongoose.models.TestSession) || 
  mongoose.model<ITestSession>("TestSession", TestSessionSchema);

export default TestSession;
