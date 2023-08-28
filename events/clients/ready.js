const cron = require("node-cron");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    //Check if guild is store in db
    const guildData = [];
    client.guilds.cache.map(e => guildData.push(e));
    guildData.forEach(async g => {
      const data = await client.getGuild(g.id);
      if (!data) client.createGuild(g);
    })

    //Schedule cron jobs to only open market on weekdays
    cron.schedule("*/1 9-18 * * 1-5", async () => {
      await client.checkAlerts();
    });

    //Schedule cron jobs on opening and closing market
    cron.schedule("0 9 * * 1-5", async () => {
      await client.openMarket();
    });
    cron.schedule("0 18 * * 1-5", async () => {
      await client.closeMarket();
    });

    console.log(`${client.user.tag} is ready!`);
  },
};
