process.on("uncaughtException", (err) => {
    // console.log("Uncaught Exception Error", err);
    // console.log(err.name, err.message, err.stack);
    process.exit(1);
});
import app from "./app.js";
import connectionDB from "./DB/connection.js";
import schedule from "node-schedule";
import { config } from "dotenv";
config({ path: './env' });


const port = process.env.PORT || 8000;
const index = app.listen(port, async () => {
    // console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}`);
    await connectionDB();
});

process.on("unhandledRejection", (err) => {
    // console.log("Unhandled Rejection Error", err);
    // console.log(err.name, err.message, err.stack);
    index.close(() => {
        process.exit(1);
    });
});


/*

cardInfo table
client id
credit card number 16 digit
credit card expiry date
credit card cvv 3 digit
credit card type visa mastercard


تعديل ReturnProduct api no return for tailoring product
تعديل buyProduct api report creation after buying


getAll Retruved Api for admin الشرح
أي عملية ارجاع للقطع سيتم تخزينها
ضمن صفحة مستقلة تكون مرتبة على حسب التواريخ من الاحدث للأقدم،
أي عملية ارجاع للقطع سيتم
تخزينها ضمن صفحة مستقلة تكون مرتبة على حسب التواريخ من الاحدث للأقدم،
حيث بجانب كل عملية ارجاع التاريخ واسم الموظف/المسؤول الذي قام بإرجاعها
وبمجرد الضغط على العملية سيتم اظهار كافة تفاصيل
الفاتورة وتاريخ الارجاع واسم الموظف الذي قام بإرجاعها
حيث بجانب كل عملية ارجاع التاريخ واسم الموظف/المسؤول الذي قام بإرجاعها
وبمجرد الضغط على العملية سيتم اظهار كافة تفاصيل
الفاتورة وتاريخ الارجاع واسم الموظف الذي قام بإرجاعها


returnAllretrivedsForClient ordrt احدث ثم اقدم api

return specific One retriveds details api


api buy for users with percentage of discount

table userDiscount
user id
discount percentage
wallet
enum with types of users


 */