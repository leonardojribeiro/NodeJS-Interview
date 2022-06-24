import { ICitiesRepository } from "../../../cities/repositories/ICitiesRepository";
import { InMemoryCitiesRepository } from "../../../cities/repositories/in-memory/InMemoryCitiesRepository";
import { ICreateCityDTO } from "../../../cities/useCases/createCity/CreateCityDTO";
import { CreateCityUseCase } from "../../../cities/useCases/createCity/CreateCityUseCase";
import { FindCitiesUseCase } from "../../../cities/useCases/findCities/FindCitiesUseCase";
import { IClientsRespository } from "../../repositories/IClientsRespository";
import { InMemoryClientsRepository } from "../../repositories/in-memory/InMemoryClientsRepository";
import { CreateClientUseCase } from "../createClient/CreateClientUseCase";
import { ICreateClientDTO } from "../createClient/ICreateClientDTO";
import { FindClientsUseCase } from "./FindClientsUseCase";

let inMemoryCitiesRepository: ICitiesRepository;
let createCityUseCase: CreateCityUseCase;
let findCitiesUseCase: FindCitiesUseCase;

let inMemoryClientsRepository: IClientsRespository;
let createClientUseCase: CreateClientUseCase;
let findClientsUseCase: FindClientsUseCase;
let city_id: string;

describe("Find Clients", () => {
  beforeAll(async () => {
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    createCityUseCase = new CreateCityUseCase(inMemoryCitiesRepository);
    findCitiesUseCase = new FindCitiesUseCase(inMemoryCitiesRepository);

    inMemoryClientsRepository = new InMemoryClientsRepository(inMemoryCitiesRepository);
    createClientUseCase = new CreateClientUseCase(inMemoryClientsRepository, inMemoryCitiesRepository);
    findClientsUseCase = new FindClientsUseCase(inMemoryClientsRepository);

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

  it("Should be able to find registered clients", async () => {
    const clients = await findClientsUseCase.execute({});
    expect(clients).toHaveLength(2);
    expect(clients[0]).toHaveProperty("id");
    expect(clients[0]).toHaveProperty("fullName");
    expect(clients[0]).toHaveProperty("age");
    expect(clients[0]).toHaveProperty("birthdate");
    expect(clients[0]).toHaveProperty("gender");
    expect(clients[0]).toHaveProperty("city");
    expect(clients[0].city).toHaveProperty("id");
    expect(clients[0].city).toHaveProperty("name");
    expect(clients[0].city).toHaveProperty("state");
  });

  it("Should be able to search for registered clients by fullName", async () => {
    const clients = await findClientsUseCase.execute({
      fullName: "leo"
    });
    expect(clients).toHaveLength(1); 
    expect(clients[0]).toHaveProperty("id");
    expect(clients[0]).toHaveProperty("fullName");
    expect(clients[0]).toHaveProperty("age");
    expect(clients[0]).toHaveProperty("birthdate");
    expect(clients[0]).toHaveProperty("gender");
    expect(clients[0]).toHaveProperty("city");
    expect(clients[0].city).toHaveProperty("id");
    expect(clients[0].city).toHaveProperty("name");
    expect(clients[0].city).toHaveProperty("state");
  });

  it("Should not be able to show clients when not satisfies the query", async () => {
    const clients = await findClientsUseCase.execute({
      fullName: "Pedro"
    });
    expect(clients).toHaveLength(0);
  });
});