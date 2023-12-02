import notificationModel from "../../DB/models/notificationModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";



export const getAllNotifications = async (req, res,next) => {
    const notifications = await notificationModel.find();
    if (!notifications)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success", notifications});
};


export const gettAllNotificationsOfTypeStock = async (req, res,next) => {
    const notifications = await notificationModel.find({type:"stock"});
    if (!notifications)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success", notifications});
};

export const gettAllNotificationsOfTypeTailor = async (req, res,next) => {
    const notifications = await notificationModel.find({type:"tailor"});
    if (!notifications)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success", notifications});
};