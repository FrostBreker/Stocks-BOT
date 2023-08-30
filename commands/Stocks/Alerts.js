const yahooFinance = require('yahoo-finance2').default; // NOTE the .default
const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorCommand, successCommand } = require('../../embeds/Misc');
const { alertCreated, alertUpdated, alertDeleted, listAlerts } = require('../../embeds/Alerts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alerts")
        .setDescription("Set an alert on a stock.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add an alert on a stock.")
                .addStringOption(option => option.setName("stock").setDescription("The stock to alert.").setRequired(true).setAutocomplete(true))
                .addNumberOption(option => option.setName("price").setDescription("The price to alert.").setRequired(true))
                .addBooleanOption(option => option.setName("alert_on_higher").setDescription("Alert when the price is higher than the price you set.").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("edit")
                .setDescription("Edit an alert.")
                .addStringOption(option => option.setName("alert_id").setDescription("The alert to edit.").setRequired(true).setAutocomplete(true))
                .addNumberOption(option => option.setName("price").setDescription("The price to alert.").setRequired(true))
                .addBooleanOption(option => option.setName("alert_on_higher").setDescription("Alert when the price is higher than the price you set.").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove an alert.")
                .addStringOption(option => option.setName("alert_id").setDescription("The alert to remove.").setRequired(true).setAutocomplete(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all alerts you setup.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("clear")
                .setDescription("Clear all alerts you setup.")
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
            case 'alert_id': {
                choices = await client.formatAlertsList(await client.getAlertsFromUser(interaction.guild.id, interaction.user.id))
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
                const price = interaction.options.getNumber("price");
                const alert_on_higher = interaction.options.getBoolean("alert_on_higher");

                if (!stock) return interaction.editReply({ embeds: [errorCommand("Alert", "You need to provide a stock to alert.")] });
                if (!price) return interaction.editReply({ embeds: [errorCommand("Alert", "You need to provide a price to alert.")] });

                try {
                    const data = await yahooFinance.quoteSummary(stock, {
                        modules: ['price']
                    });
                    if (!data.price) return interaction.editReply({ embeds: [errorCommand("Alert", "This stock doesn't exist.")] });
                    const alert = await client.createAlert(interaction.guild.id, interaction.user.id, price, stock, alert_on_higher);

                    if (alert) return interaction.editReply({ embeds: [alertCreated(alert)] });
                    else return interaction.editReply({ embeds: [errorCommand("Alert", "Unable to make an alert on this stocks.")] });
                } catch (err) {
                    console.log(err);
                    return interaction.editReply({ embeds: [errorCommand("Alert", "This stock doesn't exist.")] });
                }
            }
            case 'edit': {
                const alert_id = interaction.options.getString("alert_id");
                const price = interaction.options.getNumber("price");
				const alert_on_higher = interaction.options.getBoolean("alert_on_higher");
                
                if (!alert_id) return interaction.editReply({ embeds: [errorCommand("Alert", "You need to provide an alert.")] });
                if (!price) return interaction.editReply({ embeds: [errorCommand("Alert", "You need to provide a price to alert.")] });

                const alert = await client.getAlert(alert_id);
                if (!alert) return interaction.editReply({ embeds: [errorCommand("Alert", "This alert doesn't exist.")] });
                alert.price = price;
                alert.alertOnHigher = alert_on_higher;
                const data = await client.updateAlert(alert._id, { price, alert_on_higher });
                if (data) return interaction.editReply({ embeds: [alertUpdated(alert)] });
                else return interaction.editReply({ embeds: [errorCommand("Alert", "Unable to update this alert.")] });
            }
            case 'remove': {
                const alert_id = interaction.options.getString("alert_id");
                if (!alert_id) return interaction.editReply({ embeds: [errorCommand("Alert", "You need to provide an alert.")] });
                const alert = await client.deleteAlert(alert_id);
                if (alert) return interaction.editReply({ embeds: [alertDeleted(alert)] });
                else return interaction.editReply({ embeds: [errorCommand("Alert", "Unable to remove this alert.")] });
            }
            case 'list': {
                const alerts = await client.getAlertsFromUser(interaction.guild.id, interaction.user.id);
                if (!alerts) return interaction.editReply({ embeds: [errorCommand("Alert", "You don't have any alerts.")] });
                return interaction.editReply({ embeds: [listAlerts(alerts)], ephemeral: true });
            }
            case 'clear': {
                const alerts = await client.getAlertsFromUser(interaction.guild.id, interaction.user.id);
                if (!alerts) return interaction.editReply({ embeds: [errorCommand("Alert", "You don't have any alerts.")] });

                alerts.forEach(async alert => {
                    await client.deleteAlert(alert._id);
                });
                return interaction.editReply({ embeds: [successCommand("Alert", "All your alerts has been removed")] });
            }
            default:
                break;
        }
    }
}