const { AutoModLinkMessages } = require('../../src/modules/automod/automod-links')
const { antiSpam } = require('../../src/modules/automod/automod-antispam')

module.exports = async (client, message) => {

AutoModLinkMessages(client, message)
antiSpam(client, message)

}
