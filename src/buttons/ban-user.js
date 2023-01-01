const { EmbedBuilder } = require('discord.js')
module.exports = async ({ interaction, customId }) => {

    const member = await interaction.guild.members.fetch(customId.UserId);
    if (!member) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | This user is not in the server`)], ephemeral: false})
    if (member.bannable) {
        member.ban({ reason: 'Banned by a Moderator By Button action' });
        return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} has been banned`)], ephemeral: false})
    }
    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | I cannot ban ${member}, check my permissions`)], ephemeral: false})

    
}