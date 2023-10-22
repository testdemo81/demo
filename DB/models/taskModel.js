import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the task.
 *         name:
 *           type: string
 *           description: The name of the task.
 *         description:
 *           type: string
 *           description: The description of the task.
 *         type:
 *           type: string
 *           description: The type of the task (cashier, seller, tailor).
 *         assignedTo:
 *           type: string
 *           description: The ID of the user to whom the task is assigned.
 *       required:
 *         - name
 *         - description
 *         - type
 *         - assignedTo
 *         - timestamps
 */
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Task Name required'],
    },
    description: {
        type: String,
        required: [true, 'Task Description required'],
    },
    type: {
        type: String,
        required: [true, 'Task Type required'],
        enum: ['cashier' , 'seller' , 'tailor' ],
        immutable: true // ADD THIS PROPERTY HERE
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User required'],
    },
}, {
        timestamps: true
})

const taskModel = mongoose.models.Task || mongoose.model("Task", taskSchema)
export default taskModel