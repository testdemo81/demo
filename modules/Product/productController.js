import productModel from "../../DB/models/productModel.js";
import categoryModel from "../../DB/models/categoryModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import {qrCode_Function} from "../../services/qrcode.js";
import cloudinary from "../../services/cloudinary.js";



/**
 * Add a new product.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves once the product is created.
 *
 * @throws {AppError} If something goes wrong during the creation of the product.
 *
 */
// const product = new productModel({
//     name: "T-Shirt",
//     colors: [
//         {
//             color: "red",
//             sizes: [
//                 { size: "m", quantity: 3 },
//                 { size: "l", quantity: 2 },
//                 { size: "xl", quantity: 4 },
//                 { size: "xxl", quantity: 1 }
//             ]
//         },
//         {
//             color: "blue",
//             sizes: [
//                 { size: "m", quantity: 4 },
//                 { size: "l", quantity: 3 },
//                 { size: "xl", quantity: 2 },
//                 { size: "xxl", quantity: 0 }
//             ]
//         },
//         {
//             color: "green",
//             sizes: [
//                 { size: "m", quantity: 6 },
//                 { size: "l", quantity: 4 },
//                 { size: "xl", quantity: 5 },
//                 { size: "xxl", quantity: 2 }
//             ]
//         },
//     ]
// });
export const addProduct = async (req, res ,next) => {
    const category = await categoryModel.findOne({name:req.body.category});
    if (!category)
        return next(new AppError(`category is not exist add it as category then add the product`, 400));
    req.body.category = category._id;
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/products`
        });
    req.body.image = {path:secure_url,publicId:public_id};
    const qrCodeProduct = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        discount: req.body.discount,
        stock: req.body.stock,
        color: req.body.color,
        size: req.body.size,
        image: req.body.image
    }
    const qrCode = await qrCode_Function({data:JSON.stringify(qrCodeProduct)});
    req.body.qrCode = qrCode;
    const product = await productModel.create(req.body);
    if (!product)
        return next(new AppError("something went wrong try again", 400));

    return res.json({message: "success",product,qrCode});
};

/**
 * Update the stock quantity of a product.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing the product ID in the params and the quantity in the request body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the updated product information.
 *
 * @throws {AppError} If the specified product is not found or if something goes wrong during the update.
 */
export const updateProductStock = async (req, res ,next) => {
    const product = await productModel.findById(req.params.productId);
    if (!product)
        return next(new AppError("product not found", 400));
    const quantity = product.stock + parseInt(req.body.quantity);
    const flag = await product.updateOne({stock:quantity});
    if(flag.modifiedCount === 0)
        return next(new AppError("something went wrong try again", 400));
    return res.json({message: "success",updatedProduct});
};

/**
 * Update an existing product by ID.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing the product ID in the params and the updated product data in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the updated product.
 *
 * @throws {AppError} If the product is not found by the provided ID or if something goes wrong during the update.
 *
 */
export const updateProduct = async (req, res ,next) => {
    const product = await productModel.findById(req.params.productId);
    if (!product)
        return next(new AppError("product not found", 400));
    if(req.body.category){
            const category = await categoryModel.findOne({name:req.body.category});
            if (!category)
                return next(new AppError(
                    `category is not exist add it as category then add the product`,400));
        }
    if (req.file) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/products`
            });
        req.body.image = {path: secure_url, publicId: public_id};
    }
    const qrCodeProduct = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        discount: req.body.discount,
        stock: req.body.stock,
        color: req.body.color,
        size: req.body.size,
        image: req.body.image
    }
    const qrCode = await qrCode_Function({data:JSON.stringify(qrCodeProduct)});
    req.body.qrCode = qrCode;


    const updatedProduct = await productModel.findByIdAndUpdate(req.params.productId,req.body,{new:true});
    return res.json({message: "success","product":updatedProduct});
};

/**
 * Delete an existing product by ID.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing the product ID in the params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves once the product is deleted.
 *
 * @throws {AppError} If the product is not found by the provided ID or if something goes wrong during deletion.
 *
 */
export const deleteProduct = async (req, res ,next) => {
    const product = await productModel.findById(req.params.productId);
    if (!product)
        return next(new AppError("product not found", 400));
    const flag = await product.deleteOne();
    if (flag)
        return res.json({message: "success"});
    return next(new AppError("something went wrong try again", 400));
};

/**
 * Retrieve all products.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with an array of products.
 *
 * @throws {AppError} If something goes wrong while fetching products.
 *
 */
export const getAllProducts = async (req, res ,next) => {
    const page = parseInt(req.query.page) || 1; // Extract the page number from the query parameter
    const pageSize = parseInt(req.query.pageSize) || 10; // Extract the page size from the query parameter

    const totalDocuments = await productModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const skipDocuments = (page - 1) * pageSize;

    const products = await productModel
        .find()
        .sort({ "name": 1 })
        .skip(skipDocuments)
        .limit(pageSize);

    if (!products)
        return next(new AppError("something went wrong try again", 400));

    return res.status(200).json({
        message: "success",
        products,
        currentPage: page,
        totalPages,
        pageSize
    });
};

/**
 * Retrieve a product by its ID.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing the product ID in the params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the requested product.
 *
 * @throws {AppError} If the product with the provided ID is not found or if something goes wrong while fetching the product.
 *
 */
export const getProductById = async (req, res ,next) => {
    const product = await productModel.findById(req.params.productId);
    if (!product)
        return next(new AppError("product not found", 400));
    return res.status(200).json({message: "success",product});
};

/**
 * Calculate and return the price before and after applying a discount to a product.
 *
 * @async
 * @function
 * @param {Request} req - The Express request object containing the product ID in the params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the price details.
 *
 * @throws {AppError} If the product is not found.
 */
export const priceBeforeAndAfterDiscount = async (req, res,next) => {
    const product = await productModel.findById(req.params.productId);
    if (!product)
        return next(new AppError("product not found", 400));
    const priceBeforeDiscount = product.price;
    const priceAfterDiscount = product.price - (product.price * product.discount / 100);
    return res.status(200).json({
        message: "success",
        before:priceBeforeDiscount,
        after:parseFloat(priceAfterDiscount).toFixed(2)
    });
};