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

    static followMarketOpened(follow, stock) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Market opened")
            .setDescription(`The market is now open for ${follow.symbol} on ${stock.price.exchangeName}\n\n- Price: ${stock.price.regularMarketPrice}${stock.price.currencySymbol}\n- Previous close: ${stock.price.regularMarketPreviousClose}\n- Change: ${stock.price.regularMarketChange}\n- Change %: ${stock.price.regularMarketChangePercent}\n- Open: ${stock.price.regularMarketOpen}\n- High: ${stock.price.regularMarketDayHigh}\n- Low: ${stock.price.regularMarketDayLow}\n- Volume: ${stock.price.regularMarketVolume}\n- Market cap: ${stock.price.marketCap}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }

    static followMarketClosed(follow, stock) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Market closed")
            .setDescription(`The market is now closed for ${follow.symbol} on ${stock.price.exchangeName}\n\n- Price: ${stock.price.regularMarketPrice}${stock.price.currencySymbol}\n- Previous close: ${stock.price.regularMarketPreviousClose}\n- Change: ${stock.price.regularMarketChange}\n- Change %: ${stock.price.regularMarketChangePercent}\n- Open: ${stock.price.regularMarketOpen}\n- High: ${stock.price.regularMarketDayHigh}\n- Low: ${stock.price.regularMarketDayLow}\n- Volume: ${stock.price.regularMarketVolume}\n- Market cap: ${stock.price.marketCap}`)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }
}

module.exports = FolowsEmbed;