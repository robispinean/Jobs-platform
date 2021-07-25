import mongoose from 'mongoose';


const { DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_URI } = process.env;

const connectDB = async () => {
    try{
    mongoose.connect(
        `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URI}/${DB_DATABASE}?retryWrites=true&w=majority`,
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useFindAndModify: false 
        })
    } catch(error){
        console.error(`Error ${error.message}`)
        process.exit(1)
    }
}

export default connectDB