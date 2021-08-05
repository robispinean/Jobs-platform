import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  accountRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  companyName: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: true,
  },
});

const Company = mongoose.model('Company', companySchema, 'companies');

export default Company;
