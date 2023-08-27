module.exports = {
    name: "guildCreate",
    once: false,
    async execute(client, guild) {
        const data = await client.getGuild(guild);
        if (!data) client.createGuild(guild);
    }
}