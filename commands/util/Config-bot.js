const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Guild } = require('../../src/database/models')


module.exports = {
    name: 'config',
    description: 'Config the bot for your server',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'automod-module',
            description: 'Setup the Auto Moderation Module',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'automod-alerts-channel',
                    description: 'The channel to send Auto moderation alerts to',
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                } 
            ]
        }, 
        {
            name: 'welcome-module',
            description: 'Setup the welcome Module',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'welcome-channel',
                    description: 'The channel to send welcome messages to',
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                },
                {
                    name: 'welcome-message-title',
                    description: 'The message to send to new members',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'welcome-message-description',
                    description: 'The message to send to new members',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                }

            ]
        }
    
       
    ],
    async execute({ interaction }) {

        const GuildData = await Guild.findOne({ GuildId: interaction.guildId })
        if (!GuildData) { 
            const newGuild = new Guild({
                GuildId: interaction.guildId,
            })
            await newGuild.save()
            GuildData = newGuild
        }
        switch(interaction.options.getSubcommand()) {

            case 'automod-module': {
                const channel = interaction.options.getChannel('automod-alerts-channel')
                if (channel) {
                if (channel.type !== 'GUILD_TEXT') return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The channel must be a text channel`)], ephemeral: true, })
                GuildData.AutoMod.AlertsChannelId = channel.id
                await GuildData.save()
                return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | AutoMod alerts channel set to <#${channel.id}>`)], ephemeral: true, })
                } else {
                    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | No Input, please select an Input!`)], ephemeral: true, })
                } 
            }
            case 'welcome-module': {
                const channel = interaction.options.getChannel('welcome-channel')
                const TitleMessage = interaction.options.getString('welcome-message-title')
                const DescriptionMessage = interaction.options.getString('welcome-message-description')

                if (channel) {
                if (channel.type !== 'GUILD_TEXT') return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The channel must be a text channel`)], ephemeral: true, })
                GuildData.Welcome.channelId = channel.id
                await GuildData.save()
                 interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | Welcome channel set to <#${channel.id}>`)], ephemeral: true, })
                }
                if (TitleMessage) {
                    if (TitleMessage.length > 156) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The message must be less than 156 characters`)], ephemeral: true, })
                    GuildData.Welcome.WelcomeMessageTitle = TitleMessage
                    await GuildData.save()
                     interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | Welcome Message Title set to ${TitleMessage}`)], ephemeral: true, })
                }
                if (DescriptionMessage) {
                    if (DescriptionMessage.length > 1048) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The message must be less than 1048 characters`)], ephemeral: true, })
                    GuildData.Welcome.WelcomeMessageDescription = DescriptionMessage
                    await GuildData.save()
                    interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | Welcome Message Description set to ${DescriptionMessage}`)], ephemeral: true, })
                }
                if (channel || TitleMessage || DescriptionMessage) return
                else {
                    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | No Input, please select an Input!`)], ephemeral: true, })
                }
            }



        } 
    }}
