import { Types } from "mongoose";
import { ICitiesRepository } from "../../../cities/repositories/ICitiesRepository";
import { InMemoryCitiesRepository } from "../../../cities/repositories/in-memory/InMemoryCitiesRepository";
import { ICreateCityDTO } from "../../../cities/useCases/createCity/CreateCityDTO";
import { CreateCityUseCase } from "../../../cities/useCases/createCity/CreateCityUseCase";
import { FindCitiesUseCase } from "../../../cities/useCases/findCities/FindCitiesUseCase";
import { IClientsRespository } from "../../repositories/IClientsRespository";
import { InMemoryClientsRepository } from "../../repositories/in-memory/InMemoryClientsRepository";
import { FindClientsUseCase } from "../findClients/FindClientsUseCase";
import { CreateClientError } from "./CreateClientError";
import { CreateClientUseCase } from "./CreateClientUseCase";
import { ICreateClientDTO } from "./ICreateClientDTO";

let inMemoryCitiesRepository: ICitiesRepository;
let createCityUseCase: CreateCityUseCase;
let findCitiesUseCase: FindCitiesUseCase;

let inMemoryClientsRepository: IClientsRespository;
let createClientUseCase: CreateClientUseCase;
let findClientsUseCase: FindClientsUseCase;
let city_id: string;

describe("Create Client", () => {
  beforeAll(async () => {
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    createCityUseCase = new CreateCityUseCase(inMemoryCitiesRepository);
    findCitiesUseCase = new FindCitiesUseCase(inMemoryCitiesRepository);
    const city: ICreateCityDTO = {
      name: "Faina",
      state: "Goiás",
    };
    await createCityUseCase.execute(city);
    const cities = await findCitiesUseCase.execute({});
    city_id = cities[0].id;
  });

  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository(inMemoryCitiesRepository);
    createClientUseCase = new CreateClientUseCase(inMemoryClientsRepository, inMemoryCitiesRepository);
    findClientsUseCase = new FindClientsUseCase(inMemoryClientsRepository);
  });

  it("Should be able to create a new client", async () => {
    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: 23,
      birthdate: new Date("1998-06-25"),
      gender: "masculine",
      city_id,
    }
    await createClientUseCase.execute(client);
    const clients = await findClientsUseCase.execute({});
    const createdClient = clients[0];
    expect(createdClient.id).toBeDefined();
    expect(createdClient.fullName).toBe("Leonardo Jardim Ribeiro");
    expect(createdClient.age).toBe(23);
    expect(createdClient.birthdate).toBeInstanceOf(Date);
    expect(createdClient.gender).toBe("masculine");
    expect(createdClient.city.id).toBe(city_id);
  });

  it("Should not be able to create a client without a fullName", async () => {
    const client: ICreateClientDTO = {
      fullName: "",
      age: 23,
      birthdate: new Date("1998-06-25"),
      gender: "masculine",
      city_id,
    }
    expect(async () => {
      await createClientUseCase.execute(client);
    }).rejects.toBeInstanceOf(CreateClientError.EmptyFullName)
  });

  it("Should not be able to create a client without a age", async () => {
    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: undefined as unknown as number,
      birthdate: new Date("1998-06-25"),
      gender: "masculine",
      city_id,
    }
    expect(async () => {
      await createClientUseCase.execute(client);
    }).rejects.toBeInstanceOf(CreateClientError.EmptyAge)
  });

  it("Should not be able to create a client without a birthdate", async () => {
    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: 23,
      birthdate: undefined as unknown as Date,
      gender: "masculine",
      city_id,
    }
    expect(async () => {
      await createClientUseCase.execute(client);
    }).rejects.toBeInstanceOf(CreateClientError.EmptyBirthdate)
  });

  it("Should not be able to create a client without a gender", async () => {
    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: 23,
      birthdate: new Date("1998-06-25"),
      gender: "",
      city_id,
    }
    expect(async () => {
      await createClientUseCase.execute(client);
    }).rejects.toBeInstanceOf(CreateClientError.EmptyGender)
  });

  it("Should not be able to create a client without a city_id", async () => {
    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: 23,
      birthdate: new Date("1998-06-25"),
      gender: "masculine",
      city_id: "",
    }
    expect(async () => {
      await createClientUseCase.execute(client);
    }).rejects.toBeInstanceOf(CreateClientError.EmptyCityId)
  });

  it("Should not be able to create a client with a invalid city_id", async () => {
    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: 23,
      birthdate: new Date("1998-06-25"),
      gender: "masculine",
      city_id: "12345",
    }
    expect(async () => {
      await createClientUseCase.execute(client);
    }).rejects.toBeInstanceOf(CreateClientError.InvalidCityId)
  });
  
  it("Should not be able to create a client with a city that does not exits", async () => {
    const client: ICreateClientDTO = {
      fullName: "Leonardo Jardim Ribeiro",
      age: 23,
      birthdate: new Date("1998-06-25"),
      gender: "masculine",
      city_id: new Types.ObjectId().toString(),
    }
    expect(async () => {
      await createClientUseCase.execute(client);
    }).rejects.toBeInstanceOf(CreateClientError.CityNotFound)
  });

});