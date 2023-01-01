const { Schema, model } = require('mongoose');

const Guild = new Schema({
    GuildId: { type: String, required: true },
    AutoMod: {
        AlertsChannelId: { type: String, default: null },
        AllowedLinks: { type: Array, default: [] },
        AntiSpamRate: { type: Number, default: 0 },
        AntiSpamLimit: { type: Number, default: 0 },
        Words: {
        Blacklist: { type: Array, default: [] },
        Whitelist: { type: Array, default: [] },
        Sensitivity: { type: Number, default: .85 },
        },
        UserBackgroundCheck: { type: Boolean, default: false },// checks if the user has any previous history with the server
        

    },
    Welcome: {
        channelId: { type: String, default: null },
        WelcomeMessageTitle: { type: String, default: null },
        WelcomeMessageDescription: { type: String, default: null },
    },
});


module.exports = model('Guild', Guild);
