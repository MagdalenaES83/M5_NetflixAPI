import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { errorHandler } from "./errorHandlers.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";


import mediaRouter from "./media/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDirectory = path.join(__dirname, "../public");


const server = express();

const { PORT } = process.env;

const whiteList = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.some((allowedUrl) => allowedUrl === origin)) {
      callback(null, true);
    } else {
      const error = new Error("cors go home! ");
      error.status = 403;
      callback(error);
    }
  },
};

server.use(cors());//
server.use(express.json());
server.use(express.static(publicDirectory));

server.use("/media", mediaRouter);

//server.use(errorHandler);

//console.log(listEndpoints(server));

server.listen(PORT, () => console.log(" Server is running on port : ", PORT));

server.on("error", (error) =>
  console.log(`Server is not running due to : ${error}`)
);
