import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Retrived:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the transaction.
 *         clientId:
 *           type: string
 *           description: The ID of the associated client.
 *         invoiceId:
 *           type: string
 *           description: The ID of the associated invoice.
 *         paymentMethod:
 *           type: string
 *           enum: [Cash, Knet, Visa, American Express, Master Card]
 *           description: The payment method used for the transaction.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the transaction was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the transaction was last updated.
 *       required:
 *         - clientId
 *         - invoiceId
 *         - paymentMethod
 *       example:
 *         clientId: 5f7d8e7f75b99e3b48fecd8d
 *         invoiceId: 5f7d8e7f75b99e3b48fecd8e
 *         paymentMethod: Cash
 */
const transactionSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Client required'],
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: [true, 'Invoice required'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User required'],
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
    },
},{
    timestamps: true
});

const transactionModel = mongoose.models.Transaction || mongoose.model("Retrived",transactionSchema)
export default transactionModel;