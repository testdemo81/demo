import userModel from "../../DB/models/userModel.js";
import productModel from "../../DB/models/productModel.js";
import clientModel from "../../DB/models/clientModel.js";
import invoiceModel from "../../DB/models/invoiceModel.js";
import tailoringModel from "../../DB/models/tailoringModel.js";
import transactionModel from "../../DB/models/transactionModel.js";
import retrievedModel from "../../DB/models/retrievedModel.js";
import cardInfoModel from "../../DB/models/cardInfoModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import cloudinary from "../../services/cloudinary.js";
import {hashPassword} from "../../utils/hashing/hashPassword.js";
import {compareHashedPassword} from "../../utils/hashing/compareHashedPassword.js";
import {nanoid} from "nanoid";
import {createToken} from "../../utils/token/createToken.js";



/**
 * Sign up a new user.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing user registration data in the body and a file upload.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves once the user is signed up.
 *
 * @throws {AppError} If the email provided already exists or if something goes wrong during user creation.
 *
 */
export const signUp = async (req, res,next) => {
    const {email} = req.body;
    if(await userModel.findOne({email}))
        return next(new AppError("email already exist so login", 400));
    const hashedPassword = hashPassword(req.body.password);
    const employeeId = nanoid(5);
    const data = new Date(req.body.year, req.body.month, req.body.day);
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
        {
            folder: `${process.env.PROJECT_FOLDER}/users`
        });
    let wallet = 0;
    let discountPercentage = 0;
    if (req.body.role === "cashier"){
        wallet = 500;
        discountPercentage = 30;
    }
    if (req.body.role === "supervisor"){
        wallet = 750;
        discountPercentage = 35;
    }


    const user = await userModel.create({
        image:{path:secure_url,publicId:public_id},
        name:req.body.name,
        employeeId,
        email,
        password:hashedPassword,
        phone:req.body.phone,
        role:req.body.role,
        DOB:data,
        discountPercentage:discountPercentage || 0,
        wallet:wallet || 0


    });

    if(!user)
        return next(new AppError("something went wrong try again", 400));

    return res.status(200).json({message: "welcome to our family", user});
};

/**
 * Log in an existing user.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing user login data in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with a login token once the user is successfully authenticated.
 *
 * @throws {AppError} If the provided email is not found, the password is invalid, or if something goes wrong during authentication.
 *
 */
export const logIn = async (req, res,next) => {
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user)
        return next(new AppError("email not found you have to sign up first", 400));
    const isPasswordValid = compareHashedPassword(password,user.password);
    if(!isPasswordValid)
        return next(new AppError("in-valid data", 400));
    const token = createToken({id: user._id});
    return res.status(200).json({message: "login successfully", token});
};

/**
 * Deletes a user by their ID.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing the user ID in the params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with a success message if the user is successfully deleted.
 *
 * @throws {AppError} If the user is not found, or if something goes wrong during deletion.
 */
export const deleteUser = async (req, res,next) => {
    const user = await userModel.findById(req.params.userId);
    if (!user)
        return next(new AppError("user not found", 400));
    else{
        const x = await cloudinary.uploader.destroy(user.image.publicId);
        const y = await user.deleteOne();
        // console.log(x,y);
        if(x && y)
            return res.json({message: "success"});
        else
            return next(new AppError("something went wrong try again", 400));
    }
};

/**
 * Update user information and profile image.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object containing user data and profile image.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the updated user information.
 *
 * @throws {AppError} If the specified user is not found or if something goes wrong during the update.
 */
export const updateUser = async (req, res,next) => {
    const {userId} = req.params;
    const user = await userModel.findById(userId);
    if (!user)
        return next(new AppError("user not found", 400));
    else{
        if(req.file) {
            const { result } = await cloudinary.uploader.destroy(user.image.publicId);
            if (result !== "ok")
                return next(new AppError("something went wrong try again", 400));

            const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
                {
                    folder: `${process.env.PROJECT_FOLDER}/users`
                });
            const newImage = {path: secure_url, publicId: public_id};
            user.image = newImage;
            await user.save();
        }
        const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {new: true});
        if(updatedUser)
            return res.status(200).json({message: "success", updatedUser});
        else
            return next(new AppError("something went wrong try again", 400));
    }
};


