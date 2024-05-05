const { EmbedBuilder, InteractionType } = require('discord.js');
 

module.exports = async (client, interaction) => {
    await interaction.deferReply();
    if (interaction.type === InteractionType.ApplicationCommand) {

        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription('❌ | Error! Please contact Developers!')], ephemeral: true, }), client.slash.delete(interaction.commandName)
        if (command.permissions && !interaction.member.permissions.has(command.permissions)) return interaction.editReply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | You need do not have the proper permissions to exacute this command`)], ephemeral: true, })
        if (command) return command.execute({ interaction, client });
    }



    if (interaction.type === InteractionType.MessageComponent) {
        const customId = JSON.parse(interaction.customId)
        const file_of_button = customId.ffb
        if (file_of_button) {
            delete require.cache[require.resolve(`../../src/buttons/${file_of_button}.js`)];
            const button = require(`../../src/buttons/${file_of_button}.js`)
            if (button) return button({ client, interaction, customId });
        }
    }
} 