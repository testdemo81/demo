import retrievedModel from "../../DB/models/retrievedModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";



export const returnAllRetrivedForClient = async (req, res, next) => {
    const retrived = await retrievedModel.find({}).sort({"createdAt": -1})
        .populate({path: "productId", select: "name"})
        .populate({path: "invoiceId", select: "invoiceId"});
    if (!retrived)
        return next(new AppError("something went wrong try again", 400));
    return res.json({message: "success", retrived});
};


export const returnSpecificRetrivedForClient = async (req, res, next) => {
    const retrived = await retrievedModel.findOne({invoiceId:req.params.invoiceId})
        .populate({path: "productId", select: "name"})
        .populate({path: "invoiceId", select: "invoiceId"});
    if (!retrived)
        return next(new AppError("something went wrong try again", 400));
    return res.json({message: "success", retrived});
};