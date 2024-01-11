import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
