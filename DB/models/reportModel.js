import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the report.
 *         name:
 *           type: string
 *           description: The name of the report.
 *         description:
 *           type: string
 *           description: The description of the report.
 *         taskID:
 *           type: string
 *           description: The ID of the associated task.
 *         userID:
 *           type: string
 *           description: The ID of the associated user.
 *       required:
 *         - name
 *         - description
 *         - taskID
 *         - userID
 */
const reportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Report Name required'],
    },
    description: {
        type: String,
        required: [true, 'Report Description required'],
    },
    invoice :{
        buyingDate: {
            type: Date,
            required: [true, 'buyingDate required'],
        },
        paymentMethod: {
            type: String,
            required: [true, 'paymentMethod required'],
        },
        invoiceId: {
            type: String,
            required: [true, 'invoiceId required'],
        },
        productName: {
            type: String,
            required: [true, 'productName required'],
        },
        clientName: {
            type: String,
            required: [true, 'clientName required'],
        },
        clientPhone: {
            type: String,
            required: [true, 'clientPhoneNumber required'],
        },
        tailored: {
            type: String,
            required: [true, 'tailored required'],
        },
        tailoringPrice: {
            type: Number,
            default: 0,
            // required: [true, 'tailoringPrice required'],
        },
        productPrice: {
            type: Number,
            required: [true, 'productPrice required'],
        },
        numberOfItems: {
            type: Number,
            required: [true, 'numberOfItems required'],
        },
        totalPrice: {
            type: Number,
            required: [true, 'totalPrice required'],
        },
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User required'],
    },
    userName: {
        type: String,
        required: [true, 'User Name required'],
    },
}, {
        timestamps: true
});

const reportModel = mongoose.models.Report || mongoose.model("Report", reportSchema)
export default reportModel
