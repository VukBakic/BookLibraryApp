import mongoose from 'mongoose';
import Global from './global.model';

const BorrowSchema = new mongoose.Schema(
  {
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
    returned: {
      type: Boolean,
      required: true,
      default: false,
    },
    extended: {
      type: Boolean,
      required: true,
      default: false,
    },
    dateToReturn: { type: Date },
    dateOfReturn: { type: Date },
  },
  { timestamps: true }
);

BorrowSchema.pre('save', async function (next: any) {
  let book = this;

  if (!book.isModified('updatedAt')) return next();

  const daysToReturnFromConfig = await Global.findOne(
    {},
    'daysToReturn'
  ).lean();

  let temp = new Date();
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + daysToReturnFromConfig.daysToReturn);

  book.dateToReturn = temp;

  return next();
});
const Borrow = mongoose.model('Borrow', BorrowSchema);

export default Borrow;
