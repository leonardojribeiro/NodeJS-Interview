require("dotenv").config();
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { connectDatabase } from './database/connection';
import { AppError } from './shared/errors/AppError';
import { router } from './routes';
import { setupDependencies } from './shared/container';

export async function initializeApp() {
  const app = express();

  app.use(cors());

  app.use(express.json());

  await connectDatabase();

  setupDependencies();

  app.use(router);

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

  const port = process.env.PORT || 3333;

  app.listen(port, () => console.log("Server is listening on port " + port))
}

