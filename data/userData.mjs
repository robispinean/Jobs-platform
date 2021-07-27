import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'

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

const users = [
  {
    email: 'Admin.User@email.com',
    password: bcrypt.hashSync('12345', 10),
    role: roles[0],
  },
  {
    email: 'Company.User@email.com',
    password: bcrypt.hashSync('12345', 10),
    role: roles[1],
  },
  {
    email: 'Student.User@email.com',
    password: bcrypt.hashSync('12345', 10),
    role: roles[2],
  },
];

export { users, roles };
