const { EmbedBuilder } = require("discord.js");
const { embedOptions } = require("../config");

class MiscEmbed {
    static successCommand(title, description) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + title)
            .setDescription(description)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }
    static errorCommand(title, description) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.error} ` + title)
            .setDescription(description)
            .setColor(embedOptions.colors.error)
            .setTimestamp();
    }

    static resumeStock(title, description, stock) {
        const data = stock.price;

        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + title)
            .setDescription(description)
            .setColor(embedOptions.colors.success)
            .addFields(
                {
                    name: "Current Price",
                    value: `${data.regularMarketPrice}${data.currencySymbol}`,
                    inline: true
                },
                {
                    name: "Change",
                    value: `${data.regularMarketChange} (${data.regularMarketChangePercent})`,
                    inline: true
                },
                {
                    name: "Open",
                    value: `${data.regularMarketOpen}${data.currencySymbol}`,
                    inline: true
                },
                {
                    name: "High",
                    value: `${data.regularMarketDayHigh}${data.currencySymbol}`,
                    inline: true
                },
                {
                    name: "Low",
                    value: `${data.regularMarketDayLow}${data.currencySymbol}`,
                    inline: true
                },
                {
                    name: "Previous Close",
                    value: `${data.regularMarketPreviousClose}${data.currencySymbol}`,
                    inline: true
                },
                {
                    name: "Volume",
                    value: `${data.regularMarketVolume}`,
                    inline: true
                },
                {
                    name: "Market Cap",
                    value: `${data.marketCap}`,
                    inline: true
                }
            )
            .setTimestamp();

    }
}

module.exports = MiscEmbed;