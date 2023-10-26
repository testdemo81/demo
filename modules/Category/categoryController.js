import categoryModel from "../../DB/models/categoryModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import cloudinary from "../../services/cloudinary.js";

/**
 * Add a new category.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing category data in the body and a file upload.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves once the category is created.
 *
 * @throws {AppError} If the category with the provided name already exists or if something goes wrong during category creation.
 *
 */
export const addCategory = async(req,res,next) => {
    const {name} = req.body;
    if(await categoryModel.findOne({name}))
        return next(new AppError("category already exist", 404));
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/categories`
        });
    const category = await categoryModel.create({
        name,
        image:{path:secure_url,publicId:public_id}
    });
    if(!category)
        return next(new AppError("something went wrong try again", 400));
    return res.json({message: "category created successfully", category});
};


/**
 * Update an existing category by ID.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing the category ID in the params and the updated category data in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the updated category.
 *
 * @throws {AppError} If the category with the provided ID is not found or if something goes wrong during the update.
 *
 */
export const updateCategory = async(req,res,next) => {
    const category = await categoryModel.findById(req.params.categoryId);
    if(!category)
        return next(new AppError("category not found", 404));
    else{
        if (req.file){
            const { result } = await cloudinary.uploader.destroy(category.image.publicId);
            if (result !== "ok")
                return next(new AppError("something went wrong try again", 400));

            const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
                {
                    folder: `${process.env.PROJECT_FOLDER}/categories`
                });
            category.image.path = secure_url;
            category.image.publicId = public_id;
            await category.save();
        }
    }
    if (req.body.name) {
        category.name = req.body.name;
        await category.save();
    }
    return res.status(201).json({message: "category updated successfully" });
};


/**
 * Delete an existing category by ID.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing the category ID in the params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves once the category is deleted.
 *
 * @throws {AppError} If the category with the provided ID is not found or if something goes wrong during deletion.
 *
 */
export const deleteCategory = async(req,res,next) => {
    const category = await categoryModel.findById(req.params.categoryId);
    //delete photo from cloudinary
    const flagImg = await cloudinary.uploader.destroy(category.image.publicId);
    if (flagImg.result !== "ok")
        return next(new AppError("something went wrong try again", 400));
    //delete category
    if(!category)
        return next(new AppError("category not found", 404));
    const flag = await category.deleteOne();
    if (flag)
        return res.status(200).json({message: "category deleted successfully"});
    return next(new AppError("something went wrong try again", 400));
};

/**
 * Retrieve all categories.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with an array of categories.
 *
 * @throws {AppError} If something goes wrong while fetching categories.
 *
 */
export const getAllCategories = async(req,res,next) => {
    const categories = await categoryModel.find()/*.sort({"name":1})*/;
    if(!categories)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success", categories});
};

/**
 * Retrieve a category by its ID.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing the category ID in the params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the requested category.
 *
 * @throws {AppError} If the category with the provided ID is not found or if something goes wrong while fetching the category.
 *
 */
export const getCategoryById = async(req,res,next) => {
    const category = await categoryModel.findById(req.params.categoryId);
    if(!category)
        return next(new AppError("category not found", 404));
    return res.status(200).json({message: "success", category});
}