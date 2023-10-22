import mongoose from "mongoose";
const connectionDB= async ()=>{
    return await mongoose
        .connect(process.env.DB_CLOUD, )
        .then(()=>console.log("DB connected"))
        .catch((err)=>console.log(err));
};

mongoose.set("strictQuery",true);
export default connectionDB;