import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: [{ type: String }],
    publisher: {
      type: String,
      required: true,
    },
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
      },
    ],
    year: { type: Number, required: true },
    language: { type: String, required: true },
    img_path: { type: String },
    count: { type: Number, required: true, default: 1 },
    taken: { type: Number, required: true, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', BookSchema);

export default Book;
