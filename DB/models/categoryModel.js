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
 */

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        unique:true,
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
}, {
    timestamps: true
})

const categoryModel = mongoose.models.Category || mongoose.model("Category",categorySchema)

export default categoryModel