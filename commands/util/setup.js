const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Guild } = require('../../src/database/models')


module.exports = {
    name: 'setup',
    description: 'Setup the bot for your server',
    Permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'alerts-channel',
            description: 'The channel to send moderation alerts to',
            type: ApplicationCommandOptionType.Channel,
            required: false,
        }, 
        {
            name: 'welcome-channel',
            description: 'The channel to send welcome messages to',
            type: ApplicationCommandOptionType.Channel,
            required: false,
        }
    ],

    async execute({ interaction }) {


        const SetAlertsChannel = await interaction.options.getChannel('alerts-channel')
        const SetWelcomeChannel = await interaction.options.getChannel('welcome-channel')

        if (!SetAlertsChannel && !SetWelcomeChannel) return interaction.editReply({ content: 'Please provide a command', ephemeral: true})

        let guildData = await Guild.findOne({ GuildId: interaction.guildid })

        if (!guildData) {
            const newGuild = new Guild({
                GuildId: interaction.guildId,
            })
            await newGuild.save()
            guildData = await Guild.findOne({ GuildId: interaction.guildId })
        }
        if (SetAlertsChannel) {
        guildData.AutoMod.AlertsChannel = SetAlertsChannel.id
        }
        if (SetWelcomeChannel) {
        guildData.Welcome.channelId = SetWelcomeChannel.id
        }
        await guildData.save()
        return interaction.editReply({ content: `Channel has been set!`, ephemeral: true})

    }}
