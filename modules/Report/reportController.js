import reportModel from "../../DB/models/reportModel.js";
import taskModel from "../../DB/models/taskModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import moment from "moment";


/**
 * Create a new report.
 *
 * @async
 * @function
 * @param {Request} req - The Express request object containing the report data in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the created report or an error.
 *
 * @throws {AppError} If no task is found with the provided task ID, if the user is not assigned to the task, or if something goes wrong during report creation.
 */
export const createReport = async (req, res, next) => {
    const task = await taskModel.findById(req.body.taskID);
    if (!task)
        return next(new AppError("No task found with that ID", 404));
    if (task.assignedTo.toString() !== req.body.userID)
        return next(new AppError("You are not assigned to this task so cant write Report about it", 403));
    const report = await reportModel.create(req.body);
    if (!report)
        return next(new AppError("something went wrong try again", 500));
    return res.status(201).json({status: "success", report})
};

/**
 * Get a report by ID.
 *
 * @async
 * @function
 * @param {Request} req - The Express request object containing the report ID in the params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the retrieved report or an error.
 *
 * @throws {AppError} If no report is found with the provided report ID.
 */
export const getReport = async (req, res, next) => {
    const report = await reportModel.findById(req.params.reportId);
    if (!report)
        return next(new AppError("No report found with that ID", 404));
    return res.status(200).json({status: "success", report})
};

/**
 * Get a list of all reports.
 *
 * @async
 * @function
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with a list of reports or an error.
 *
 * @throws {AppError} If no reports are found.
 */
export const getAllReports = async (req, res, next) => {
    const reports = await reportModel.find();
    if (!reports)
        return next(new AppError("No reports found", 404));
    return res.status(200).json({status: "success", reports})
};

/**
 * Get a list of reports by user ID.
 *
 * @async
 * @function
 * @param {Request} req - The Express request object containing the user ID in the params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with a list of reports for the specified user or an error.
 *
 * @throws {AppError} If no reports are found for the specified user.
 */
export const getAllReportByUserId = async (req, res, next) => {
    const reports = await reportModel.find({userID: req.params.userId});
    if (!reports)
        return next(new AppError("No reports found", 404));
    return res.status(200).json({status: "success", reports})
}

/**
 * Get a list of reports by date or date range.
 *
 * @async
 * @function
 * @param {Request} req - The Express request object containing the start and end dates in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with a list of reports within the specified date range or an error.
 *
 * @throws {AppError} If no reports are found within the specified date range.
 */
export const getAllReportByDate = async (req, res, next) => {
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);
    // console.log(startDate);
    // console.log(endDate);
    const reports = await reportModel.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    });
    if (!reports)
        return next(new AppError("No reports found", 404));
    return res.status(200).json({status: "success", reports})
};

