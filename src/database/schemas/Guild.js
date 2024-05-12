const { Schema, model } = require('mongoose');

const Guild = new Schema({
    GuildId: { type: String, required: true },
    AutoMod: {
        AlertsChannelId: { type: String, default: null },
        AllowedLinks: { type: Array, default: [] },
        AntiSpamRate: { type: Number, default: 0 },
        AntiSpamLimit: { type: Number, default: 0 },
        

    },
    Welcome: {
        channelId: { type: String, default: null },
        WelcomeMessageTitle: { type: String, default: null },
        WelcomeMessageDescription: { type: String, default: null },
    }/*,
    Users: { type: Map, of: { 
            UserId: { type: String, required: true },
            Warns: { type: Array, default: [] },
            BeenKicked : { type: Boolean, default: false },
            BeenBanned : { type: Boolean, default: false },
             
        },
    },
    */

});


module.exports = model('Guild', Guild);
