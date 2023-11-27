import mongoose from "mongoose";
const connectionDB= async ()=>{
    return await mongoose
        .connect("mongodb+srv://testdemotestdemo81:3t07G6LDfeYGAONy@cluster0.nrhhzsl.mongodb.net/test", )
        .then(()=>console.log("DB connected"))
        .catch((err)=>console.log(err));
};

mongoose.set("strictQuery",true);
export default connectionDB;