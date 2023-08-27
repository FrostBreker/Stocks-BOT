const mongoose = require("mongoose");

const followSchema = mongoose.Schema({
  ownerId: String,
  guildId: String,
  symbol: String,
  onOpen: Boolean,
  onClose: Boolean,
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Follows", followSchema);