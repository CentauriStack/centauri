const { EmbedBuilder } = require('discord.js');
const { Guild } = require('../../src/database/models')
module.exports = async (client, member) => {
    const guildData = await Guild.findOne({ GuildId: member.guild.id })
    const channel = await member.guild.channels.cache.get(guildData.Welcome.channelId);
    const message = await guildData.Welcome.message;
    if (!channel) return;
   

    const WelcomeEmbed  = new EmbedBuilder()
        .setColor(client.Config.Colors.WelcomeMessage)
        .setTitle(`Welcome ${member.displayName} to ${member.guild.name}!`)
        .setDescription(message === null ? `Welcome to the server!` : message)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

    channel.send({ embeds: [WelcomeEmbed] });


}
