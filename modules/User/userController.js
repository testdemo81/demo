import userModel from "../../DB/models/userModel.js";
import productModel from "../../DB/models/productModel.js";
import clientModel from "../../DB/models/clientModel.js";
import invoiceModel from "../../DB/models/invoiceModel.js";
import tailoringModel from "../../DB/models/tailoringModel.js";
import transactionModel from "../../DB/models/transactionModel.js";
import retrievedModel from "../../DB/models/retrievedModel.js";
import cardInfoModel from "../../DB/models/cardInfoModel.js";
import reportModel from "../../DB/models/reportModel.js";
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
    const data = new Date(req.body.DOB);
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

    if (user.role !== "admin")
        return next(new AppError("you are not allowed to login as an admin", 400));

    const isPasswordValid = compareHashedPassword(password,user.password);
    if(!isPasswordValid)
        return next(new AppError("in-valid data", 400));
    const token = createToken({id: user._id});
    return res.status(200).json({message: "login successfully", token});
};

export const logInForTheRest = async (req, res,next) => {
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user)
        return next(new AppError("email not found you have to sign up first", 400));

    if (user.role === "admin")
        return next(new AppError("this not the admin app so you cant login here", 400));

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

    const y = await user.deleteOne();
    if(y)
        return res.json({message: "success"});
    else
        return next(new AppError("something went wrong try again", 400));
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
    if (req.file) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/users`
            });
        user.image = {path:secure_url,publicId:public_id};
        await user.save();
        delete req.body.image;
    }
    if(req.body.password)
        req.body.password = hashPassword(req.body.password);
    if (req.body.role){
        if (req.body.role === "cashier"){
            req.body.wallet = 500;
            req.body.discountPercentage = 30;
        }
        if (req.body.role === "supervisor"){
            req.body.wallet = 750;
            req.body.discountPercentage = 35;
        }
    }
    const updatedUser = await user.updateOne(req.body);
    if (!updatedUser)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success"});
};

export const getUserInfoWhileLogin = async (req, res,next) => {
    const user = await userModel.findById(req.user.id).select("-password -createdAt -updatedAt -__v")
    if (!user)
        return next(new AppError("user not found", 400));
    return res.status(200).json({message: "success",user});
};


export const createClient = async (req, res,next) => {
    const client = await clientModel.create(req.body);
    if (!client)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success",client});
};

export const addClientCardInfo = async (req, res,next) => {
    const client = await clientModel.findOne({phone:req.body.phone});
    if (!client)
        return next(new AppError("client not found add it first", 400));
    req.body.clientID = client._id;
    const card = await cardInfoModel.create(req.body);
    if (!card)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success",card});
};

export const buyProduct = async (req, res,next) => {
    const client = await clientModel.findOne({phone:req.body.phone});
    if (!client)
        return next(new AppError("client not found add it first", 404));

    let card = await cardInfoModel.findOne({clientID:client._id});

    if(req.body.paymentMethod === "card") {
        if (!card) {
            return next(new AppError("client's Card not found add it first", 401));
            const newCard = await cardInfoModel.create({
                clientID: client._id,
                creditCardNumber: req.body.creditCardNumber,
                creditCardExpiryDate: req.body.creditCardExpiryDate,
                creditCardCVV: req.body.creditCardCVV,
                creditCardType: req.body.creditCardType
            });
            if (!newCard)
                return next(new AppError("something went wrong try again", 400));
            card = newCard;
        }
    }

    // const {name, quantity, color, size}  = req.body;
    // const product = await productModel.findOne({name,color,size});
    const product = await productModel.findById(req.body.productId);


    if (!product)
        return next(new AppError("product not found", 400));

    //check if product in stock enough for the quantity
    const {quantity} = req.body;
    if (product.stock < quantity)
        return next(new AppError("product not available in this quantity", 400));

    // Step 3: Check if the product is available for tailoring
    if (req.body.tailoring === "no" || req.body.tailoring === "No" || req.body.tailoring === "NO"){
        let priceAfterDiscount = 0;
        const paymentMethod = req.body.paymentMethod;
        if (product.isDiscount === true)
            priceAfterDiscount = product.price - (product.price * product.discount / 100);
        else
            priceAfterDiscount = product.price;


        const invoice = await invoiceModel.create({
            invoiceId: nanoid(6),
            productId: product._id,
            totalPrice: priceAfterDiscount * quantity,
            client: client._id,
            numberOfItems: quantity,
            userId: req.user._id,
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

        const report = await reportModel.create({
            name: req.body.name,
            description: req.body.description,
            userID: req.user._id,
            userName: req.user.name,
            invoice: {
                buyingDate: invoice.createdAt,
                paymentMethod: req.body.paymentMethod,
                invoiceId: invoice.invoiceId,
                productName: product.name,
                clientName: client.name,
                clientPhone: client.phone,
                tailored: req.body.tailoring,
                productPrice: product.price,
                numberOfItems: req.body.quantity,
                totalPrice: invoice.totalPrice,
            }
        });

        if (!report)
            return next(new AppError("something went wrong try again", 404));

        return res.status(200).json({message: "success", invoice});
    }
    else {
        const tailoring = await tailoringModel.create({
            productId: product._id,
            tailoringDescription: req.body.description,
            price: req.body.price,
            clientId: client._id,
        });



        if (!tailoring)
            return next(new AppError("something went wrong try again", 404));

        let priceAfterDiscount = 0;
        const paymentMethod = req.body.paymentMethod;
        if (product.isDiscount === true)
            priceAfterDiscount = product.price - (product.price * product.discount / 100);
        else
            priceAfterDiscount = product.price;

        const invoice = await invoiceModel.create({
            invoiceId: nanoid(6),
            productId: product._id,
            totalPrice: priceAfterDiscount * quantity + (tailoring.price *quantity),
            client: client._id,
            numberOfItems: quantity,
            userId: req.user._id,
            tailored: true,
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

        const report = await reportModel.create({
            name: req.body.name,
            description: req.body.description,
            userID: req.user._id,
            userName: req.user.name,
            invoice: {
                buyingDate: invoice.createdAt,
                paymentMethod: req.body.paymentMethod,
                invoiceId: invoice.invoiceId,
                productName: product.name,
                clientName: client.name,
                clientPhone: client.phone,
                tailored: req.body.tailoring,
                tailoringPrice: tailoring.price,
                productPrice: product.price,
                numberOfItems: req.body.quantity,
                totalPrice: invoice.totalPrice,
            }
        });

        if (!report)
            return next(new AppError("something went wrong try again", 404));


        return res.status(200).json({message: "success", invoice});
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
    const invoice = await invoiceModel.findOne({invoiceId:req.body.invoiceId})
        .populate({path: "userId", select: "name"})
        .populate({path: "productId", select: "name"});


    // const invoice = await invoiceModel.findOne({invoiceId:req.params.invoiceId})
    //     .populate({path: "userId", select: "name"}, {path: "productId", select: "name"});

    if (!invoice)
        return next(new AppError("invoice not found", 400));

    const transaction = await transactionModel.findOne({invoiceId:invoice._id});
    if (!transaction)
        return next(new AppError("transaction not found", 400));


    if (invoice.tailored)
        return next(new AppError("this product is tailored already so cant return", 400));

    // if (parseInt(invoice.userId) !== parseInt(req.user._id))
    //     return next(new AppError("you are not allowed to return this product", 400));
    if(invoice.createdAt.getDate() - new Date().getDate() > 14 && req.user.role !== "admin")
        return next(new AppError("you can't return this product because the return period is over so ask your admin to return it", 400));


    // const flagTransaction = await transaction.deleteOne();
    // if (flagTransaction.deletedCount === 0)
    //     return next(new AppError("this transaction is already returned", 400));

    const retrievedProduct = await retrievedModel.create({
        invoiceId: invoice._id,
        productId: invoice.productId,
        userId: req.user._id,
        clientId: invoice.client,
    });
    if (!retrievedProduct)
        return next(new AppError("something went wrong try again", 404));

    const product = await productModel.findById(invoice.productId);
    if (!product)
        return next(new AppError("product not found", 400));

    product.stock += invoice.numberOfItems;
    await product.save();

    // const flagInvoice = await invoice.deleteOne();
    // if (flagInvoice.deletedCount === 0)
    //     return next(new AppError("this invoice is already returned", 400));


    return res.status(200).json({message: "success",
        product:product,
        invoice, // populate on userId
        "Stock After Return":product.stock,
        "Returned Pieces":invoice.numberOfItems,
        "Total Price":invoice.totalPrice,
    });
};

export const getAllClients = async (req, res,next) => {
    const page = parseInt(req.query.page) || 1; // Extract the page number from the query parameter
    const pageSize = parseInt(req.query.pageSize) || 10; // Extract the page size from the query parameter

    const totalDocuments = await productModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const skipDocuments = (page - 1) * pageSize;

    const clients = await clientModel.find()
        .skip(skipDocuments)
        .limit(pageSize);
    if (!clients)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({
        message: "success",
        clients,
        currentPage: page,
        totalPages,
        pageSize
    });
};

export const getClientByPhone = async (req, res,next) => {
    const client = await clientModel.findOne({phone:req.params.phone});
    if (!client)
        return next(new AppError("client not found add it first", 400));
    return res.status(200).json({message: "success",client});
};

export const getClientById = async (req, res,next) => {
    const client = await clientModel.findById(req.params.clientId);
    if (!client)
        return next(new AppError("client not found add it first", 400));
    return res.status(200).json({message: "success",client});
};

export const buyForMySelf = async (req, res,next) => {
    const role = req.user.role;
    if (role !== "cashier" && role !== "supervisor")
        return next(new AppError("you are not allowed to buy for yourself", 400));

    const user = await userModel.findById(req.user._id);
    if (!user)
        return next(new AppError("user not found add it first", 400));

    const product = await productModel.findById(req.body.productId);
    if (!product)
        return next(new AppError("product not found", 400));

    //check if product in stock enough for the quantity
    const {quantity} = req.body;
    if (product.stock < quantity)
        return next(new AppError("product not available in this quantity", 400));

    // Step 3: Check if the product is available for tailoring
    if (req.body.tailoring === "no" || req.body.tailoring === "No" || req.body.tailoring === "NO"){
        let priceAfterDiscount = 0;
        if (product.isDiscount === true)
            priceAfterDiscount = product.price - (product.price * ((product.discount + user.discountPercentage) / 100));
        else
            priceAfterDiscount = product.price - (product.price * (user.discountPercentage / 100));

        if (priceAfterDiscount * quantity > user.wallet)
            return next(new AppError("you don't have enough money", 400));

        const invoice = await invoiceModel.create({
            invoiceId: nanoid(6),
            productId: product._id,
            totalPrice: priceAfterDiscount * quantity,
            client: user._id,
            numberOfItems: quantity,
            userId: user._id,
            tailor: false,
        });
        if (!invoice)
            return next(new AppError("something went wrong try again", 404));

        product.stock -= quantity;
        await product.save();

        user.wallet -= priceAfterDiscount * quantity;
        await user.save();

        const report = await reportModel.create({
            name: req.body.name,
            description: req.body.description,
            userID: req.user._id,
            userName: req.user.name,
            invoice: {
                buyingDate: invoice.createdAt,
                paymentMethod: "wallet",
                invoiceId: invoice.invoiceId,
                productName: product.name,
                clientName: user.name,
                clientPhone: user.phone,
                tailored: req.body.tailoring,
                productPrice: product.price,
                numberOfItems: req.body.quantity,
                totalPrice: invoice.totalPrice,
            }
        });
        if (!report)
            return next(new AppError("something went wrong try again", 404));

        return res.status(200).json({message: "success", invoice});
    }
    else {
        const tailoring = await tailoringModel.create({
            productId: product._id,
            tailoringDescription: req.body.tailoringDescription,
            price: req.body.price,
            clientId: user._id,
        });

        if (!tailoring)
            return next(new AppError("something went wrong try again", 404));

        let priceAfterDiscount;
        if (product.isDiscount === true) {
            priceAfterDiscount = product.price - (product.price * ((product.discount + user.discountPercentage) / 100));
            // console.log(priceAfterDiscount,product.price,product.discount,user.discountPercentage,user.wallet);

        }
        else {
            priceAfterDiscount = product.price - (product.price * (user.discountPercentage / 100));
            // console.log(priceAfterDiscount,product.price,product.discount,user.discountPercentage,user.wallet);
        }
        const totalPrice = priceAfterDiscount * quantity + (tailoring.price *quantity)
        if(totalPrice > user.wallet)
            return next(new AppError("you don't have enough money", 400));

        const invoice = await invoiceModel.create({
            invoiceId: nanoid(6),
            productId: product._id,
            totalPrice: totalPrice,
            client: user._id,
            numberOfItems: quantity,
            userId: user._id,
            tailored: true,
        });
        if (!invoice)
            return next(new AppError("something went wrong try again", 404));

        product.stock -= quantity;
        await product.save();

        user.wallet -= priceAfterDiscount * quantity;
        await user.save();

        const report = await reportModel.create({
            name: req.body.name,
            description: req.body.description,
            userID: req.user._id,
            userName: req.user.name,
            invoice: {
                buyingDate: invoice.createdAt,
                paymentMethod: "wallet",
                invoiceId: invoice.invoiceId,
                productName: product.name,
                clientName: user.name,
                clientPhone: user.phone,
                tailored: req.body.tailoring,
                tailoringPrice: tailoring.price,
                productPrice: product.price,
                numberOfItems: req.body.quantity,
                totalPrice: invoice.totalPrice,
            }
        });

        if (!report)
            return next(new AppError("something went wrong try again", 404));
        return res.status(200).json({message: "success", invoice});
    }
};

export const getAllInvoicesByClientsPhone = async (req, res,next) => {
    const client = await clientModel.findOne({phone:req.body.phone});
    if (!client)
        return next(new AppError("client not found add it first", 400));

    const invoices = await invoiceModel.find({client:client._id});
    if (!invoices)
        return next(new AppError("something went wrong try again", 400));
    return res.status(200).json({message: "success",invoices});
};