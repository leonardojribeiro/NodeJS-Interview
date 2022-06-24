require("dotenv").config();
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { connectDatabase } from './database/connection';
import { AppError } from './shared/errors/AppError';
import { router } from './routes';
import { setupDependencies } from './shared/container';
import swagger from 'swagger-ui-express';
import swaggerFile from "./swagger.json";

const app = express();

app.use(cors());

app.use(express.json());

connectDatabase();

setupDependencies();

app.use(router);

app.use("/", swagger.serve, swagger.setup(swaggerFile));

app.use(
  (err: Error, request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message} `,
    });
  }
);

export { app };
