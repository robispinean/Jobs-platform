import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  accountRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  nickName: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model('Admin', adminSchema, 'admins');

export default Admin;
