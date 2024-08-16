"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

/* ------------------------------------------------------- */
//* cors
// app.use(cors()); // all clients

app.use(
  cors({
    origin: [
      "https://bloggiie.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
// envVariables to process.env:
require("dotenv").config();
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require("express-async-errors");

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* -------------------------------------------------------------------------- */
/*                               MIDDLEWARES                                  */
/* -------------------------------------------------------------------------- */

// Accept JSON:
app.use(express.json());
// Accept FromData
app.use(express.urlencoded({ extended: false }));

// Check Authentication:
app.use(require("./src/middlewares/authentication"));

// Run Logger:
app.use(require("./src/middlewares/logger"));

// res.getModelList():
app.use(require("./src/middlewares/queryHandler"));
app.use(morgan("dev"));

/* -------------------------------------------------------------------------- */
/*                               ROUTES                                       */
/* -------------------------------------------------------------------------- */

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to Bloggy API",
    documents: {
      swagger: "/documents/swagger",
      redoc: "/documents/redoc",
      json: "/documents/json",
    },
    user: req.user,
  });
});

//* Static root
app.use("/uploads", express.static("./uploads"));

// console.log("668a947fda3efd683614df26" + Date.now());

// Routes:
app.use(require("./src/routes"));

app.use((req, res, next) => {
  res.status(404).send({
    error: true,
    message: "Route not found!",
  });
});

/* ------------------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log("http://127.0.0.1:" + PORT));
/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require("./src/helpers/sync")(); // !!! It clear database.
