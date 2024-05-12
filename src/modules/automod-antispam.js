const { Guild } = require('../../src/database/models');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder  } = require('discord.js');

const guildUserMaps = new Map();

async function antiSpam(client, message) {
    try {
        if (message.author.bot) return;
        const guildData = await Guild.findOne({ GuildId: message.guildId });
        if (!guildData) return;

        const guildId = message.guildId;
        const antiSpamRate = parseInt(await guildData.AutoMod.AntiSpamRate) * 1000; // Convert seconds to milliseconds
        const antiSpamLimit = parseInt(await guildData.AutoMod.AntiSpamLimit); // Amount of messages sent in the time period

        if (!antiSpamLimit && !antiSpamRate ) return 

        if (!guildUserMaps.has(guildId)) {
            guildUserMaps.set(guildId, new Map());
        }

        const userMap = guildUserMaps.get(guildId);

        if (userMap.has(message.author.id)) {

            const userData = userMap.get(message.author.id);
            const { lastMessage, timer } = userData;

            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;

            if (difference > antiSpamRate) {
                clearTimeout(timer);

                userData.msgCount = 1;
                userData.lastMessage = message;

                userData.timer = setTimeout(() => {
                    userMap.delete(message.author.id);
                }, antiSpamRate * 2);

                userMap.set(message.author.id, userData);

            } else {
                ++msgCount;

                if (parseInt(msgCount) >= antiSpamLimit) {
                    const channel = message.guild.channels.cache.get(guildData.AutoMod.AlertsChannelId);
                    if (!channel) return;
                    if (message.member.manageable) {
                        
                        message.member.timeout(1728000000, 'User was suspected of spamming by Auto Mod')

                        const ModerationAlert = new EmbedBuilder()
                            .setTitle('AutoMod Alert')
                            .addFields(
                                { name: `User:`, value: `${message.author}`, inline: true},
                                { name: `Channel:`, value: `${message.channel}`, inline: true},
                                { name: `Muted for:`, value: `<t:${Math.floor(Date.now()/1000)}:R>`, inline: true},
                            )
                            .setDescription(`User sent ${antiSpamLimit} in ${antiSpamRate / 1000} seconds \n please select an action`)
                            .setColor(client.Config.Colors.AutoModAction)
                            .setTimestamp()

                        const BanUser = new ButtonBuilder()
                            .setCustomId(JSON.stringify({ffb: 'ban-user', UserId: message.author.id}))
                            .setLabel(`Ban User`)
                            .setStyle('Danger')

                        const KickUser = new ButtonBuilder()
                            .setCustomId(JSON.stringify({ffb: 'kick-user', UserId: message.author.id}))
                            .setLabel(`Kick User`)
                            .setStyle('Danger')

                        const MuteUser = new ButtonBuilder()
                            .setCustomId(JSON.stringify({ffb: 'mute-user', UserId: message.author.id}))
                            .setLabel(`Mute User`)
                            .setStyle('Primary')

                        const UnmuteUser = new ButtonBuilder()
                            .setCustomId(JSON.stringify({ffb: 'unmute-user', UserId: message.author.id}))
                            .setLabel(`Unmute User`)
                            .setStyle('Primary') 

                        const ActionRow = new ActionRowBuilder().addComponents(BanUser, KickUser, MuteUser, UnmuteUser)

                        channel.send({ embeds: [ModerationAlert], components: [ActionRow] })
                    }
                   
                } else {
                    userData.msgCount = msgCount;
                    userMap.set(message.author.id, userData);
                }
            }
        } else {

            const fn = setTimeout(() => {
                userMap.delete(message.author.id);
            }, antiSpamRate * 2);

            userMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
            });
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = { antiSpam };
