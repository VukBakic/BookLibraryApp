import mongoose from 'mongoose';

const AdminRefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
});

const AdminRefreshToken = mongoose.model(
  'AdminRefreshToken',
  AdminRefreshTokenSchema
);

export default AdminRefreshToken;
