import mongoose from "mongoose";

const DBConnection=async()=>{
    try {
        mongoose.connect("mongodb://localhost:27017/Nextap",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
            socketTimeoutMS: 45000,
        })
        console.log('mongodb connected')
    } catch (error) {
        console.log('mongodb error',error)
    }
}

export default DBConnection