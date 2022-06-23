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
import { FindClientByIdUseCase } from "./FindClientByIdUseCase";
let inMemoryCitiesRepository: ICitiesRepository;
let createCityUseCase: CreateCityUseCase;
let findCitiesUseCase: FindCitiesUseCase;

let inMemoryClientsRepository: IClientsRespository;
let createClientUseCase: CreateClientUseCase;
let findClientsUseCase: FindClientsUseCase;
let findClientByIdUseCase: FindClientByIdUseCase;
let city_id: string;

describe("Find Client By Id", () => {
  beforeAll(async () => {
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    createCityUseCase = new CreateCityUseCase(inMemoryCitiesRepository);
    findCitiesUseCase = new FindCitiesUseCase(inMemoryCitiesRepository);

    inMemoryClientsRepository = new InMemoryClientsRepository(inMemoryCitiesRepository);
    createClientUseCase = new CreateClientUseCase(inMemoryClientsRepository, inMemoryCitiesRepository);
    findClientsUseCase = new FindClientsUseCase(inMemoryClientsRepository);
    findClientByIdUseCase = new FindClientByIdUseCase(inMemoryClientsRepository);

    const city: ICreateCityDTO = {
      name: "Faina",
      state: "Goiás",
    };
    await createCityUseCase.execute(city);
    const cities = await findCitiesUseCase.execute({});
    city_id = cities[0].id;


    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: 23,
      birthdate: new Date("1998-06-25"),
      gender: "masculine",
      city_id,
    }

    await createClientUseCase.execute(client);
  });

  it("Should be able to find a client by id", async () => {
    const clients = await findClientsUseCase.execute({});
    const client = clients[0];
    const foundClient = await findClientByIdUseCase.execute(client.id);
    expect(foundClient.id).toBeDefined();
    expect(foundClient.fullName).toBe("Leonardo Jardim Ribeiro");
    expect(foundClient.age).toBe(23);
    expect(foundClient.birthdate).toBeDefined();
    expect(foundClient.gender).toBe("masculine"); 
    expect(foundClient.city.id).toBe(city_id); 
  });


});