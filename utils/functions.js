const mongoose = require("mongoose");
const { Alerts, Follows, Guilds } = require("../schemas")
module.exports = async client => {
    //GUILDS FUNCTIONS
    //Get a guild
    client.getGuild = async guildId => {
        const data = await Guilds.findOne({ guildId });
        if (data) return data;
        else return undefined;
    };

    //Create a guild
    client.createGuild = async guild => {
        const merged = Object.assign({ _id: new mongoose.Types.ObjectId() }, {
            guildId: guild.id,
            ownerId: guild.ownerId,
            guildName: guild.name,
            alertChannelId: null,
            followChannelId: null,
            isSetup: false
        });
        const createGuild = await new Guilds(merged);
        createGuild.save().then(g => console.log(`New guild -> ${g.guildId}`));
    };

    //Delete a guild
    client.deleteGuild = async guildId => {
        await Guilds.findOneAndDelete({ guildId }).then((e) => {
            console.log(`Deleted guild -> ${e.guildId}`);
        })
    };

    //Update a guild
    client.updateGuild = async (guildId, newData) => {
        const data = await Guilds.findOneAndUpdate({ guildId }, newData);
        if (data) return data;
        else return undefined;
    };

    //ALERTS FUNCTIONS
    //Get all alerts
    client.getAllAlerts = async () => {
        const data = await Alerts.find();
        if (data) return data;
        else return undefined;
    };

    //Get all alerts from a user
    client.getAlertsFromUser = async (guildId, ownerId) => {
        const data = await Alerts.find({ guildId, ownerId });
        if (data) return data;
        else return undefined;
    };

    //Format the alerts list
    client.formatAlertsList = async (alerts) => {
        let choices = [];
        alerts.forEach(a => {
            choices.push({
                name: `${a.symbol} - ${a.price} - ${a.hasBeenTrigered ? "Triggered" : "Not triggered"}`,
                value: a._id
            })
        });
        return choices;
    };

    //Get an alert
    client.getAlert = async _id => {
        const data = await Alerts.findById(_id);
        if (data) return data;
        else return undefined;
    };

    //Create an alert
    client.createAlert = async (guildId, ownerId, price, symbol) => {
        const merged = Object.assign({ _id: new mongoose.Types.ObjectId() }, {
            guildId,
            ownerId,
            price,
            symbol,
            hasBeenTrigered: false
        });
        const createAlert = await new Alerts(merged);
        return createAlert.save().then(a => {
            console.log(`New alert -> ${a._id}`)
            return a
        });
    };

    //Update an alert
    client.updateAlert = async (_id, newData) => {
        const data = await Alerts.findByIdAndUpdate(_id, newData);
        if (data) return data;
        else return undefined;
    };

    //Delete an alert
    client.deleteAlert = async _id => {
        return await Alerts.findByIdAndDelete(_id).then((e) => {
            console.log(`Deleted alert -> ${e._id}`);
            return e
        })
    };

    //FOLLOWS FUNCTIONS
    //Get all follows
    client.getAllFollows = async () => {
        const data = await Follows.find();
        if (data) return data;
        else return undefined;
    };

    //Get all follows from a user
    client.getFollowsFromUser = async (guildId, ownerId) => {
        const data = await Follows.find({ guildId, ownerId });
        if (data) return data;
        else return undefined;
    };

    //Format the follows list
    client.formatFollowsList = async (follows) => {
        let choices = [];
        follows.forEach(follow => {
            choices.push({
                name: `${follow.symbol} - ${follow.onOpen ? "Open" : ""} ${follow.onOpen && follow.onClose ? " and " : ""} ${follow.onClose ? "Close" : ""}`,
                value: follow._id
            })
        });
        return choices;
    };

    //Get a follow
    client.getFollow = async _id => {
        const data = await Follows.findById(_id);
        if (data) return data;
        else return undefined;
    };

    //Create a follow
    client.createFollow = async (guildId, ownerId, symbol, onOpen, onClose) => {
        const merged = Object.assign({ _id: new mongoose.Types.ObjectId() }, {
            guildId,
            ownerId,
            symbol,
            onOpen,
            onClose
        });
        const createFollow = await new Follows(merged);
        return await createFollow.save().then(f => {
            console.log(`New follow -> ${f._id}`);
            return f
        });
    };

    //Update a follow
    client.updateFollow = async (_id, newData) => {
        const data = await Follows.findByIdAndUpdate(_id, newData);
        if (data) return data;
        else return undefined;
    };

    //Delete a follow
    client.deleteFollow = async _id => {
        return await Follows.findByIdAndDelete(_id).then((e) => {
            console.log(`Deleted follow -> ${e._id}`);
            return e
        })
    };


    //MISC FUNCTIONS
    //Get the timestamp
    client.timestampParser = num => {
        const date = new Date(num ? num : Date.now()).toLocaleDateString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        return date.toString();
    };

    //Check if a value is empty
    client.isEmpty = (value) => {
        return (
            value === undefined ||
            value === null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
        );
    };
};