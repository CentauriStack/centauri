const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { User, Guild } = require('../../src/database/models');

module.exports = {
    name: 'Warn',
    description: 'warn a user',
    permissions: PermissionsBitField.Flags.BanMembers,
    options: [
        {
            name: 'user',
            description: 'The user to Kick',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for the Kick',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute(interaction) {

const member = interaction.options.getUser('user');
const Reason = interaction.options.getString('reason') || 'No reason provided'

if (!member) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | This user is not in the server`)], ephemeral: false})


const userData = await User.findOne({ UserId: member.id, GuildId: interaction.guild.id });
if (!userData) {
    userData = new User({
        UserId: member.id,
        GuildId: interaction.guild.id,
    });
    await userData.save();
}

const warnData = {
    Moderator: interaction.user.id,
    Reason: Reason,
    Date: new Date(),
}
userData.Warns.push(warnData);

await userData.save();

interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} has been warned`)], ephemeral: false})

const DmMessage = member.send({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`You have been warned in ${interaction.guild.name} for ${Reason}`)]})
if (DmMessage) return interaction.followUp({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} has been notifed in there DM's `)], ephemeral: false})
return interaction.followUp({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | I was unable to notify the user in there DM's `)], ephemeral: false})
    }}