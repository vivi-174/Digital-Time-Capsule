const mongoose = require("mongoose");
const CapsuleSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  unlockDate: {
    type: Date,
    required: true,
  },
  imagePath: {
    type: String,
    required: false, 
  },
}, { timestamps: true }); 

module.exports = mongoose.model("Capsule", CapsuleSchema);
