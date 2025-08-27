// import mongoose from "mongoose";

// const DBConnection=async()=>{
//     try {
//         mongoose.connect("mongodb://localhost:27017/Nextap",{
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
//             socketTimeoutMS: 45000,
//         })
//         console.log('mongodb connected')
//     } catch (error) {
//         console.log('mongodb error',error)
//     }
// }

// export default DBConnection

import mongoose from "mongoose";

let isConnected = false; // track connection state

const DBConnection = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5s instead of 30s
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default DBConnection;
