import {Router} from "express";
const productRouter = Router();
import * as productController from "./productController.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../../EndPoints.js";
import productModel from "../../DB/models/productModel.js";
import {fileUpload} from "../../services/multer.js";
import {changeIsDiscountState} from "./productController.js";


/**
 * @swagger
 * /product/addproduct:
 *   post:
 *     summary: Add a new product.
 *     tags:
 *       - Product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: product
 *         description: The product to add.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Product'  # Reference to the Product schema
 *     responses:
 *       '201':
 *         description: Product added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'  # Reference to the Product schema
 *       '400':
 *         description: Bad request. The request body is invalid.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 */
productRouter.post("/addproduct",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    fileUpload({}).single("image"),
    asyncHandler(productController.addProduct));

productRouter.patch("/changeisdiscount",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    asyncHandler(productController.changeIsDiscountState));

/**
 * @swagger
 * /product/updateproduct/{productId}:
 *   patch:
 *     summary: Update an existing product by ID.
 *     tags:
 *       - Product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: The ID of the product to update.
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: updatedProduct
 *         description: The updated product data.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Product'  # Reference to the Product schema
 *     responses:
 *       '200':
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'  # Reference to the Product schema
 *       '400':
 *         description: Bad request. The request body is invalid.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '404':
 *         description: Not found. The product with the specified ID does not exist.
 */
productRouter.patch("/updateproduct/:productId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    fileUpload({}).single("image"),
    asyncHandler(productController.updateProduct));

/**
 * @swagger
 * /product/deleteproduct/{productId}:
 *   delete:
 *     summary: Delete an existing product by ID.
 *     tags:
 *       - Product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: The ID of the product to delete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product deleted successfully.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '404':
 *         description: Not found. The product with the specified ID does not exist.
 */
productRouter.delete("/deleteproduct/:productId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    asyncHandler(productController.deleteProduct));

/**
 * @swagger
 * localhost:3000/andrew/v1/product/getallproducts:
 *   get:
 *     summary: Get all products.
 *     tags:
 *       - Product
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Success. Returns an array of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Success"
 *                 products:
 *                   type: array
 *                   description: An array of product objects.
 *                   items:
 *                     $ref: '#/components/schemas/Product'  # Reference to the Product schema
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
productRouter.get("/getallproducts",
    asyncHandler(authentication()),
    // authorization([accessRoles.admin]),
    asyncHandler(productController.getAllProducts));

/**
 * @swagger
 * /product/getproduct/{productId}:
 *   get:
 *     summary: Get a product by ID.
 *     tags:
 *       - Product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         type: string
 *         description: The ID of the product to retrieve.
 *         required: true
 *     responses:
 *       '200':
 *         description: Success. Returns the requested product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Success"
 *                 product:
 *                   $ref: '#/components/schemas/Product'  # Reference to the Product schema
 *       '400':
 *         description: Bad request. The product with the specified ID is not found.
 *       '401':
 *         description: Unauthorized. Authentication failed.
 *       '403':
 *         description: Forbidden. User does not have the required role.
 *       '500':
 *         description: Internal server error. Something went wrong.
 */
productRouter.get("/getproduct/:productId",
    asyncHandler(authentication()),
    // authorization([accessRoles.admin]),
    asyncHandler(productController.getProductById));

/**
 * @swagger
 * /api/users/pricebeforeandafterdiscount/{productId}:
 *   get:
 *     summary: Calculate and return the price before and after applying a discount to a product.
 *     description: Retrieves the price of a product both before and after applying a discount.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to calculate the price for.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     responses:
 *       200:
 *         description: Price calculation successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 before:
 *                   type: number
 *                   description: The price of the product before discount.
 *                 after:
 *                   type: number
 *                   description: The price of the product after discount.
 *       400:
 *         description: Bad request. Product not found or something went wrong.
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
productRouter.get("/pricebeforeandafterdiscount/:productId",
    asyncHandler(authentication()),
    // authorization([accessRoles.admin]),
    asyncHandler(productController.priceBeforeAndAfterDiscount));

productRouter.patch("/updateproductquantity/:productId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin]),
    asyncHandler(productController.updateProductStock));


export default productRouter;

