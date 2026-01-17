import cors from "cors";
import express from "express";
import ClientError from "./commons/exceptions/ClientError.js";
import { auth } from "./routes/auth.js";
import { campus } from "./routes/campus.js";
import { users } from "./routes/users.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/campus", campus);
app.use("/users", users);

app.get("/", (req, res) => res.send("Server is running!"));

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.log(err);
  return res.status(500).json({
    message: "internal server error",
  });
});

export default app;