const { Schema, model } = require('mongoose');
const User = new Schema({
    UserId: { type: String, required: true },
    GuildId: { type: String, required: true },
    Warns: { type: Array, default: [] },
    BeenKicked : { type: Array, default: [] },
    BeenBanned : { type: Array, default: [] },
    BeenMuted: { type: Array, default: [] },
    BadWordsaid: { type: Array, default: [] },
});


module.exports = model('User', User);
