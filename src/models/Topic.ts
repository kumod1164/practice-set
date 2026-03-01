import mongoose, { Schema, Model } from "mongoose";

export interface ITopic {
  _id: mongoose.Types.ObjectId;
  superTopic: string;
  topic: string;
  subtopic: string;
  order: number;
  isActive: boolean;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    superTopic: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
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
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    questionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for uniqueness and efficient queries
TopicSchema.index({ superTopic: 1, topic: 1, subtopic: 1 }, { unique: true });
TopicSchema.index({ superTopic: 1, order: 1 });

const Topic: Model<ITopic> =
  (mongoose.models && mongoose.models.Topic) || 
  mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
