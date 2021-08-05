import Admin from './models/adminModel.mjs';
import Comment from './models/commentModel.mjs';
import Company from './models/companyModel.mjs';
import Post from './models/postModel.mjs';
import Role from './models/roleModel.mjs';
import Student from './models/studentModel.mjs';
import User from './models/userModel.mjs';

import comments from './data/commentData.mjs';
import posts from './data/postData.mjs';
import roles from './data/roleData.mjs';
import users from './data/userData.mjs';

import connectDB from './config/db.mjs';

connectDB();

const clearData = async () => {
  await Comment.deleteMany();
  await Post.deleteMany();
  await User.deleteMany();
  await Role.deleteMany();
  await Admin.deleteMany();
  await Company.deleteMany();
  await Student.deleteMany();
};

const importData = async () => {
  try {
    await clearData();

    await Role.insertMany(roles);

    const createdUsers = await User.insertMany(users);
    const admin = createdUsers[0]._id;

    const samplePosts = posts.map((post) => ({ ...post, owner: admin }));
    const insertedPosts = await Post.insertMany(samplePosts);

    const sampleComments = comments.map((comment) => ({ ...comment, owner: admin, post: insertedPosts[0] }));
    await Comment.insertMany(sampleComments);

    console.log('Data imported');
    process.exit(0);
  } catch (error) {
    console.error(`${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await clearData();

    console.log('Data removed');
    process.exit(0);
  } catch (error) {
    console.error(`${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
