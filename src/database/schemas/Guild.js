const { Schema, model } = require('mongoose');

const Guild = new Schema({
    GuildId: { type: String, required: true },
    AutoMod: {
        AlertsChannelId: { type: String, default: null },
        AllowedLinks: { type: Array, default: [] },

    },
    Welcome: {
        channelId: { type: String, default: null },
        WelcomeMessageTitle: { type: String, default: null },
        WelcomeMessageDescription: { type: String, default: null },
    }
});


module.exports = model('Guild', Guild);