export const buyProduct = async (req, res,next) => {
    const client = await clientModel.findOne({phone:req.body.phone});
    if (!client)
        return next(new AppError("client not found add it first", 400));

    let card = await cardInfoModel.findOne({clientId:client._id});
    if (!card)
        return next(new AppError("client's Card not found add it first", 400));

    const {name, quantity, color, size}  = req.body;
    const product = await productModel.findOne({name,color,size});

    if (!product)
        return next(new AppError("product not found", 400));

    //check if product in stock enough for the quantity
    if (product.stock < quantity)
        return next(new AppError("product not available in this quantity", 400));

    // Step 3: Check if the product is available for tailoring
    if (req.body.tailoring === "no" || req.body.tailoring === "No" || req.body.tailoring === "NO"){
        const paymentMethod = req.body.paymentMethod;
        const priceAfterDiscount = product.price - (product.price * product.discount / 100);

        /*card*/
        if (!card) {
            const newCard = await cardInfoModel.create({
                clientId: client._id,
                creditCardNumber: req.body.creditCardNumber,
                cvv: req.body.cvv,
                creditCardExpiryDate: req.body.creditCardExpiryDate,
                creditCardType: req.body.creditCardType
            })
            card = newCard;
        }


        const invoice = await invoiceModel.create({
            invoiceId: nanoid(6),
            productId: product._id,
            totalPrice: priceAfterDiscount * quantity,
            client: client._id,
            numberOfItems: quantity,
            userId: req.user._id
        });
        if (!invoice)
            return next(new AppError("something went wrong try again", 404));

        const transaction = await transactionModel.create({
            paymentMethod: paymentMethod,
            invoiceId: invoice._id,
            clientId: client._id,
            userId: req.user._id
        });
        if (!transaction)
            return next(new AppError("something went wrong try again", 404));

        // Step 5: Update the product quantity
        product.stock -= quantity;
        await product.save();

        /* Report Creation */
        const report = await reportModel.create({
            name: req.body.reportName,
            description: req.body.reportDescription,
            userID: req.user._id
        });




        return res.status(200).json({message: "success", invoice, transaction, report});
    }
    else {
        const tailoring = await tailoringModel.create({
            productId: product._id,
            description: req.body.description,
            price: req.body.price
        });
        if (!tailoring)
            return next(new AppError("something went wrong try again", 404));


        const paymentMethod = req.body.paymentMethod;
        const priceAfterDiscount = product.price - (product.price * product.discount / 100);

        /*card*/
        if (!card) {
            const newCard = await cardInfoModel.create({
                clientId: client._id,
                creditCardNumber: req.body.creditCardNumber,
                cvv: req.body.cvv,
                creditCardExpiryDate: req.body.creditCardExpiryDate,
                creditCardType: req.body.creditCardType
            })
            card = newCard;
        };

        const invoice = await invoiceModel.create({
            invoiceId: nanoid(6),
            productId: product._id,
            totalPrice: priceAfterDiscount * quantity + (tailoring.price *quantity),
            client: client._id,
            numberOfItems: quantity,
            userId: req.user._id
        });
        if (!invoice)
            return next(new AppError("something went wrong try again", 404));


        const transaction = await transactionModel.create({
            paymentMethod: paymentMethod,
            invoiceId: invoice._id,
            clientId: client._id,
            userId: req.user._id
        });
        if (!transaction)
            return next(new AppError("something went wrong try again", 404));



        product.stock -= quantity;
        await product.save();

        /* Report Creation */
        const report = await reportModel.create({
            name: req.body.reportName,
            description: req.body.reportDescription,
            userID: req.user._id
        });
        return res.status(200).json({message: "success", invoice, transaction, report});
    }
};


export const getAllUsers = async (req, res,next) => {
    const users = await userModel.find();
    if (!users)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success", users});
};


export const getUserById = async (req, res,next) => {
    const user = await userModel.findById(req.params.userId);
    if (!user)
        return next(new AppError("user not found", 400));
    return res.status(200).json({message: "success", user});
};


export const returnProduct = async (req, res,next) => {
    const invoice = await invoiceModel.findOne({invoiceId:req.params.invoiceId})
        .populate({path: "userId", select: "name"})
        .populate({path: "productId", select: "name"});

    // const invoice = await invoiceModel.findOne({invoiceId:req.params.invoiceId})
    //     .populate({path: "userId", select: "name"}, {path: "productId", select: "name"});

    if (!invoice)
        return next(new AppError("invoice not found", 400));

    const transaction = await transactionModel.findOne({invoiceId:invoice._id});
    if (!transaction)
        return next(new AppError("transaction not found", 400));


    const tailoring = await tailoringModel.findOne(
        {productId:invoice.productId, clientId:transaction.clientId});
    if (tailoring)
        return next(new AppError("this product is tailored already so cant return", 400));

    // if (parseInt(invoice.userId) !== parseInt(req.user._id))
    //     return next(new AppError("you are not allowed to return this product", 400));
    if(invoice.createdAt.getDate() - new Date().getDate() > 14 && req.user.role !== "admin")
        return next(new AppError("you can't return this product because the return period is over so ask your admin to return it", 400));




    const flagTransaction = await transaction.deleteOne();

    if (flagTransaction.deletedCount === 0)
        return next(new AppError("this transaction is already returned", 400));

    const retrievedProduct = await retrievedModel.create({
        invoiceId: invoice._id,
        productId: invoice.productId
    });
    if (!retrievedProduct)
        return next(new AppError("something went wrong try again", 404));

    const product = await productModel.findById(invoice.productId);
    if (!product)
        return next(new AppError("product not found", 400));

    product.stock += invoice.numberOfItems;
    await product.save();

    const flagInvoice = await invoice.deleteOne();
    if (flagInvoice.deletedCount === 0)
        return next(new AppError("this invoice is already returned", 400));



    return res.status(200).json({message: "success",
        product:product.select("-createdAt -updatedAt -_id -__v"),
        invoice, // populate on userId
        "Stock After Return":product.stock,
        "Returned Pieces":invoice.numberOfItems,
        "Total Price":invoice.totalPrice,
    });
};


// export const buyProductCashierAndSuperviser = async (req, res,next) => {
//     const user = await userModel.findById(req.params.userId);
//     if (!user)
//         return next(new AppError("user not found add it first", 400));
//
//     const {name, quantity, color, size}  = req.body;
//     const product = await productModel.findOne({name,color,size});
//
//     if (!product)
//         return next(new AppError("product not found", 400));
//
//     //check if product in stock enough for the quantity
//     if (product.stock < quantity)
//         return next(new AppError("product not available in this quantity", 400));
//
//     if (req.body.tailoring === "no" || req.body.tailoring === "No" || req.body.tailoring === "NO") {
//         const paymentMethod = req.body.paymentMethod;
//         const priceAfterDiscount = product.price - (product.price * product.discount / 100);
//         if (user.role === "cashier" ||user.role === "supervisor") {
//             let userPrice = priceAfterDiscount - (priceAfterDiscount * user.discountPercentage / 100);
//             if(userPrice >user.wallet)
//                 return next(new AppError(`you don't have enough money ${userPrice} > ${user.wallet}`, 400));
//             user.wallet -= userPrice;
//             user.save();
//         }
//
//     }
//
// };



