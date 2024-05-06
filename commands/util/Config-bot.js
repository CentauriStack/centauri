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
                    name: 'welcome-message',
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
                GuildData.AutoMod.AlertsChannel = channel.id
                await GuildData.save()
                return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | AutoMod alerts channel set to <#${channel.id}>`)], ephemeral: true, })
                } else {
                    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | No Input, please select an Input!`)], ephemeral: true, })
                } 
            }
            case 'welcome-module': {
                const channel = interaction.options.getChannel('welcome-channel')
                const message = interaction.options.getString('welcome-message')
                if (channel) {
                if (channel.type !== 'GUILD_TEXT') return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The channel must be a text channel`)], ephemeral: true, })
                GuildData.Welcome.channelId = channel.id
                await GuildData.save()
                return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | Welcome channel set to <#${channel.id}>`)], ephemeral: true, })
                }
                if (message) {
                    if (message.length > 1024) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | The message is too long, please keep it under 1024 characters`)], ephemeral: true, })
                    GuildData.Welcome.WelcomeMessage = message
                    await GuildData.save()
                    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | Welcome message set to ${message}`)], ephemeral: true, })
                }
                else {
                    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | No Input, please select an Input!`)], ephemeral: true, })
                }
            }



        } 
    }}
