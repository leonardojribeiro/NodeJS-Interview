import { ICity } from "../../cities/entities/ICity";

export interface IClient {
  id: string;
  fullName: string;
  birthdate: Date;
  age: number;
  gender: string;
  city: string;
}

export interface IClientWithCity {
  id: string;
  fullName: string;
  birthdate: Date;
  age: number;
  gender: string;
  city: ICity;
}