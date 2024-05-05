const { readdirSync } = require('fs');
const { Collection } = require('discord.js')
client.commands = new Collection();
CommandsArray = [];

const DiscordEvents = readdirSync('./events/Discord/').filter(file => file.endsWith('.js'));

for (const file of DiscordEvents) {
   const DiscordEvent = require(`../events/Discord/${file}`);
   console.log(`[Discord Event Loaded] ${file.split('.')[0]}`);
   client.on(file.split('.')[0], DiscordEvent.bind(null, client));
   delete require.cache[require.resolve(`../events/Discord/${file}`)];
}

readdirSync('./commands/').forEach(dir => {
    const commands = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));

    for (const file of commands) {
        const command = require(`../commands/${dir}/${file}`);
        if (command.name && command.description) {
           CommandsArray.push(command);
           console.log(`[Command Loaded] ${command.name}`);
           client.commands.set(command.name.toLowerCase(), command);
           delete require.cache[require.resolve(`../commands/${dir}/${file}`)];
        } else { 
            console.log(`[Command Error] ${command.name.toLowerCase()}`)
        }
    }
    })

    client.on('ready', (client) => {
        
        if (client.Config.Bot.Global) client.application.commands.set(CommandsArray)
        else client.guilds.cache.get(client.Config.Bot.Guild).commands.set(CommandsArray)
        
        console.log('[Bot] Ready')
    })
    
