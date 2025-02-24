// import mongoose from 'mongoose';

// const dbConnect = async () => {
//   if (mongoose.connection.readyState >= 1) return;

//   return mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// export default dbConnect;


import mongoose from "mongoose";


const connectDb = handler =>async(req,res)=>{
    if(mongoose.connections[0].readyState){
        return handler(req, res)
    }
    await mongoose.connect(process.env.MONGODB_URI)
    return handler(req,res);
}

export default connectDb; 