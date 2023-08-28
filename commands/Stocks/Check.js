const yahooFinance = require('yahoo-finance2').default; // NOTE the .default
const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorCommand, resumeStock } = require('../../embeds/Misc');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription("Check a stock.")
        .addStringOption(option => option.setName("stock").setDescription("The stock to check.").setRequired(true).setAutocomplete(true)),
    autoComplete: async (client, interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        let choices = [];

        switch (focusedOption.name) {
            case 'stock': {
                const stock = interaction.options.getString("stock");
                if (!stock) return;
                try {
                    const data = await yahooFinance.search(stock, {
                        quotesCount: 10,
                        newsCount: 0,
                        enableNavLinks: false,
                        enableEnhancedTrivialQuery: false
                    });
                    data.quotes.forEach(result => {
                        if (!result.symbol) return;
                        if (!result.longname) return;
                        if (!result.exchDisp) return;

                        choices.push({
                            name: `${result.symbol} - ${result.longname} - ${result.exchDisp}`,
                            value: result.symbol
                        })
                    });
                } catch (err) {
                    console.log(err);
                    return
                }
                break;
            }
            default:
                break;
        }
        await interaction.respond(choices);
    },
    runSlash: async (client, interaction) => {
        const guild = await client.getGuild(interaction.guild.id);
        if (!guild) return interaction.editReply({ embeds: [errorCommand("Guild", "This guild doesn't exist.")] });
        await interaction.deferReply({ ephemeral: true });
        const stock = interaction.options.getString("stock");

        const data = await client.getStock(stock);
        if (!data.price) return interaction.editReply({ embeds: [errorCommand("Check Stock", "This stock doesn't exist.")] });

        return await interaction.editReply({ embeds: [resumeStock("Check Stock", `**${data.price.shortName}** - ${data.price.symbol} - ${data.price.exchangeName}`, data)] });
    }
}