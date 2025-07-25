const express = require("express");
const router = express.Router();
const Capsule = require("../models/Capsule");
const upload = require("../middleware/upload");

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { message, unlockDate } = req.body;

    const newCapsule = new Capsule({
      message,
      unlockDate,
      imagePath: req.file ? req.file.filename : null, // handle optional file
    });

    await newCapsule.save();
    res.status(201).json({ success: true, capsule: newCapsule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    console.log("GET /api/capsule called");
    const capsules = await Capsule.find().sort({ createdAt: -1 });
    res.json({ capsules });
  } catch (err) {
    console.error("Error fetching capsules:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      return res.status(404).json({ success: false, error: "Capsule not found" });
    }

    const currentDate = new Date();
    const unlockDate = new Date(capsule.unlockDate);

    if (currentDate < unlockDate) {
      return res.status(403).json({ success: false, error: "Capsule is locked. Try again later." });
    }

    res.status(200).json({ success: true, capsule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const capsule = await Capsule.findByIdAndDelete(req.params.id);

    if (!capsule) {
      return res.status(404).json({ success: false, error: "Capsule not found" });
    }

    res.status(200).json({ success: true, message: "Capsule deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
