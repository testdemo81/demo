import mongoose from "mongoose";

// Define your Swagger components inline
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category
 *         image:
 *           type: object
 *           properties:
 *             path:
 *               type: string
 *               description: The path to the image
 *             publicId:
 *               type: string
 *               description: The public ID of the image
 *       required:
 *         - name
 *         - image
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: The categories to which the product belongs
 *         price:
 *           type: number
 *           description: The price of the product
 *         discount:
 *           type: number
 *           description: The discount on the product
 *         stock:
 *           type: number
 *           description: The stock quantity of the product
 *       required:
 *         - name
 *         - price
 *         - stock
 */

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product required'],
        // minlength: [1, 'Too short Product name it should be at least 1 character'],
        // maxlength: [32, 'Too long Product name it should be at most 32 character'],
    },
    categories: [{
        type: String,
        // required: [true, 'Product required'],
    }],
    // category:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category",
    //     required: [true, 'Product required'],
    // },
    price: {
        type: Number,
        required: [true,"price of product is required"],
        default: 1
    },
    isDiscount: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: [true,"stock number is required"],
        default: 1
    },
    color: {
        type: String,
        required: [true,"color is required"],
    },
    size: {
        type: String,
        required: [true,"size is required"],
    },
    image: {
        path: {
            type: String,
            required: [true, 'Image path required'],
        },
        publicId: {
            type: String,
            required: [true, 'Image publicId required'],
        }
    },
    barCodeNumber:{
        indexes: true,
        unique: true,
        type: Number,
        required: [true, 'barCodeNumber required'],


    },

}, {
    timestamps: true,
})


const productModel = mongoose.models.Product || mongoose.model("Product",productSchema)

export default productModel;