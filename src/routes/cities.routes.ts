import { Router } from "express";
import { CreateCityController } from "../modules/cities/useCases/createCity/CreateCityController";
import { FindCitiesController } from "../modules/cities/useCases/findCities/FindCitiesController";
import { FindCityByIdController } from "../modules/cities/useCases/findCityById/FindCityByIdController";

const citiesRouter = Router();

const createCityController = new CreateCityController()
const findCitiesController = new FindCitiesController();
const findCityByIdController = new FindCityByIdController();

citiesRouter.post('/', createCityController.handle);
citiesRouter.get('/', findCitiesController.handle);
citiesRouter.get('/:id', findCityByIdController.handle);

export { citiesRouter };