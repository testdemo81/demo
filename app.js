import express from 'express';
import cors from 'cors';
import errorHandlerMW from "./middleware/errorHandlerMW.js";
import swaggerDocs from "./swagger.js";
import * as indexRouter from "./modules/indexRouter.js"
import { config } from "dotenv";
import retrievedRouter from "./modules/Retrieved/retrievedRouter.js";
config({ path: './.env' });

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use(`/user`,indexRouter.userRouter);
app.use(`/category`,indexRouter.categoryRouter);
app.use(`/product`,indexRouter.productRouter);
app.use(`/report`,indexRouter.reportRouter);
app.use(`/retrieved`,indexRouter.retrievedRouter);



//Entry Point
app.get(`/`,(req, res) => {
    return res.send('Hello, andrew!');
});





swaggerDocs(app, process.env.PORT);

app.all("*", (req, res) => {
    //next(new AppError(`In-valid Routing `+req.originalUrl,404));
    //console.log(`In-valid Routing `+req.originalUrl);
    res.status(404).json({status: "Fail", message: `In-valid Routing `+req.originalUrl});
});

//Error Handler
app.use(errorHandlerMW);

export default app;