import request from "supertest";
import { app } from "../../../../app";
import { ICity } from "../../../cities/entities/ICity";
import { CityModel } from "../../../cities/infra/mongodb/models/CityModel";
import { ClientModel } from "../../infra/mongodb/models/ClientModel";

let city: ICity;

describe("Create Client", () => {
  beforeAll(async () => {
    await CityModel.deleteMany();
    await request(app)
      .post("/cities")
      .send({
        name: "Faina",
        state: "Goiás",
      });
    const citiesResponse = await request(app).get("/cities");
    city = citiesResponse.body[0];
  });

  beforeEach(async () => {
    await ClientModel.deleteMany();
  });
   

  it("Should be able to create a new client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: city.id,
      });
    expect(response.status).toBe(201);
    const createdResponse = await request(app).get('/clients');
    expect(createdResponse.status).toBe(200);
    expect(createdResponse.body).toHaveLength(1);
    expect(createdResponse.body[0]).toHaveProperty("id");
    expect(createdResponse.body[0]).toHaveProperty("fullName");
    expect(createdResponse.body[0]).toHaveProperty("age");
    expect(createdResponse.body[0]).toHaveProperty("birthdate");
    expect(createdResponse.body[0]).toHaveProperty("gender");
    expect(createdResponse.body[0]).toHaveProperty("city");
    expect(createdResponse.body[0].city).toHaveProperty("id");
    expect(createdResponse.body[0].city).toHaveProperty("name");
    expect(createdResponse.body[0].city).toHaveProperty("state");
  });

  it("Should not be able to create a new client with a fullname that alread exists", async () => {
    await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: city.id,
      });
    const response = await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: city.id,
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Client alread exists.');
  });

  it("Should not be able to create a client without a fullName", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: city.id,
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "fullName" can not be empty.');
  });

  it("Should not be able to create a client without a age", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: city.id,
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "age" can not be empty.');
  });

  it("Should not be able to create a client without a birthdate", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        gender: "masculine",
        city_id: city.id,
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "birthdate" can not be empty.');
  });

  it("Should not be able to create a client without a gender", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        city_id: city.id,
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "gender" can not be empty.');
  });

  it("Should not be able to create a client without a city_id", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "city_id" can not be empty.');
  });

  it("Should not be able to create a client with a invalid city_id", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: "12345"
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "city_id" must be a valid id.');
  });

  it("Should not be able to create a client with a city that does not exits", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: "62b4eadc8d9aa420ca597427"
      });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('City not found.');
  });
});