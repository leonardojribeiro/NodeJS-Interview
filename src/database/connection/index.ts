import mongoose from "mongoose";

export async function connectDatabase() {

  const url = process.env.MONGO_URL as string;
  if (!url) {
    throw new Error('Environment variable "MONGO_URL" is not set');
  }
  await mongoose.connect(url);
  mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc: any, converted: any) => {
      delete converted._id;
    }
  });

}
