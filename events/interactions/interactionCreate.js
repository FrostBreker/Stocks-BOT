const config = require('../../config');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return await interaction.reply("Cette commande n'existe pas!");
            return cmd.runSlash(client, interaction);
        } else if (interaction.isAutocomplete()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return await interaction.reply({ content: "This command does not exist! Please contact an administrator !", ephemeral: true });
            return cmd.autoComplete(client, interaction);
        }
    }
}