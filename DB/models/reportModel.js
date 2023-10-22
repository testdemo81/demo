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
    // taskID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Task',
    //     required: [true, 'Task required'],
    // },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User required'],
    },
}, {
        timestamps: true
});

const reportModel = mongoose.models.Report || mongoose.model("Report", reportSchema)
export default reportModel
