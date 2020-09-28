const express = require("express");
const router = express.Router();
const Payload = require("../models/payload");
const { Pool, Client } = require("pg");
const client = new Client();
const pool = new Pool();

router.get("/", async (req, res) => {
  try {
    const payloads = await Payload.find().lean();
    res.render("index", {
      title: "Payloads App",
      payloads,
      helpers: { stringify: (data) => JSON.stringify(data) },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  const payload = new Payload({
    headers: req.headers,
    rawBody: req.body,
  });

  try {
    const newPayload = await payload.save();
    const query = `
      INSERT INTO payloadsrdb (payload_id)
      VALUES ('${newPayload.id}');
    `;

    await pool.query(query)
    await client.close();
    res.sendStatus(201);
  } catch (e) {
    res.status(400).json({ message: e.message });
    return;
  }
});

// Deleting one
// router.delete("/:id", getPayload, async (req, res) => {
//   try {
//     await res.payload.remove();
//     res.json({ message: "Deleted Payload" });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   } finally {
//   }
// });
//
// async function getPayload(req, res, next) {
//   let payload;
//   try {
//     payload = await Payload.findById(req.params.id);
//     if (payload === null) {
//       return res.status(404).json({ message: "Cannot find payload" });
//     }
//   } catch (e) {
//     return res.status(500).json({ message: e.message });
//   }
//
//   res.payload = payload;
//   next();
// }

module.exports = router;
