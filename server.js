import express from "express";
import dbConnect from "./database/index.js";
import { PORT } from "./config/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ConfigureRoutes from "./routes/index.js";

const corsOptions = {
    credentials: true,
    origin: ["http://localhost:3000"],
};

const app = express();

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

ConfigureRoutes(app);

dbConnect();

app.use(errorHandler);

app.listen(PORT, console.log(`Backend is running on port: ${PORT}`));
