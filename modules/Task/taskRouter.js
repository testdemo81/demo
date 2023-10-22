import {Router} from "express";
const taskRouter = Router();
import * as taskController from "./taskController.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../../EndPoints.js";



/**
 * @swagger
 * /api/tasks/addTask:
 *   post:
 *     summary: Create a new task.
 *     description: Create a new task.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the task.
 *               description:
 *                 type: string
 *                 description: The description of the task.
 *               type:
 *                 type: string
 *                 enum: [cashier, seller, tailor]
 *                 description: The type of the task (cashier, seller, tailor).
 *               assignedTo:
 *                 type: string
 *                 description: The ID of the user to whom the task is assigned.
 *             required:
 *               - name
 *               - description
 *               - type
 *               - assignedTo
 *     responses:
 *       200:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request. Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 */
taskRouter.post("/addTask",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(taskController.addTask));

/**
 * @swagger
 * /api/tasks/updateTask/{taskId}:
 *   patch:
 *     summary: Update an existing task by ID.
 *     description: Update an existing task by its unique ID.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: The ID of the task to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the task.
 *               description:
 *                 type: string
 *                 description: The updated description of the task.
 *               type:
 *                 type: string
 *                 enum: [cashier, seller, tailor]
 *                 description: The updated type of the task (cashier, seller, tailor).
 *               assignedTo:
 *                 type: string
 *                 description: The updated ID of the user to whom the task is assigned.
 *             required:
 *               - name
 *               - description
 *               - type
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       400:
 *         description: Bad request. Invalid input data or task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 */
taskRouter.patch("/updateTask/:taskId",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(taskController.updateTask));

/**
 * @swagger
 * /api/tasks/getTasks:
 *   get:
 *     summary: Get a list of all tasks.
 *     description: Retrieve a list of all tasks.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request. Something went wrong during retrieval.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 */
taskRouter.get("/getalltasks",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(taskController.getTasks));

/**
 * @swagger
 * /api/tasks/getTasksByUserId/{userId}:
 *   get:
 *     summary: Get a list of tasks assigned to a specific user.
 *     description: Retrieve a list of tasks assigned to a specific user by their ID.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to whom the tasks are assigned.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request. User not found or something went wrong during retrieval.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 */
taskRouter.get("/getTasksByUserId/:userId",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(taskController.getTasksByUserId));

/**
 * @swagger
 * /api/tasks/deleteTask/{taskId}:
 *   delete:
 *     summary: Delete a task by ID.
 *     description: Delete a task by its unique ID.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: The ID of the task to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       400:
 *         description: Bad request. Task not found or something went wrong during deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 */
taskRouter.delete("/deleteTask/:taskId",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(taskController.deleteTask));

/**
 * @swagger
 * /api/tasks/gettask/{taskId}:
 *   get:
 *     summary: Get a task by ID.
 *     description: Retrieve a task by its unique ID.
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: The ID of the task to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 */
taskRouter.get("/gettask/:taskId",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(taskController.getTaskById));



export default taskRouter;