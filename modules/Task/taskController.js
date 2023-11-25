// import taskModel from "../../DB/models/taskModel.js";
// import userModel from "../../DB/models/userModel.js";
// import AppError from "../../utils/ErrorHandling/AppError.js";
//
//
// /**
//  * Add a new task.
//  *
//  * @async
//  * @function
//  * @param {Request} req - The Express request object containing task data in the body.
//  * @param {Response} res - The Express response object.
//  * @param {NextFunction} next - The next middleware function.
//  * @returns {Promise<void>} - A promise that resolves with a success message and the created task.
//  *
//  * @throws {AppError} If the assigned user is not found or if something goes wrong during task creation.
//  */
// export const addTask = async (req, res ,next) => {
//     const user = await userModel.findOne(
//         {_id: req.body.assignedTo, role: req.body.type});
//     if (!user)
//         return next(new AppError("user not found so you cant assign it to him", 404));
//     const task = await taskModel.create(req.body);
//     if (!task)
//         return next(new AppError("something went wrong try again", 400));
//     return res.json({message: "success",task});
// }
//
// /**
//  * Update an existing task.
//  *
//  * @async
//  * @function
//  * @param {Request} req - The Express request object containing task data in the body.
//  * @param {Response} res - The Express response object.
//  * @param {NextFunction} next - The next middleware function.
//  * @returns {Promise<void>} - A promise that resolves with a success message.
//  *
//  * @throws {AppError} If the assigned user is not found or if the task is not found or if something goes wrong during the update.
//  */
// export const updateTask = async (req, res ,next) => {
//     const task = await taskModel.findById(req.params.taskId);
//     if (!task)
//         return next(new AppError("task not found", 404));
//     const user = await userModel.findById(req.body.assignedTo);
//     if (!user)
//         return next(new AppError("user not found", 404));
//     if (user.role !== req.body.type)
//         return next(new AppError("user role not match task type", 404));
//     if (req.body.type !== task.type)
//         return next(new AppError(`task type is ${task.type} and you cant changed to ${req.body.type}`, 404));
//     delete req.body.type;
//     const flag = await task.updateOne(req.body);
//     if (flag.modifiedCount === 1)
//         return res.json({message: "success"}).status(200);
//     // else if (flag.modifiedCount === 0)
//     //     return next(new AppError("user already assigned for this task", 404));
//     return next(new AppError("something went wrong try again", 400));
// };
//
// /**
//  * Get a list of all tasks.
//  *
//  * @async
//  * @function
//  * @param {Request} req - The Express request object.
//  * @param {Response} res - The Express response object.
//  * @param {NextFunction} next - The next middleware function.
//  * @returns {Promise<void>} - A promise that resolves with a success message and the list of tasks.
//  *
//  * @throws {AppError} If something goes wrong during retrieval.
//  */
// export const getTasks = async (req, res ,next) => {
//     const tasks = await taskModel.find();
//     if (!tasks)
//         return next(new AppError("something went wrong try again", 404));
//     return res.json({message: "success",tasks}).status(200);
// };
//
//
// /**
//  * Get a list of tasks assigned to a specific user.
//  *
//  * @async
//  * @function
//  * @param {Request} req - The Express request object containing the user ID in the params.
//  * @param {Response} res - The Express response object.
//  * @param {NextFunction} next - The next middleware function.
//  * @returns {Promise<void>} - A promise that resolves with a success message and the list of tasks for the user.
//  *
//  * @throws {AppError} If the user is not found or if something goes wrong during retrieval.
//  */
// export const getTasksByUserId = async (req, res ,next) => {
//     const user = await userModel.findById(req.params.userId);
//     if (!user)
//         return next(new AppError("user not found", 404));
//     const tasks = await taskModel.find({assignedTo: req.params.userId});
//     if (!tasks)
//         return next(new AppError("something went wrong try again", 404));
//     return res.json({message: "success",tasks}).status(200);
// };
//
// /**
//  * Delete a task by its ID.
//  *
//  * @async
//  * @function
//  * @param {Request} req - The Express request object containing the task ID in the params.
//  * @param {Response} res - The Express response object.
//  * @param {NextFunction} next - The next middleware function.
//  * @returns {Promise<void>} - A promise that resolves with a success message.
//  *
//  * @throws {AppError} If the task is not found or if something goes wrong during deletion.
//  */
// export const deleteTask = async (req, res ,next) => {
//     const task = await taskModel.findById(req.params.taskId);
//     if (!task)
//         return next(new AppError("task not found", 404));
//     const flag = await task.deleteOne();
//     if (!flag)
//         return next(new AppError("something went wrong try again", 400));
//     return res.json({message: "success"}).status(200);
// };
//
//
// /**
//  * Retrieve a task by its ID.
//  *
//  * @async
//  * @function
//  * @param {Request} req - The Express request object containing the task ID in the params.
//  * @param {Response} res - The Express response object.
//  * @param {NextFunction} next - The next middleware function.
//  * @returns {Promise<void>} - A promise that resolves with the task or an error if the task is not found.
//  *
//  * @throws {AppError} If the task is not found.
//  */
// export const getTaskById = async (req, res ,next) => {
//     const task = await taskModel.findById(req.params.taskId);
//     if (!task)
//         return next(new AppError("task not found", 404));
//     return res.json({message: "success",task}).status(200);
// };