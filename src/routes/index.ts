import { Router } from "express";
import { citiesRouter } from "./cities.routes";
import { clientsRouter } from "./clients.routes";

const router = Router();

router.use('/cities', citiesRouter);
router.use('/clients', clientsRouter);

export { router };