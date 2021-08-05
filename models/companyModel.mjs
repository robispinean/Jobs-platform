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
});

const Company = mongoose.model('Company', companySchema, 'companies');

export default Company;
