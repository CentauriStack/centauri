const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { User, Guild } = require('../../src/database/models');

module.exports = {
    name: 'Kick',
    description: 'Kick a user from the server',
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

const userData = await User.findOne({ UserId: member.id, GuildId: interaction.guild.id });
const guildData = await Guild.findOne({ GuildId: interaction.guild.id });

if (!guildData) { 
    guildData = new Guild({
        GuildId: interaction.guild.id 
    });
    await guildData.save();
}

if (!member) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | This user is not in the server`)], ephemeral: false})
    if (member.kickable) {
        member.kick({ reason: Reason });
        interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} has been Kicked`)], ephemeral: false})
       
        if (guildData.AutoMod.UserBackgroundCheck) {
            if (!userData) {
                userData = new User({
                    UserId: member.id,
                    GuildId: interaction.guild.id,
                });
            }

            const kickedData = { 
                Moderator: interaction.user.id,
                Reason: Reason,
                Date: new Date(),
            }
            userData.BeenKicked.push(kickedData);
            await userData.save();
            return interaction.followUp({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} has been added to the background check System`)], ephemeral: false})
    } 
    return
    }
    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | I cannot Kick ${member}, check my permissions`)], ephemeral: false})
    }

}