import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  accountRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model('Student', studentSchema, 'students');

export default Student;
