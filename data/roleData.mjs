import mongoose from 'mongoose';

const roles = [
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'admin',
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'company',
  },
  {
    _id: new mongoose.Types.ObjectId().toHexString(),
    name: 'student',
  },
];

export default roles;
