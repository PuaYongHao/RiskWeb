const express = require("express");
const app = express();

app.get("/api");

app.listen(5000, () => {
  console.log("Server starting on port 5000");
});
