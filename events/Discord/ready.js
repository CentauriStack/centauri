const connect = require('../../src/database/connect');
module.exports = async (client) => {
    await connect(client);
    client.user.setActivity(client.Config.Bot.playing);   
};