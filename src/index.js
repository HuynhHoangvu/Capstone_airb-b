import express from "express";
import cors from "cors";
import config from "./config/config.js";
import rootRoute from "./routes/rootRoute.js";
const app = express();
app.use(express.json());
app.use(cors());
app.listen(config.PORT);
app.use(rootRoute);