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
import { UpdateFullNameOfClientError } from "./UpdateFullNameOfClientError";
import { UpdateFullNameOfClientUseCase } from "./UpdateFullNameOfClientUseCase";

let inMemoryCitiesRepository: ICitiesRepository;
let createCityUseCase: CreateCityUseCase;
let findCitiesUseCase: FindCitiesUseCase;

let inMemoryClientsRepository: IClientsRespository;
let createClientUseCase: CreateClientUseCase;
let findClientsUseCase: FindClientsUseCase;
let updateFullNameOfClientUseCase: UpdateFullNameOfClientUseCase;

describe("Update Full Name Of Client", () => {
  beforeAll(async () => {
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    createCityUseCase = new CreateCityUseCase(inMemoryCitiesRepository);
    findCitiesUseCase = new FindCitiesUseCase(inMemoryCitiesRepository);

    inMemoryClientsRepository = new InMemoryClientsRepository(inMemoryCitiesRepository);
    createClientUseCase = new CreateClientUseCase(inMemoryClientsRepository, inMemoryCitiesRepository);
    findClientsUseCase = new FindClientsUseCase(inMemoryClientsRepository);
    updateFullNameOfClientUseCase = new UpdateFullNameOfClientUseCase(inMemoryClientsRepository);
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

  it("Should be able to update the fullname of registered client", async () => {
    let clients = await findClientsUseCase.execute({});
    const client = clients[0];
    await updateFullNameOfClientUseCase.execute({
      id: client.id,
      fullName: "Leonardo J. Ribeiro"
    });
    clients = await findClientsUseCase.execute({});
    const updatedClient = clients[0];
    expect(updatedClient.fullName).toBe("Leonardo J. Ribeiro");
  });

  it("Should not be able to update the fullname of registered client without a fullname", async () => {
    let clients = await findClientsUseCase.execute({});
    const client = clients[0];
    expect(async () => {
      await updateFullNameOfClientUseCase.execute({
        id: client.id,
        fullName: ""
      });
    }).rejects.toBeInstanceOf(UpdateFullNameOfClientError.EmptyFullName);
  });

  it("Should not be able to update the fullname of registered client when another client has a same fullname", async () => {
    let clients = await findClientsUseCase.execute({});
    const client = clients[0];
    expect(async () => {
      await updateFullNameOfClientUseCase.execute({
        id: client.id,
        fullName: "Maria da Silva"
      });
    }).rejects.toBeInstanceOf(UpdateFullNameOfClientError.ClientWithSameFullNameAlreadyExists);
  });

  it("Should not be able to update the fullname of client that not exists", async () => {
    expect(async () => {
      await updateFullNameOfClientUseCase.execute({
        id: new Types.ObjectId().toString(),
        fullName: "Teste"
      });
    }).rejects.toBeInstanceOf(UpdateFullNameOfClientError.NotFound);
  });

  it("Should not be able to update the fullname of registered client with a invalid id", async () => {
    expect(async () => {
      await updateFullNameOfClientUseCase.execute({
        id: "123456",
        fullName: "Teste"
      });
    }).rejects.toBeInstanceOf(UpdateFullNameOfClientError.InvalidId);
  });
});