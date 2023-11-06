import {Router} from "express";
import * as userController from "./userController.js";
import authorization from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import {fileUpload} from "../../services/multer.js";
import accessRoles from "../../EndPoints.js";
import {addClientCardInfo, createClient} from "./userController.js";


const userRouter = Router();

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user.
 *     tags:
 *       - User
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The user's profile image.
 *       - in: formData
 *         name: name
 *         type: string
 *         description: The user's name.
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         description: The user's email address.
 *         required: true
 *       - in: formData
 *         name: password
 *         type: string
 *         description: The user's password.
 *         required: true
 *       - in: formData
 *         name: phone
 *         type: string
 *         description: The user's phone number.
 *         required: true
 *       - in: formData
 *         name: role
 *         type: string
 *         description: The user's role (e.g., 'user', 'admin').
 *         required: true
 *       - in: formData
 *         name: year
 *         type: integer
 *         description: The user's birth year.
 *         required: true
 *       - in: formData
 *         name: month
 *         type: integer
 *         description: The user's birth month (1-12).
 *         required: true
 *       - in: formData
 *         name: day
 *         type: integer
 *         description: The user's birth day (1-31).
 *         required: true
 *     responses:
 *       '200':
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'  # Reference to the User schema
 *       '400':
 *         description: Bad request. The request body is invalid.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
userRouter.post("/signup",
    fileUpload({}).single("image"),
    asyncHandler(userController.signUp));

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in an existing user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: johndoe@example.com
 *                 required: true
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *                 required: true
 *     responses:
 *       '200':
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Login successfully"
 *                 token:
 *                   type: string
 *                   description: An authentication token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: Bad request. The request body is invalid.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
userRouter.post("/login",
    asyncHandler(userController.logIn));

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user by ID.
 *     description: Deletes a user by their unique ID. This action is irreversible.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     responses:
 *       200:
 *         description: User successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       400:
 *         description: Bad request. User not found or something went wrong.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT  # If you're using JWT for authentication
 */
userRouter.delete("/:userId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    asyncHandler(userController.deleteUser));


/**
 * Update user information and profile image.
 *
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Update user information and profile image.
 *     description: Update user information and profile image for a specific user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update.
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: The user's profile image to upload.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User information and profile image updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'  # Reference to your User schema
 *       400:
 *         description: Bad request. Invalid user data or image upload.
 *       401:
 *         description: Unauthorized. Authentication required.
 *       403:
 *         description: Forbidden. Access role not allowed.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error. Something went wrong.
 */
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


/**
 * Buy a product.
 *
 * @swagger
 * /users/buy:
 *   post:
 *     summary: Buy a product.
 *     description: Buy a product by the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Product purchased successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       401:
 *         description: Unauthorized. Authentication required.
 *       403:
 *         description: Forbidden. Access role not allowed.
 *       500:
 *         description: Internal server error. Something went wrong.
 */
userRouter.post("/buy",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(userController.buyProduct));

userRouter.patch("/returnproduct/:invoiceId",
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

userRouter.post("/addcardinfo/:phone",
    asyncHandler(authentication()),
    authorization([accessRoles.admin,accessRoles.tailor,accessRoles.cashier, accessRoles.seller, accessRoles.supervisor]),
    asyncHandler(addClientCardInfo));

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



export default userRouter;