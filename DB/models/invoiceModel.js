import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the invoice.
 *         invoiceId:
 *           type: string
 *           description: The 6-digit unique identifier for the invoice.
 *         productId:
 *           type: string
 *           description: The ID of the associated product.
 *         totalPrice:
 *           type: number
 *           description: The total price of the invoice.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the invoice was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the invoice was last updated.
 *       required:
 *         - invoiceId
 *         - productId
 *         - totalPrice
 *       example:
 *         invoiceId: ABC123
 *         productId: 5f7d8e7f75b99e3b48fecd8d
 *         totalPrice: 100.99
 */
const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true , 'userId required'],
    },
    // 6 Digit
    invoiceId: {
        type: String,
        unique: [true, 'employeeId must be unique'],
        required: [true, 'CustomId required'],
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    numberOfItems: {
        type: Number,
        required: [true, 'numberOfItems required'],
    },
    //purshies at == created at
    totalPrice: {
        type: Number,
        required: [true, 'totalPrice required'],
    },
    tailored: {
        type: Boolean,
        default: false,
    },
},{
    timestamps: true,
});

const invoiceModel = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
export default invoiceModel;


