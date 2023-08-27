module.exports = {
    name: "guildDelete",
    once: false,
    async execute(client, guild) {
        const data = await client.getGuild(guild.id);
        if (data) client.deleteGuild(guild.id);
    }
}