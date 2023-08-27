const { EmbedBuilder } = require("discord.js");
const { embedOptions } = require("../config");

class FolowsEmbed {
    static listAlerts(alerts) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Alerts list")
            .setDescription(`Here is the list of all the alerts you setup.\n\n${alerts.map(a => `- ${a.symbol} - Price set: ${a.price}`).join("\n")}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }

    static alertCreated(alert) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Alert created")
            .setDescription(`You created an alert for ${alert.symbol} at ${alert.price}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }

    static alertUpdated(alert) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Alert updated")
            .setDescription(`You updated your alert for ${alert.symbol} at ${alert.price}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }

    static alertDeleted(alert) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Alert deleted")
            .setDescription(`You deleted your alert for ${alert.symbol} at ${alert.price}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }
}

module.exports = FolowsEmbed;