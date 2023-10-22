import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Retrieved:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the retrieved record.
 *         productId:
 *           type: string
 *           description: The ID of the associated product.
 *         invoiceId:
 *           type: string
 *           description: The ID of the associated invoice.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the retrieved record was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the retrieved record was last updated.
 *       required:
 *         - productId
 *         - invoiceId
 *       example:
 *         productId: 5f7d8e7f75b99e3b48fecd8d
 *         invoiceId: 5f7d8e7f75b99e3b48fecd8e
 */
const retrievedSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product required'],
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: [true, 'Invoice required'],
    },
},{
    timestamps: true
});

const retrievedModel = mongoose.models.Retrieved || mongoose.model("Retrieved",retrievedSchema)
export default retrievedModel;