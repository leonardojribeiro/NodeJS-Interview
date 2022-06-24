import mongoose from "mongoose";

export async function connectDatabase() {

  const url = process.env.MONGO_URL as string;
  const testUrl = process.env.MONGO_TEST_URL as string
  const isTest = process.env.NODE_ENV === "test"; 
  if (isTest) {
    if (!testUrl) {
      throw new Error('Environment variable "MONGO_TEST_URL" is not set');
    }
    await mongoose.connect(testUrl);
  }
  else {
    if (!url) {
      throw new Error('Environment variable "MONGO_URL" is not set');
    }
    await mongoose.connect(url);
  }
  mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc: any, converted: any) => {
      delete converted._id;
    }
  });

}
