const { EmbedBuilder, MessageCollector } = require('discord.js')
const ms = require('ms')

module.exports = async ({ interaction, customId }) => {

    const member = await interaction.guild.members.fetch(customId.UserId);
    if (!member) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | This user is not in the server`)], ephemeral: false})
    if (member.manageable) {
        try{
        const TimeCollector = new MessageCollector(interaction.channel, { filter: m => m.author.id === interaction.user.id, time: 60000, max: 1 })
        interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | How long would you like to mute ${member}?`)], ephemeral: false})
            TimeCollector.on('collect', async (msg) => {
            const time = msg.content
            const timeInMS = ms(time)
            const timetomute = Math.floor((Date.now() + timeInMS)/1000)
            if (!timeInMS) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | Invalid Time Provided`)], ephemeral: false})
            member.timeout(timeInMS, 'Muted by a Moderator');
            return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} will be Unmuted <t:${timetomute}:R>`)], ephemeral: false })
        })
        } catch (e) {
            console.log(e)
        }
    }
    if (!member.manageable)  return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | I cannot mute ${member}, check my permissions`)], ephemeral: false})
    
}