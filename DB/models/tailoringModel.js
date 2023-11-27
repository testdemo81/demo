import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Tailoring:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the tailoring record.
 *         productId:
 *           type: string
 *           description: The ID of the associated product.
 *         description:
 *           type: string
 *           description: The description of the tailoring service.
 *         price:
 *           type: number
 *           description: The price of the tailoring service.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the tailoring record was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the tailoring record was last updated.
 *       required:
 *         - productId
 *         - description
 *         - price
 *       example:
 *         productId: 5f7d8e7f75b99e3b48fecd8d
 *         description: Hemming pants
 *         price: 15.99
 */
const tailoringSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    tailoringDescription: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Client required'],
    }
},{
    timestamps: true
});


const tailoringModel = mongoose.models.Tailoring || mongoose.model("Tailoring", tailoringSchema);
export default tailoringModel;