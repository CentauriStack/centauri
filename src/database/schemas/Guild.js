const { Schema, model } = require('mongoose');

const Guild = new Schema({
    GuildId: { type: String, required: true },
    AutoMod: {
        AlertsChannel: { type: String, default: null },
        AllowedLinks: { type: Array, default: [] },
    },
    Welcome: {
        channelId: { type: String, default: null },
        WelcomeMessage: { type: String, default: null },
    }
});


module.exports = model('Guild', Guild);
