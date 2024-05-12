const { AutoModLinkMessages } = require('../../src/modules/automod-links')
const { antiSpam } = require('../../src/modules/automod-antispam')
const { Guild } = require('../../src/database/models');

module.exports = async (client, message) => {

const guildData = await Guild.findOne({ GuildId: message.guildId})

AutoModLinkMessages(client, message)
antiSpam(client, message)

}
