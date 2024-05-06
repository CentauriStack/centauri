const { Guild } = require('../../src/database/models')
const { EmbedBuilder } = require('discord.js')

module.exports = async ({ interaction, customId }) => {
    const  domain = `*.${customId.domain}`
    const guildData = await Guild.findOne({ id: interaction.guildid })
    if (!guildData) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | No guild data found, please use the /Config Command to gvet started!`)], ephemeral: true,})
    if (guildData.AutoMod.AllowedLinks.includes(domain)) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The domain: ${domain} is already in the allowed list`)], ephemeral: true, })
    guildData.AutoMod.AllowedLinks.push(domain)
    await guildData.save()
    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The domain: ${domain} has been added to the allowed list`)], ephemeral: false, })
    
}