import { Types } from "mongoose";
import { ICitiesRepository } from "../../../cities/repositories/ICitiesRepository";
import { InMemoryCitiesRepository } from "../../../cities/repositories/in-memory/InMemoryCitiesRepository";
import { ICreateCityDTO } from "../../../cities/useCases/createCity/CreateCityDTO";
import { CreateCityUseCase } from "../../../cities/useCases/createCity/CreateCityUseCase";
import { FindCitiesUseCase } from "../../../cities/useCases/findCities/FindCitiesUseCase";
import { IClientsRespository } from "../../repositories/IClientsRespository";
import { InMemoryClientsRepository } from "../../repositories/in-memory/InMemoryClientsRepository";
import { CreateClientUseCase } from "../createClient/CreateClientUseCase";
import { ICreateClientDTO } from "../createClient/ICreateClientDTO";
import { FindClientsUseCase } from "../findClients/FindClientsUseCase";
import { DeleteClientByIdError } from "./DeleteClientByIdError";
import { DeleteClientByIdUseCase } from "./DeleteClientByIdUseCase";

let inMemoryCitiesRepository: ICitiesRepository;
let createCityUseCase: CreateCityUseCase;
let findCitiesUseCase: FindCitiesUseCase;

let inMemoryClientsRepository: IClientsRespository;
let createClientUseCase: CreateClientUseCase;
let findClientsUseCase: FindClientsUseCase;
let deleteClientByIdUseCase: DeleteClientByIdUseCase;


describe("Delete Client By Id", () => {
  beforeAll(async () => {
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    createCityUseCase = new CreateCityUseCase(inMemoryCitiesRepository);
    findCitiesUseCase = new FindCitiesUseCase(inMemoryCitiesRepository);

    inMemoryClientsRepository = new InMemoryClientsRepository(inMemoryCitiesRepository);
    createClientUseCase = new CreateClientUseCase(inMemoryClientsRepository, inMemoryCitiesRepository);
    findClientsUseCase = new FindClientsUseCase(inMemoryClientsRepository);
    deleteClientByIdUseCase = new DeleteClientByIdUseCase(inMemoryClientsRepository);

    const city: ICreateCityDTO = {
      name: "Faina",
      state: "Goiás",
    };
    await createCityUseCase.execute(city);
    const cities = await findCitiesUseCase.execute({});
    const city_id = cities[0].id;


    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: 23,
      birthdate: new Date("1998-06-25"),
      gender: "masculine",
      city_id,
    }

    const client2: ICreateClientDTO = {
      fullName: "Maria da Silva",
      age: 20,
      birthdate: new Date("2002-01-16"),
      gender: "female",
      city_id,
    }

    await createClientUseCase.execute(client);
    await createClientUseCase.execute(client2);
  });

  it("Should be able to delete a client by id", async () => {
    let clients = await findClientsUseCase.execute({});
    const client = clients[0];
    await deleteClientByIdUseCase.execute(client.id);
    clients = await findClientsUseCase.execute({});
    expect(clients).toHaveLength(1);
  });

  it("Should not be able to delete a client that not exists", async () => {
    expect(async () => {
      await deleteClientByIdUseCase.execute(new Types.ObjectId().toString());
    }).rejects.toBeInstanceOf(DeleteClientByIdError.NotFound);
  });

  it("Should not be able to delete a client with a invalid id", async () => {
    expect(async () => {
      await deleteClientByIdUseCase.execute('123456');
    }).rejects.toBeInstanceOf(DeleteClientByIdError.InvalidId);
  });
});