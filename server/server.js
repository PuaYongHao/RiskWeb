require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
};
app.use(cors(corsOptions)); // Use this after the variable declaration

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Load the /project routes
const projectRouter = require("./routes/Project");
app.use("/Project", projectRouter);

// Load the /user routes
const userRouter = require("./routes/User");
app.use("/User", userRouter);

// Load the /scenario routes
const scenarioRouter = require("./routes/Scenario");
app.use("/Scenario", scenarioRouter);

// Load the /risk routes
const riskRouter = require("./routes/Risk");
app.use("/Risk", riskRouter);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("An unexpected error occured.");
});

// Start the Express server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
