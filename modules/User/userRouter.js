import {Router} from "express";
import * as userController from "./userController.js";
import authorization from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import {fileUpload} from "../../services/multer.js";
import accessRoles from "../../EndPoints.js";
import {changeTailoringStatusToAccepted} from "./userController.js";


const userRouter = Router();

userRouter.post("/signup",
    fileUpload({}).single("image"),
    // authorization([accessRoles.admin]),
    asyncHandler(userController.signUp));

userRouter.post("/login",
    asyncHandler(userController.logIn));

userRouter.post("/loginforall",
    asyncHandler(userController.logInForTheRest));


userRouter.delete("/:userId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    asyncHandler(userController.deleteUser));


userRouter.patch("/:userId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    fileUpload({}).single("image"),
    asyncHandler(userController.updateUser));


userRouter.get("/getallusers",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.getAllUsers));


userRouter.get("/getuser/:userId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.getUserById));


userRouter.post("/buy",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.buyProduct));

userRouter.post("/returnproduct",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.returnProduct));


userRouter.get("/profile",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.getUserInfoWhileLogin));

userRouter.post("/addclient",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.createClient));

userRouter.post("/addcardinfo",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.addClientCardInfo));

userRouter.get("/getallclients",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.getAllClients));

userRouter.get("/getclient/:phone",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.getClientByPhone));

userRouter.get("/getclientbyid/:clientId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.getClientById));


userRouter.post("/buyformyself",
    asyncHandler(authentication()),
    authorization([accessRoles.supervisor,accessRoles.cashier]),
    asyncHandler(userController.buyForMySelf));

userRouter.get("/invoice/:phone",
    asyncHandler(authentication()),
    authorization([accessRoles.supervisor,accessRoles.cashier,accessRoles.tailor,accessRoles.seller,accessRoles.admin]),
    asyncHandler(userController.getAllInvoicesByClientsPhone));



////////////////////////////////////////////////////////////
userRouter.get("/alltailorings",
    asyncHandler(authentication()),
    authorization([accessRoles.supervisor,accessRoles.cashier,accessRoles.tailor,accessRoles.seller,accessRoles.admin]),
    asyncHandler(userController.getAllTailorings));

////////////////////////////////////////////////////////////
userRouter.patch("/tailoring/accept/:tailoringId",
    asyncHandler(authentication()),
    authorization([accessRoles.tailor]),
    asyncHandler(userController.changeTailoringStatusToAccepted));

// the simulation is not full so hide it for now
// userRouter.patch("/tailoring/reject/:tailoringId",
//     asyncHandler(authentication()),
//     authorization([accessRoles.tailor]),
//     asyncHandler(userController.changeTailoringStatusToRejected));

userRouter.patch("/tailoring/complete/:tailoringId",
    asyncHandler(authentication()),
    authorization([accessRoles.tailor]),
    asyncHandler(userController.changeTailoringStatusToCompleted));

userRouter.get("/alltailors",
    asyncHandler(authentication()),
    authorization([accessRoles.supervisor,accessRoles.cashier,accessRoles.tailor,accessRoles.seller,accessRoles.admin]),
    asyncHandler(userController.getAllTailors));

userRouter.get("/alltailoringsforspecifictailor/:tailorId",
    asyncHandler(authentication()),
    authorization([accessRoles.supervisor,accessRoles.cashier,accessRoles.tailor,accessRoles.seller,accessRoles.admin]),
    asyncHandler(userController.getAllTailoringsForSpecificTailor));



export default userRouter;