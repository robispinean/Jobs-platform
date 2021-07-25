import dotenv from 'dotenv'
import Post from "./models/postModel.mjs"
import User from "./models/user.mjs"
import Comment from "./models/commentModel.mjs"
import users from "./data/userData.mjs"
import posts from "./data/postData.mjs"
import comments from "./data/commentData.mjs"
import connectDB from "./config/db.mjs"

dotenv.config();

connectDB()

const importData = async () => {
    try {
        await Comment.deleteMany()
        await Post.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)
        const admin = createdUsers[0]._id

        const sampleComments = comments.map(comment => {
            return { ...comment, owner: admin }
        })
        const insertedComments = await Comment.insertMany(sampleComments)

        let samplePosts = posts.map(post => {
            return { ...post, owner: admin, comments: insertedComments }
        })
        await Post.insertMany(samplePosts)

        console.log('Data imported')
        process.exit()
    } catch (error) {
        console.error(`${error.message}`)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Comment.deleteMany()
        await Post.deleteMany()
        await User.deleteMany()

        console.log('Data removed')
        process.exit()
    } catch (error) {
        console.error(`${error.message}`)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}