const { User, Guild } = require('../../src/database/models');
const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
name: 'backgroundcheck',
description: 'Checks the background of a user',
options: [
    {
        name: 'user',
        description: 'Check if a particular user has been warned, kicked or banned',
        type: ApplicationCommandOptionType.User,
        required: true,
    }
    
],

async execute(interaction) {


let member = interaction.options.getUser('user');

if (!member) member = interaction.user;

if (!member.id === interaction.UserId) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | You do not have permission to check other users background`)], ephemeral: false})
}





let userData = await User.findOne({ UserId: member.id, GuildId: interaction.guild.id });
if (!userData) {
    userData = new User({
        UserId: member.id,
        GuildId: interaction.guild.id,
    });
    await userData.save();
    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | This ${member} has no background data`)], ephemeral: false})
}
if (userData.Warns.length === 0 && userData.BeenKicked.length === 0 && userData.BeenBanned.length === 0) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | This ${member} has a clean background`)], ephemeral: false})

const backgroundEmbed = new EmbedBuilder()
.setColor(client.Config.Colors.Default)
.setTitle(`Background Check for ${member}`)
.setFooter(`Requested by ${interaction.user.tag}`)
.setTimestamp()

// display the warns with the reson 
if (userData.Warns.length > 0) {
    backgroundEmbed.addField(`Warns`, userData.Warns.map((warn, index) => `${index + 1}. ${warn.Reason}`).join('\n'))
} else {
    backgroundEmbed.addField(`Warns`, `This user has no warns`)
}
// display the kicks with the reson
if (userData.BeenKicked.length > 0) {
    backgroundEmbed.addField(`Kicks`, userData.BeenKicked.map((kick, index) => `${index + 1}. ${kick.Reason}`).join('\n'))
} else {
    backgroundEmbed.addField(`Kicks`, `This user has no kicks`)
}
if (userData.BeenBanned.length > 0) {
    backgroundEmbed.addField(`Bans`, userData.BeenBanned.map((ban, index) => `${index + 1}. ${ban.Reason}`).join('\n'))
} else {
    backgroundEmbed.addField(`Bans`, `This user has no bans`)
}

interaction.editReply({ embeds: [backgroundEmbed], ephemeral: false})




}
}
