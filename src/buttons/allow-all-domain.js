const { Guild } = require('../../src/database/models')

module.exports = async ({ interaction, customId }) => {
    const  domain = `*.${customId.domain}`
    const guildData = await Guild.findOne({ id: interaction.guildid })
    if (!guildData) return interaction.editReply({ content: 'This server is not registered in the database. use the /setup command to get started', ephemeral: true})
    if (guildData.AutoMod.AllowedLinks.includes(domain)) return interaction.editReply({ content: 'This domain is already allowed', ephemeral: true})
        guildData.AutoMod.AllowedLinks.push(domain)
    await guildData.save()
    return interaction.editReply({ content: `The domain: ${domain} has been added to the allowed list`, ephemeral: true})
    
}