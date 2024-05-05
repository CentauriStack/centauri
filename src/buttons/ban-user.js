module.exports = async ({ interaction, customId }) => {

    const member = await interaction.guild.members.fetch(customId.UserId);
    if (!member) return interaction.editReply({ content: 'This user is not in the server', ephemeral: false})
    if (member.bannable) {
        member.ban({ reason: 'Banned by a Moderator' });
        return interaction.editReply({ content: `The user ${member.user.tag} has been banned`, ephemeral: false})
    }
    return interaction.editReply({ content: `I cannot ban ${member.displayName}, check my permissions`, ephemeral: false})

    
}