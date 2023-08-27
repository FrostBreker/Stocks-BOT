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
    console.log(`${client.user.tag} is ready!`);
  },
};
