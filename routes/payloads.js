const express = require("express");
const router = express.Router();
const Payload = require("../models/payload");

// Getting all
router.get("/", async (req, res) => {
  try {
    const payloads = await Payload.find();
    res.json(payloads);
  } catch (e) {
    res.status(500).json({ message: e.message });
  } finally {
  }
});

// Getting one
router.get("/:id", getPayload, (req, res) => {
  res.json(res.payload);
});

// Creating onc
router.post("/", async (req, res) => {
  const payload = new Payload({
    headers: req.headers,
    body: req.body,
  });

  try {
    const newPayload = await payload.save();
    res.status(201).json(newPayload);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Deleting one
router.delete("/:id", getPayload, async (req, res) => {
  try {
    await res.payload.remove();
    res.json({ message: "Deleted Payload" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  } finally {
  }
});

async function getPayload(req, res, next) {
  let payload;
  try {
    payload = await Payload.findById(req.params.id);
    if (payload === null) {
      return res.status(404).json({ message: "Cannot find payload" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }

  res.payload = payload;
  next();
}

module.exports = router;
