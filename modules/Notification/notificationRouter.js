import {Router} from "express";
import * as notificationController from "./notificationController.js";
import authorization from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import accessRoles from "../../EndPoints.js";




export const notificationRouter = Router();


notificationRouter.get("/all",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(notificationController.getAllNotifications));

notificationRouter.get("/all/stock",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(notificationController.gettAllNotificationsOfTypeStock));


notificationRouter.get("/all/tailoring",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(notificationController.gettAllNotificationsOfTypeTailor));




export default notificationRouter;