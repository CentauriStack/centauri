const { EmbedBuilder } = require('discord.js')

module.exports = async ({ interaction, customId }) => {

    const member = await interaction.guild.members.fetch(customId.UserId);
    if (!member) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | This user is not in the server`)], ephemeral: false})
    if (member.manageable) {
        member.timeout(null, 'Unmuted by a Moderator');
        return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} has been Unmuted`)], ephemeral: false })
    }
    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | I cannot mute ${member}, check my permissions`)], ephemeral: false})

    
}