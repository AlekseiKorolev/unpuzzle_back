const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require("./routes/routes");

const PORT = process.env.PORT || 1408;

//middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`);
});
