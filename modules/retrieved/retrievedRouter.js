import {Router} from "express";
const retrievedRouter = Router();
import * as retrievedController from "./retrievedController.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../../EndPoints.js";
import {returnSpecificRetrievedByInvoice} from "./retrievedController.js";


retrievedRouter.get("/all",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(retrievedController.returnAllRetrieved));

retrievedRouter.get("/returnspecificbyinvoice/:invoiceId",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(retrievedController.returnSpecificRetrievedByInvoice));


retrievedRouter.get("/returnallretrivedsforclient/:clientPhone",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(retrievedController.returnAllRetrievedForClient));



// retrievedRouter.get("/returnspecificretrivedforclient/:retrivedId",
//     asyncHandler(authentication()),
//     authorization(accessRoles.admin),
//     asyncHandler(retrievedController.returnSpecificRetrievedForClient));

export default retrievedRouter;