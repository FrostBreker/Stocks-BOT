const mongoose = require("mongoose");

const alertSchema = mongoose.Schema({
  ownerId: String,
  guildId: String,
  price: Number,
  alertOnHigher: Boolean,
  symbol: String,
  hasBeenTrigered: Boolean,
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alerts", alertSchema);