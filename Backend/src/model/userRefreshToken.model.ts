import mongoose from 'mongoose';

const UserRefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const UserRefreshToken = mongoose.model(
  'UserRefreshToken',
  UserRefreshTokenSchema
);

export default UserRefreshToken;
