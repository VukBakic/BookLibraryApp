import mongoose from 'mongoose';

const GlobalSchema = new mongoose.Schema({
  bookOfTheDayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  updatedAt: {
    type: Date,
  },
  daysToReturn: {
    type: Number,
  },
  daysToExtend: {
    type: Number,
  },
});

GlobalSchema.virtual('bookOfTheDay', {
  ref: 'Book',
  localField: 'bookOfTheDayId',
  foreignField: '_id',
  justOne: true,
});

const Global = mongoose.model('Global', GlobalSchema);

export default Global;
