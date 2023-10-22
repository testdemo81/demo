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
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'UserName required'],
    },
    phone: {
        type: String,
        required: [true, 'phone required'],
        unique: [true, 'phone must be unique'],
        minlength: [10, 'Too short phone number'],
        maxlength: [20, 'too long phone number'],
    },
    gender: {
        type: String,
        // required: [true, 'gender required'],
        enum: ['male', 'female'],
    },
},{
    timestamps: true,
});

const clientModel = mongoose.models.Client || mongoose.model("Client", clientSchema);
export default clientModel;