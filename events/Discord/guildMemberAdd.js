const { EmbedBuilder } = require('discord.js');
const { Guild } = require('../../src/database/models')
module.exports = async (client, member) => {
    const guildData = await Guild.findOne({ GuildId: member.guild.id })
    if (!guildData) return;
    const channel = await member.guild.channels.cache.get(guildData.Welcome.channelId);
    const MessageTitle = await guildData.Welcome.WelcomeMessageTitle;
    const MessageDescription = await guildData.Welcome.WelcomeMessageDescription;

    if (!channel) return;
   
    const MessageDescriptionReplaced = MessageDescription.replace(/{user}/g, member).replace(/{server}/g, member.guild.name).replace(/{membercount}/g, member.guild.memberCount).replace(/{username}/g, member.displayName)
    const MessageTitleReplaced = MessageTitle.replace(/{user}/g, member).replace(/{server}/g, member.guild.name).replace(/{membercount}/g, member.guild.memberCount).replace(/{username}/g, member.displayName)
    
    // what gets replaced:
    // {user} - the member that joined
    // {server} - the server name
    // {membercount} - the total member count
    // {username} - the username of the member that joined
    //

    const WelcomeEmbed  = new EmbedBuilder()
        .setColor(client.Config.Colors.WelcomeMessage)
        .setTitle(MessageTitle=== null ? `Welcome to ${member.guild.name}!` : MessageTitleReplaced)
        .setDescription(MessageDescription === null ? `${member}, Please Read the Rules` : MessageDescriptionReplaced)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

    channel.send({ embeds: [WelcomeEmbed] });


}
