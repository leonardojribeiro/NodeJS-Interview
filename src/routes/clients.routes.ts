import { Router } from "express";
import { CreateClientController } from "../modules/clients/useCases/createClient/CreateClientController";
import { DeleteClientByIdController } from "../modules/clients/useCases/deleteClientById/DeleteClientByIdController";
import { FindClientByIdController } from "../modules/clients/useCases/findClientById/FindClientByIdController";
import { FindClientsController } from "../modules/clients/useCases/findClients/FindClientsController";
import { UpdateFullnameOfClientController } from "../modules/clients/useCases/updateFullNameOfClient/UpdateFullNameOfClientController";

const clientsRouter = Router();

const createClientController = new CreateClientController()
const findClientsController = new FindClientsController();
const findClientByIdController = new FindClientByIdController();
const updateFullNameOfClientController = new UpdateFullnameOfClientController();
const deleteClientByIdController = new DeleteClientByIdController();

clientsRouter.post('/', createClientController.handle);
clientsRouter.get('/', findClientsController.handle);
clientsRouter.get('/:id', findClientByIdController.handle);
clientsRouter.patch('/:id', updateFullNameOfClientController.handle);
clientsRouter.delete('/:id', deleteClientByIdController.handle);

export { clientsRouter };