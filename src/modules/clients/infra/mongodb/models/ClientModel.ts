import { model, Schema } from "mongoose";
import { IClient } from "../../../entities/IClient";

const clientSchema = new Schema<IClient>({
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
    ref: 'city',
  },
});


export const ClientModel = model<IClient>("client", clientSchema); 