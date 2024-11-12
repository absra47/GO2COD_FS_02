import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json()); //allow you to parse the body of the request

app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log("Server is lising on port http://localhost:" + PORT);
  connectDB();
});
