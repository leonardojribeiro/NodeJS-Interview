import request from "supertest";
import { app } from "../../../../app";
import { CityModel } from "../../../cities/infra/mongodb/models/CityModel";
import { ClientModel } from "../../infra/mongodb/models/ClientModel";


describe("Find Clients", () => {
  beforeAll(async () => {
    await CityModel.deleteMany();
    await ClientModel.deleteMany();
    await request(app)
      .post("/cities")
      .send({
        name: "Faina",
        state: "Goiás",
      });
    const citiesResponse = await request(app).get("/cities");
    const city = citiesResponse.body[0];
    await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: city.id,
      });
    await request(app)
      .post("/clients")
      .send({
        fullName: "Maria da Silva",
        age: 20,
        birthdate: new Date("2002-01-16"),
        gender: "female",
        city_id: city.id,
      });
  });

  it("Should be able to find registered clients", async () => {
    const response = await request(app).get('/clients');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("fullName");
    expect(response.body[0]).toHaveProperty("age");
    expect(response.body[0]).toHaveProperty("birthdate");
    expect(response.body[0]).toHaveProperty("gender");
    expect(response.body[0]).toHaveProperty("city");
    expect(response.body[0].city).toHaveProperty("id");
    expect(response.body[0].city).toHaveProperty("name");
    expect(response.body[0].city).toHaveProperty("state");
  });

  it("Should be able to search for registered clients by fullName", async () => {
    const response = await request(app)
      .get('/clients')
      .query({
        fullName: 'leo'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("fullName");
    expect(response.body[0]).toHaveProperty("age");
    expect(response.body[0]).toHaveProperty("birthdate");
    expect(response.body[0]).toHaveProperty("gender");
    expect(response.body[0]).toHaveProperty("city");
    expect(response.body[0].city).toHaveProperty("id");
    expect(response.body[0].city).toHaveProperty("name");
    expect(response.body[0].city).toHaveProperty("state");
  });

  it("Should not be able to show clients when not satisfies the query", async () => {
    const response = await request(app)
      .get('/clients')
      .query({
        fullName: 'pedro'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});