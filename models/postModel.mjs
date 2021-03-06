import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
    enum: ['offer', 'request'],
    default: 'offer',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  languages: [
    {
      type: String,
      required: true,
    },
  ],
  workHour: {
    type: String,
    required: true,
    enum: ['part-time', 'full-time'],
    default: 'full-time',
  },
  workPlace: {
    type: String,
    required: true,
    enum: ['remote', 'onsite'],
    default: 'onsite',
  },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;
