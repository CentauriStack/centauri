const jaro = require('jaro-winkler');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField  } = require('discord.js');
 const { Guild, User } = require('../../src/database/models');



async function wordprotection(message,) {

    const text = message.content;

    const guildData = await Guild.findOne({ GuildId: message.guildId });

    if (!guildData) { 
    guildData = new Guild({
        GuildId: interaction.guild.id 
    });
    return guildData.save();
    }
    if (guildData.AutoMod.Words.Blacklist.length === 0) return






            const banned_words_similarity = data.badwords.map(word => word = { 'dist': jaro(text, word), 'word': word })
                .filter(data => data.dist >= guildData.AutoMod.Words.Sensitivity);

            const whitelist_words = data.goodwords.map(whiteword => whiteword = { 'dist': jaro(text, whiteword), 'word': whiteword })
                .filter(data => data.dist >= guildData.AutoMod.Words.Sensitivity);

            let greatest = {
                white: { 'dist': 0, word: null },
                black: { 'dist': 0, word: null }
            };

            for (let data of whitelist_words) {
                if (data.dist > greatest.white.dist)
                    greatest.white = data;
            };

            for (let data of banned_words_similarity) {
                if (data.dist > greatest.black.dist)
                    greatest.black = data;
            };
            let res = null;

            if (greatest.black.word) {
                res = text.split(' ').find(v => jaro(v, greatest.black.word));
            }
            const AlertsChannel = message.guild.channels.fetch(guildData.AutoMod.AlertsChannelId)

            if (greatest.black.dist > greatest.white.dist) {

                if (greatest.black.dist !== 1) {
                        const AutoModEmbed = new EmbedBuilder()
                            .setColor('RED') // change color 
                            .setTitle('is this a bad word?')
                            .setDescription(`is ${res} a bad word ? i think it sounds like ${greatest.black.word} `);


                        const blackword = new ButtonBuilder()
                            .setLabel('Yes')
                            .setCustomId(JSON.stringify({ffb: 'blacklist', word: res }))
                            .setStyle('SUCCESS');



                        const whiteword = new ButtonBuilder()
                            .setLabel('No')
                            .setCustomId(JSON.stringify({ffb: 'whitelist', word: res }))
                            .setStyle('DANGER');

                        const row = new ActionRowBuilder()
                            .addComponents(blackword, whiteword);

                        if (!AlertsChannel) return;
                        AlertsChannel.send({ embeds: [AutoModEmbed], components: [row] });
                    }
                }
                if (greatest.black.dist === 1) {
                     message.delete();
                    message.reply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | You cannot use that word!`)]});

                    const UserData = await User.findOne({ UserId: message.author.id, GuildId: message.guildId });

                    if (!UserData) {
                        UserData = new User({
                            UserId: message.author.id,
                            GuildId: message.guildId,
                        });
                       await UserData.save();
                    }

                    const AutoModEmbed = new EmbedBuilder()
                        .setColor('RED')
                        .setTitle('AutoMod Alert')
                        .setDescription(`User ${message.author} used a bad word in ${message.channel}`)
                        .addField('Message', message.content)
                        .addField('Word', res)
                        .addField('previous offenses', UserData.BadWordsaid.length)
                        .setTimestamp();


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
/*
                    const UnmuteUser = new ButtonBuilder()
                        .setCustomId(JSON.stringify({ffb: 'unmute-user', UserId: message.author.id}))
                        .setLabel(`Unmute User`)
                        .setStyle('Primary') 
*/
                    const WarnUser = new ButtonBuilder()
                        .setCustomId(JSON.stringify({ffb: 'warn-user', UserId: message.author.id}))
                        .setLabel(`Warn User`)
                        .setStyle('Primary')

                    const ActionRow = new ActionRowBuilder().addComponents(BanUser, KickUser, MuteUser, /*UnmuteUser,*/ WarnUser)
                    
                    AlertsChannel.send({ embeds: [AutoModEmbed], components: [ActionRow] });


                }
            

        
        
    








}
module.exports = { wordprotection }