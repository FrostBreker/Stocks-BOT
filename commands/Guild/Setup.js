const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorCommand, successCommand } = require('../../embeds/Misc');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup the guild for the bot to work properly.")
        .setDefaultMemberPermissions(8)
        .addChannelOption(option => option.setName("alert_channel").setDescription("The channel where the bot will send the alerts.").setRequired(true))
        .addChannelOption(option => option.setName("follow_channel").setDescription("The channel where the bot will send the stocks follows.").setRequired(true)),
    runSlash: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const alertChannel = interaction.options.getChannel("alert_channel");
        const followsChannel = interaction.options.getChannel("follow_channel");

        if (alertChannel.type !== 0) return interaction.editReply({ embeds: [errorCommand("Channel", "The alert channel must be a text channel.")], ephemeral: true });
        if (followsChannel.type !== 0) return interaction.editReply({ embeds: [errorCommand("Channel", "The follow channel must be a text channel.")], ephemeral: true });

        const guild = await client.getGuild(interaction.guild.id);
        if (client.isEmpty(guild)) return interaction.editReply({ embeds: [errorCommand("Database", "The guild is not registered in the database.")], ephemeral: true });

        const newData = {
            alertChannelId: alertChannel.id,
            followChannelId: followsChannel.id,
            isSetup: true
        };

        const updatedGuild = await client.updateGuild(interaction.guild.id, newData);
        if (client.isEmpty(updatedGuild)) return interaction.editReply({ embeds: [errorCommand("Database", "The guild could not be updated in the database.")], ephemeral: true });

        alertChannel.send({ embeds: [successCommand("Alert Setup", "The guild has been successfully setup.")] });
        followsChannel.send({ embeds: [successCommand("Follow Setup", "The guild has been successfully setup.")] });
        return interaction.editReply({ embeds: [successCommand("Setup", "The guild has been successfully setup.")], ephemeral: true });
    }
}