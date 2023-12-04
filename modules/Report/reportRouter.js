import {Router} from "express";
const reportRouter = Router();
import * as reportController from "./reportController.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../../EndPoints.js";

/**
 * @swagger
 * /api/reports/createreport:
 *   post:
 *     summary: Create a new report.
 *     description: Create a new report.
 *     tags: [Reports]
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
 *                 description: The name of the report.
 *               description:
 *                 type: string
 *                 description: The description of the report.
 *               taskID:
 *                 type: string
 *                 description: The ID of the associated task.
 *               userID:
 *                 type: string
 *                 description: The ID of the user who created the report.
 *             required:
 *               - name
 *               - description
 *               - taskID
 *               - userID
 *     responses:
 *       200:
 *         description: Report created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 report:
 *                   $ref: '#/components/schemas/Report'
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
reportRouter.post("/createreport",
    asyncHandler(authentication()),
    authorization([accessRoles.cashier,accessRoles.supervisor]),
    asyncHandler(reportController.createReport));

/**
 * @swagger
 * /api/reports/getreport/{reportId}:
 *   get:
 *     summary: Get a report by ID.
 *     description: Retrieve a report by its unique ID.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         description: The ID of the report to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report Retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 report:
 *                   $ref: '#/components/schemas/Report'
 *       404:
 *         description: Report not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message.
 */
reportRouter.get("/getreport/:reportId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin, accessRoles.cashier, accessRoles.seller, accessRoles.tailor, accessRoles.supervisor]),
    asyncHandler(reportController.getReport));


/**
 * @swagger
 * /api/reports/getallreports:
 *   get:
 *     summary: Get a list of all reports.
 *     description: Retrieve a list of all reports.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     responses:
 *       200:
 *         description: List of reports Retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
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
reportRouter.get("/getallreports",
    asyncHandler(authentication()),
    authorization([accessRoles.admin, accessRoles.cashier, accessRoles.seller, accessRoles.tailor, accessRoles.supervisor]),
    asyncHandler(reportController.getAllReports));


/**
 * @swagger
 * /api/reports/getallreportsbyuserid/{userId}:
 *   get:
 *     summary: Get a list of reports by user ID.
 *     description: Retrieve a list of reports created by a specific user by their ID.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user who created the reports.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reports Retrieved successfully for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
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
reportRouter.get("/getallreportsbyuserid/:userId",
    asyncHandler(authentication()),
    authorization([accessRoles.admin, accessRoles.cashier, accessRoles.seller, accessRoles.tailor, accessRoles.supervisor]),
    asyncHandler(reportController.getAllReportByUserId));


/**
 * @swagger
 * /api/reports/getallreportsbydate:
 *   get:
 *     summary: Get a list of reports by date.
 *     description: Retrieve a list of reports based on a specific date or date range.
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []  # If you have authentication set up with Bearer tokens
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         description: The start date for the date range (YYYY-MM-DD).
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: The end date for the date range (YYYY-MM-DD).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reports Retrieved successfully based on the date criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
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
reportRouter.post("/getallreportsbydate",
    asyncHandler(authentication()),
    authorization([accessRoles.admin, accessRoles.cashier, accessRoles.seller, accessRoles.tailor, accessRoles.supervisor]),
    asyncHandler(reportController.getAllReportByDate));

export default reportRouter
