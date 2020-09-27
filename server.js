require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", (error) => console.log("Connected to Database"));

app.use(express.json());

const payloadsRouter = require("./routes/payloads");
app.use("/payloads", payloadsRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
