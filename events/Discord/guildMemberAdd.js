const { EmbedBuilder } = require('discord.js');
const { Guild } = require('../../src/database/models')
module.exports = async (client, member) => {
    const guildData = await Guild.findOne({ GuildId: member.guild.id })
    const channel = await member.guild.channels.cache.get(guildData.Welcome.channelId);
    if (!channel) return;
   

    const WelcomeEmbed  = new EmbedBuilder()
        .setColor(client.Config.Colors.WelcomeMessage)
        .setTitle(`Welcome ${member.displayName} to ${member.guild.name}!`)
        .setDescription(`Don't forget to read the <#${member.guild.rulesChannelId || 'Error'}> channel! This is a community server focused on development. Need help with a project? Ask the community, don't worry we don't bite.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

    channel.send({ embeds: [WelcomeEmbed] });


}
