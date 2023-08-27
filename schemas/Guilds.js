const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
  ownerId: String,
  guildId: String,
  guildName: String,
  alertChannelId: String,
  followChannelId: String,
  isSetup: Boolean,
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guilds", guildSchema);