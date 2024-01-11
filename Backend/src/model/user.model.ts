import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['admin', 'moderator', 'user'],
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img_path: {
      type: String,
    },
    active: { type: Boolean, required: true, default: false },
    blocked: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next: any) {
  let user = this;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model('User', UserSchema);

export default User;
