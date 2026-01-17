import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

mongoose.connect(process.env.MONGO_URL, (err) => {
  console.log(err ?? "Connected to MongoDB");
});
