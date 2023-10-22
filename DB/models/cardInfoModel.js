import mongoose from "mongoose";

/**
 * Card Information schema.
 *
 * @swagger
 * components:
 *   schemas:
 *     CardInfo:
 *       type: object
 *       properties:
 *         clientID:
 *           type: string
 *           description: The ID of the associated client.
 *         creditCardNumber:
 *           type: string
 *           description: The 16-digit credit card number.
 *         creditCardExpiryDate:
 *           type: string
 *           format: date
 *           description: The credit card's expiry date.
 *         creditCardCVV:
 *           type: string
 *           description: The 3-digit CVV code on the credit card.
 *         creditCardType:
 *           type: string
 *           enum:
 *             - Visa
 *             - Master Card
 *           description: The type of credit card (Visa or Master Card).
 *       required:
 *         - clientID
 *         - creditCardNumber
 *         - creditCardExpiryDate
 *         - creditCardCVV
 *         - creditCardType
 *
 */
const cardInfoSchema = new mongoose.Schema({
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Client required'],
    },
    creditCardNumber: {
        type: String,
        required: [true, 'Credit Card Number required'],
        minlength: [16, "Credit Card Number must be 16 digit"],
        maxlength: [16, "Credit Card Number must be 16 digit"],
    },
    creditCardExpiryDate: {
        type: Date,
        required: [true, 'Credit Card Expiry Date required'],

    },
    creditCardCVV: {
        type: String,
        required: [true, 'Credit Card CVV required'],
        minlength: [3, "Credit Card CVV must be 3 digit"],
        maxlength: [3, "Credit Card CVV must be 3 digit"],
    },
    creditCardType: {
        type: String,
        required: [true, 'Credit Card Type required'],
        enum: ['Visa', 'Master Card'],
    },

}, {
    timestamps: true
});

const cardInfoModel = mongoose.models.CardInfo || mongoose.model("CardInfo", cardInfoSchema)
export default cardInfoModel
