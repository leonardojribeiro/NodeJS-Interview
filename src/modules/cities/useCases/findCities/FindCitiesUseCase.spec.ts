import { InMemoryCitiesRepository } from "../../repositories/in-memory/InMemoryCitiesRepository";
import { ICreateCityDTO } from "../createCity/CreateCityDTO";
import { CreateCityUseCase } from "../createCity/CreateCityUseCase";
import { FindCitiesUseCase } from "./FindCitiesUseCase";

let createCityUseCase: CreateCityUseCase;
let findCitiesUseCase: FindCitiesUseCase;
let inMemoryCitiesRepository: InMemoryCitiesRepository;

describe("Find Cities", () => {
  beforeAll(async () => {
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    createCityUseCase = new CreateCityUseCase(inMemoryCitiesRepository);
    const city: ICreateCityDTO = {
      name: "Faina",
      state: "Goiás",
    };
    const city2: ICreateCityDTO = {
      name: "Itapuranga",
      state: "Goiás",
    };
    await createCityUseCase.execute(city);
    await createCityUseCase.execute(city2);
  });
  beforeEach(() => {
    findCitiesUseCase = new FindCitiesUseCase(inMemoryCitiesRepository);
  });

  it("Should be able to find registered cities", async () => {
    const cities = await findCitiesUseCase.execute({});
    expect(cities).toHaveLength(2);
    expect(cities[0]).toHaveProperty("id");
    expect(cities[0]).toHaveProperty("name");
    expect(cities[0]).toHaveProperty("state");
  });

  it("Should be able to search cities by name", async () => {
    const cities = await findCitiesUseCase.execute({ name: "Faina" });
    expect(cities).toHaveLength(1);
    expect(cities[0]).toHaveProperty("id");
    expect(cities[0]).toHaveProperty("name");
    expect(cities[0]).toHaveProperty("state");
  });

  it("Should be able to search cities by state", async () => {
    const cities = await findCitiesUseCase.execute({ state: "Goiás" });
    expect(cities).toHaveLength(2);
    expect(cities[0]).toHaveProperty("id");
    expect(cities[0]).toHaveProperty("name");
    expect(cities[0]).toHaveProperty("state");
  });

  it("Should be able to search cities by name and state", async () => {
    const cities = await findCitiesUseCase.execute({
      name: "Ita",
      state: "Goiás",
    });
    expect(cities).toHaveLength(1);
    expect(cities[0]).toHaveProperty("id");
    expect(cities[0]).toHaveProperty("name");
    expect(cities[0]).toHaveProperty("state");
  });

  it("Should not be able to show cities when not satisfies the query", async () => {
    const cities = await findCitiesUseCase.execute({
      state: "Minas Gerais",
    });
    expect(cities).toHaveLength(0);
  });
}); 