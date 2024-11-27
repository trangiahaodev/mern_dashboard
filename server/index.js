import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

/* Data imports */
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import { dataUser, dataProduct, dataProductStat } from "./data/index.js";

/* CONFIGURATION */
dotenv.config(); // Set up environment variables
const app = express(); // Create an instance of an Express application
app.use(express.json()); // Middleware to parse incoming JSON payloads
app.use(helmet()); // Add security headers to your application by setting a variety of HTTP headers to improve security
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow cross-origin requests
// This is particularly important if your front-end (React) and back-end (Express) are hosted on different domains or ports
app.use(morgan("common")); // Logging middleware to log details of incoming HTTP requests (method, URL, status code, ...)
app.use(bodyParser.json()); // Middleware to parse incoming JSON payloads
// Historically, developers used body-parser for parsing JSON, but it's now built into Express (express.json()).
app.use(bodyParser.urlencoded({ extended: false })); // Middleware to parse incoming URL-encoded data
// When forms are submitted with application/x-www-form-urlencoded data, this middleware converts the payload into a js object
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing (CORS)

/* ROUTES */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000; // Set the port number
mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // await User.insertMany(dataUser);
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });
