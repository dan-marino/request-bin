require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const { Pool, Client } = require("pg");
const client = new Client();
const pool = new Pool();

// Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Connect to Mongo
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", (error) => console.log("Connected to Database"));

// Connect to Postgres
client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

pool.on('error', (err, client) => {
    console.error('Error:', err);
});

// Create payloadsRDB schema
const query = `
  CREATE TABLE payloadsRDB (
    id serial PRIMARY KEY,
    payload_id varchar(25) NOT NULL UNIQUE
  );
`;

client.query(query, (err, res) => {
  if (err && err.code === '42P07') {
    console.log('Table is already created');
    return;
  } else if (err) {
    console.error(err);
    return;
  }
  console.log('Table is successfully created');
  client.end();
});

app.use(express.json());

// Routes
const payloadsRouter = require("./routes/payloads");
app.use("/payloads", payloadsRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
