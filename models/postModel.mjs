import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    languages: [
        {
            type: String,
            required: true
        }
    ],
    workHour: {
        type: String,
        required: true
    },
    workPlace: {
        type: String,
        required: true
    },
    comments: [
        {
            comment: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        }
    ]
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)

export default Post