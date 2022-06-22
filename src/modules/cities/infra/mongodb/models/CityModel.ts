import { model, Schema } from "mongoose";
import { ICity } from "../../../entities/ICity";

const citySchema = new Schema<ICity>({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  }
});

export const CityModel = model<ICity>("city", citySchema);