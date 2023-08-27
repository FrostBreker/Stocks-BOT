const { EmbedBuilder } = require("discord.js");
const { embedOptions } = require("../config");

class FolowsEmbed {
    static listFollows(follows) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Follows list")
            .setDescription(`Here is the list of all the stocks you follow.\n\n${follows.map(follow => `- ${follow.symbol} - ${follow.onOpen ? "Open" : ""} ${follow.onOpen && follow.onClose ? " and " : ""} ${follow.onClose ? "Close" : ""}`).join("\n")}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }

    static followCreated(follow) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Follow created")
            .setDescription(`You are now following ${follow.symbol}\n\n- Open: ${follow.onOpen}\n- Close: ${follow.onClose}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }

    static followUpdated(follow) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Follow updated")
            .setDescription(`You updated your follow for ${follow.symbol}\n\n- Open: ${follow.onOpen}\n- Close: ${follow.onClose}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }

    static followDeleted(follow) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Follow deleted")
            .setDescription(`You are no longer following ${follow.symbol}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }
}

module.exports = FolowsEmbed;