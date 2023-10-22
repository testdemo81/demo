import {Router} from "express";
const retrivedRouter = Router();
import * as retrivedController from "./retrivedController.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../../EndPoints.js";


retrivedRouter.get("/returnallretrivedsforclient",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(retrivedController.returnAllRetrivedForClient));

retrivedRouter.get("/returnspecificretrivedforclient/:retrivedId",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(retrivedController.returnSpecificRetrivedForClient));
