const yahooFinance = require('yahoo-finance2').default; // NOTE the .default
const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorCommand, successCommand } = require('../../embeds/Misc');
const { listFollows, followCreated, followUpdated, followDeleted } = require('../../embeds/Follows');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("follow")
        .setDescription("Follow a stock.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a stock to follow.")
                .addStringOption(option => option.setName("stock").setDescription("The stock to follow.").setRequired(true).setAutocomplete(true))
                .addBooleanOption(option => option.setName("open").setDescription("If you want to receive open data?").setRequired(true))
                .addBooleanOption(option => option.setName("close").setDescription("If you want to receive close data?").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("edit")
                .setDescription("Edit a stock to follow.")
                .addStringOption(option => option.setName("stock_id").setDescription("The stock to edit.").setRequired(true).setAutocomplete(true))
                .addBooleanOption(option => option.setName("open").setDescription("If you want to receive open data?").setRequired(true))
                .addBooleanOption(option => option.setName("close").setDescription("If you want to receive close data?").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a stock to follow.")
                .addStringOption(option => option.setName("stock_id").setDescription("The stock to edit.").setRequired(true).setAutocomplete(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all the stocks you follow.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("clear")
                .setDescription("Clear all the stocks you follow.")
        ),
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
            case 'stock_id': {
                choices = await client.formatFollowsList(await client.getFollowsFromUser(interaction.guild.id, interaction.user.id))
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
        if (!guild.isSetup) return interaction.editReply({ embeds: [errorCommand("Guild", "This guild isn't setup.")] });
        await interaction.deferReply({ ephemeral: true });
        const sub = interaction.options.getSubcommand();
        switch (sub) {
            case 'add': {
                const stock = interaction.options.getString("stock");
                const open = interaction.options.getBoolean("open");
                const close = interaction.options.getBoolean("close");
                if (!stock) return interaction.editReply({ embeds: [errorCommand("Stock", "You need to provide a stock to follow.")] });
                if (!open && !close) return interaction.editReply({ embeds: [errorCommand("Stock", "You need to provide at least one data to follow.")] });
                try {
                    const data = await yahooFinance.quoteSummary(stock, {
                        modules: ['price']
                    });
                    if (!data.price) return interaction.editReply({ embeds: [errorCommand("Stock", "This stock doesn't exist.")] });
                    const follow = await client.createFollow(interaction.guild.id, interaction.user.id, stock, open, close);

                    if (follow) return interaction.editReply({ embeds: [followCreated(follow)] });
                    else return interaction.editReply({ embeds: [errorCommand("Stock", "Unable to followed this stocks.")] });
                } catch (err) {
                    console.log(err);
                    return interaction.editReply({ embeds: [errorCommand("Stock", "This stock doesn't exist.")] });
                }
            }
            case 'edit': {
                const stock_id = interaction.options.getString("stock_id");
                const open = interaction.options.getBoolean("open");
                const close = interaction.options.getBoolean("close");
                if (!stock_id) return interaction.editReply({ embeds: [errorCommand("Stock", "You need to provide a stock to follow.")] });
                if (!open && !close) return interaction.editReply({ embeds: [errorCommand("Stock", "You need to provide at least one data to follow.")] });
                const follow = await client.getFollow(stock_id);
                if (!follow) return interaction.editReply({ embeds: [errorCommand("Stock", "This stock doesn't exist.")] });
                follow.onOpen = open;
                follow.onClose = close;
                const data = await client.updateFollow(follow._id, { onOpen: open, onClose: close });
                if (data) return interaction.editReply({ embeds: [followUpdated(follow)] });
                else return interaction.editReply({ embeds: [errorCommand("Stock", "Unable to update this stocks.")] });
            }
            case 'remove': {
                const stock_id = interaction.options.getString("stock_id");
                if (!stock_id) return interaction.editReply({ embeds: [errorCommand("Stock", "You need to provide a stock to follow.")] });
                const follow = await client.deleteFollow(stock_id);
                if (follow) return interaction.editReply({ embeds: [followDeleted(follow)] });
                else return interaction.editReply({ embeds: [errorCommand("Stock", "Unable to unfollowed this stocks.")] });
            }
            case 'list': {
                const follows = await client.getFollowsFromUser(interaction.guild.id, interaction.user.id);
                if (!follows) return interaction.editReply({ embeds: [errorCommand("Stock", "You are not following any stocks.")] });
                return interaction.editReply({ embeds: [listFollows(follows)], ephemeral: true });
            }
            case 'clear': {
                const follows = await client.getFollowsFromUser(interaction.guild.id, interaction.user.id);
                if (!follows) return interaction.editReply({ embeds: [errorCommand("Stock", "You are not following any stocks.")] });

                follows.forEach(async follow => {
                    await client.deleteFollow(follow._id);
                });
                return interaction.editReply({ embeds: [successCommand("Stock", "You are no longer following any stocks.")] });
            }
            default:
                break;
        }
    }
}