import mongoose, { Schema, Model } from "mongoose";

export interface IBookmark {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate bookmarks
BookmarkSchema.index({ userId: 1, questionId: 1 }, { unique: true });

const Bookmark: Model<IBookmark> =
  (mongoose.models && mongoose.models.Bookmark) || 
  mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;
