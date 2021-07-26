import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
})

const Role = mongoose.model('Role', roleSchema, 'roles');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: roleSchema,
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema, 'users');

export { User, Role }
