import mongoose from "mongoose"

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
 *     User:
 *       type: object
 *       properties:
 *         image:
 *           type: object
 *           properties:
 *             path:
 *               type: string
 *             publicId:
 *               type: string
 *         name:
 *           type: string
 *           description: The name of the user
 *         employeeId:
 *           type: string
 *           description: The employee ID of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *         role:
 *           type: string
 *           enum: ['cashier', 'admin', 'seller', 'tailor']
 *           description: The role of the user
 *         DOB:
 *           type: string
 *           format: date
 *           description: The date of birth of the user
 *       required:
 *         - name
 *         - employeeId
 *         - email
 *         - password
 *         - phone
 *         - DOB
 */

const userSchema = new mongoose.Schema({
    image: {
        path: {
            type: String,
            // required: [true, 'Image path required'],
        },
        publicId: {
            type: String,
            // required: [true, 'Image publicId required'],
        }
    },
    name: {
        type: String,
        required: [true, 'UserName required'],
        // minlength: [2, 'Too short username'],
        // maxlength: [32, 'Too long username'],
    },
    //_id الرقم الوظيفي؟؟
    employeeId: {
        type: String,
        unique: [true, 'employeeId must be unique'],
        required: [true, 'CustomId required'],
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: [true, 'email must be unique'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password required'],
        minlength: [2, 'Too short password'],
    },
    phone: {
        type: String,
        required: [true, 'phone required'],
        minlength: [10, 'Too short phone number'],
        maxlength: [20, 'Too long phone number'],
    },
    role: {
        type: String,
        enum: ['cashier', 'admin' , 'seller' , 'tailor' , 'supervisor' ],
        required: true,
    },
    wallet: {
        type: Number,
        default: 0,
        // enum: [0, 500, 750],
    },
    discountPercentage: {
        type: Number,
        default: 0,
        enum: [0, 30, 35],
    },
    DOB: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
})

const userModel = mongoose.models.User || mongoose.model("User",userSchema)
export default userModel