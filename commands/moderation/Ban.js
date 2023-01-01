const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { User, Guild } = require('../../src/database/models');


module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    permissions: PermissionsBitField.Flags.BanMembers,
    options: [
        {
            name: 'user',
            description: 'The user to ban',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for the ban',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'deletemessages',
            description: 'Delete the messages from the user up to 7 days',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        }
    ],

    async execute(interaction) {

const member = interaction.options.getUser('user');
const Reason = interaction.options.getString('reason') || 'No reason provided';
const DeleteMessages = interaction.options.getBoolean('deletemessages');

const userData = await User.findOne({ UserId: member.id, GuildId: interaction.guild.id });
const guildData = await Guild.findOne({ GuildId: interaction.guild.id });

if (!guildData) { 
    guildData = new Guild({
        GuildId: interaction.guild.id 
    });
    await guildData.save();
}


if (!member) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | This user is not in the server`)], ephemeral: false})
    if (member.bannable) {
        member.ban({ reason: Reason, deleteMessageSeconds: DeleteMessages ? 7 : 0 });
        interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} has been banned`)], ephemeral: false})
        if (guildData.AutoMod.UserBackgroundCheck) {
            if (!userData) {
                userData = new User({
                    UserId: member.id,
                    GuildId: interaction.guild.id,
                });
            }

            const bannedData = { 
                Moderator: interaction.user.id,
                Reason: Reason,
                Date: new Date(),
                MessagesDeleted: DeleteMessages,
            }
            userData.BeenBanned.push(bannedData);
            await userData.save();
            return interaction.followUp({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Default).setDescription(`✅ | The user ${member} has been added to the background check System`)], ephemeral: false})
    } 
    return
}
    return interaction.editReply({ embeds: [ new EmbedBuilder().setColor(client.Config.Colors.Error).setDescription(`❌ | I cannot ban ${member}, check my permissions`)], ephemeral: false})
    }

}