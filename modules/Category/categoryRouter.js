import {Router} from "express";
const categoryRouter = Router();
import * as categoryController from "./categoryController.js";
import authorization from "../../middleware/authorization.js";
import authentication from "../../middleware/authentication.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import {fileUpload} from "../../services/multer.js";
import accessRoles from "../../EndPoints.js";




/**
 * @swagger
 * /category/addcategory:
 *   post:
 *     summary: Add a new category.
 *     tags:
 *       - Category
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The category's image.
 *         required: true
 *       - in: formData
 *         name: name
 *         type: string
 *         description: The category's name.
 *         required: true
 *     responses:
 *       '200':
 *         description: Category added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'  # Reference to the Category schema
 *       '400':
 *         description: Bad request. The request body is invalid.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
categoryRouter.post("/addcategory",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    fileUpload({}).single("image"),
    asyncHandler(categoryController.addCategory));


/**
 * @swagger
 * /category/updatecategory/{categoryId}:
 *   patch:
 *     summary: Update an existing category by ID.
 *     tags:
 *       - Category
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         type: string
 *         description: The ID of the category to update.
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The updated category's image.
 *       - in: formData
 *         name: name
 *         type: string
 *         description: The updated category's name.
 *     responses:
 *       '200':
 *         description: Category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'  # Reference to the Category schema
 *       '400':
 *         description: Bad request. The request body is invalid.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '404':
 *         description: Not found. The category with the specified ID does not exist.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
categoryRouter.patch("/updatecategory/:categoryId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    fileUpload({}).single("image"),
    asyncHandler(categoryController.updateCategory));


/**
 * @swagger
 * /category/deletecategory/{categoryId}:
 *   delete:
 *     summary: Delete an existing category by ID.
 *     tags:
 *       - Category
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         type: string
 *         description: The ID of the category to delete.
 *         required: true
 *     responses:
 *       '200':
 *         description: Category deleted successfully.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '404':
 *         description: Not found. The category with the specified ID does not exist.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
categoryRouter.delete("/deletecategory/:categoryId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    asyncHandler(categoryController.deleteCategory));

/**
 * @swagger
 * /category/getallcategories:
 *   get:
 *     summary: Get all categories.
 *     tags:
 *       - Category
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Success. Returns an array of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Success"
 *                 categories:
 *                   type: array
 *                   description: An array of category objects.
 *                   items:
 *                     $ref: '#/components/schemas/Category'  # Reference to the Category schema
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
categoryRouter.get("/getallcategories",
    asyncHandler(authentication()),
    authorization([accessRoles.admin, accessRoles.supervisor ,accessRoles.seller, accessRoles.cashier, accessRoles.tailor]),
    asyncHandler(categoryController.getAllCategories));

/**
 * @swagger
 * /category/getcategory/{categoryId}:
 *   get:
 *     summary: Get a category by ID.
 *     tags:
 *       - Category
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         type: string
 *         description: The ID of the category to retrieve.
 *         required: true
 *     responses:
 *       '200':
 *         description: Success. Returns the requested category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Success"
 *                 category:
 *                   $ref: '#/components/schemas/Category'  # Reference to the Category schema
 *       '400':
 *         description: Bad request. The category with the specified ID is not found.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
categoryRouter.get("/getcategory/:categoryId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    asyncHandler(categoryController.getCategoryById));



export default categoryRouter;