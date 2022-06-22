import { Router } from "express";
import { citiesRouter } from "./cities.routes";

const router = Router();

router.use('/cities', citiesRouter);

export { router };