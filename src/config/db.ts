import * as mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (Bun.env.MONGO_URI !== undefined) {
      const conn = await mongoose.connect(Bun.env.MONGO_URI, {
        autoIndex: true,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
