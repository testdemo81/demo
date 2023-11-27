import retrievedModel from "../../DB/models/retrievedModel.js";
import clientModel from "../../DB/models/clientModel.js";
import invoiceModel from "../../DB/models/invoiceModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";


export const returnAllRetrieved = async (req, res, next) => {
    const retrieved = await retrievedModel.find({}).sort({"createdAt": -1})
        .populate({path: "productId", select: "name"})
        .populate({path: "invoiceId", select: "invoiceId"})
        .populate({path: "userId", select: "name"})
        .populate({path: "clientId", select: "name"});
    if (!retrieved)
        return next(new AppError("something went wrong try again", 400));
    return res.json({message: "success", retrieved});
};

export const returnSpecificRetrievedByInvoice = async (req, res, next) => {
    const invoice = await invoiceModel.findOne({invoiceId:req.params.invoiceId})
    if (!invoice)
        return next(new AppError("invoice not found", 400));
    const retrieved = await retrievedModel.findOne({invoiceId:invoice._id})
        .populate({path: "productId", select: "name"})
        .populate({path: "invoiceId", select: "invoiceId"})
        .populate({path: "userId", select: "name"})
        .populate({path: "clientId", select: "name"});
    if (!retrieved)
        return next(new AppError("something went wrong try again", 400));
    return res.json({message: "success", retrieved});
};


export const returnAllRetrievedForClient = async (req, res, next) => {
    const client = await clientModel.findOne({phone:req.params.clientPhone});
    if (!client)
        return next(new AppError("client not found", 400));

    const retrieved = await retrievedModel.find({clientId:client._id}).sort({"createdAt": -1})
        .populate({path: "productId", select: "name"})
        .populate({path: "invoiceId", select: "invoiceId"})
        .populate({path: "userId", select: "name"})
        .populate({path: "clientId", select: "name"});
    if (!retrieved)
        return next(new AppError("something went wrong try again", 400));
    return res.json({message: "success", retrieved});
};


// export const returnSpecificRetrievedForClient = async (req, res, next) => {
//     const Retrieved = await retrievedModel.findOne({invoiceId:req.params.invoiceId})
//         .populate({path: "productId", select: "name"})
//         .populate({path: "invoiceId", select: "invoiceId,createdAt"})
//         .populate({path: "userId", select: "name"});
//     if (!Retrieved)
//         return next(new AppError("something went wrong try again", 400));
//     return res.json({message: "success", Retrieved});
// };