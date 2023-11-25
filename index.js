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


