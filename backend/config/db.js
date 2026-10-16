import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(`${process.env.MONGO_URI}EVENTORA`);
        console.log("Connection Successful!");
    } catch(error){
        console.error("Connection failed", error.message);
        process.exit(1);
    }
}

export default connectDB;