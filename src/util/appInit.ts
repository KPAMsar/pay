import express, { Express } from "express"
import morgan from 'morgan';
import { injectControllers } from "express-ts-annotations";
import {errorHandler} from "@sojipay/middlewares/errorHandler";
import dbConnection from "@sojipay/db/config";
import controllers from "@sojipay/controllers";

const appInit = (app: Express) => {
    const PORT_NO = process.env.PORT || process.env.PORT_NO || 9000;

    return () => {
        app.use(express.json());

        app.use(morgan('dev'));

        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
            );
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, PATCH, OPTIONS"
            );
            next();
        });
        

        injectControllers(app, controllers);

        app.use((req, res, next) => {
            next(new Error("Not found"));
        });

        app.use(errorHandler);

        dbConnection.sync().then(() => {
            app.listen(PORT_NO, async () => {
                console.log(`App started and listening on port: ${PORT_NO}`)
            })
        }).catch(error => {
            console.log(error);
        });
            
    }
}

export default appInit;