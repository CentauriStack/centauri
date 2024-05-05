const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, messageLink  } = require('discord.js');
const { Guild } = require('../database/models');

function GetbaseDomain(domain) {
    return domain.split('.').slice(-2).join('.');
    // 
    
}

function FindUrls(content) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex) || []; 
    return urls.filter(url => url.length >= 8);
}

function FindDomain(urls) {
    let domains = []
    urls.forEach(url => {
        const domain = new URL(url).hostname;
        // include the url in the domains array
        domains.push(JSON.stringify({domain: domain, url: url}));

       
    })
    return domains;
}

async function checkAllowed(domainsWURl, guildData) {
    const triggerDomains = [];
    if (!guildData || !guildData.AutoMod.AllowedLinks) {
        return false;
    }

    const allowedDomains = guildData.AutoMod.AllowedLinks;
    
   
    domainsWURl.forEach(domainsWURlunparsed => {
        let allowed = false;
       const domain = JSON.parse(domainsWURlunparsed).domain;

        for (let pattern of allowedDomains) {
            if (pattern.startsWith('*')) {
                const baseDomain = GetbaseDomain(pattern).toLowerCase();
                if (domain === baseDomain || domain.endsWith('.' + baseDomain)) {
                    allowed = true;
                    break;
                }
            } else {
                if (domain === pattern.toLowerCase()) {
                    allowed = true;
                    break;
                }
            }
        }

        if (!allowed) {
            triggerDomains.push(domainsWURlunparsed);
        }

    });

    return triggerDomains;
}

async function LinkHandler(message, content) {
    const guildData = await Guild.findOne({ GuildId: message.guildId });
    const urls = FindUrls(content);
    const domainsWURl = FindDomain(urls);
    const TriggerDomainsWUrls = await checkAllowed(domainsWURl, guildData)
    

    if (TriggerDomainsWUrls.length > 0) {
        if (!message.deletable) return; 
         message.delete();
        

// fixed everything above this line


        const TriggerDomains = TriggerDomainsWUrls.map(domain => JSON.parse(domain).domain);

        const AutomodLinkEmbed = new EmbedBuilder()
            .setTitle('AutoMod Alert')
            .setDescription(`${message.author}, the following domains are not allowed in this server: ${TriggerDomains.join(', ')}`)
            .setColor(client.Config.Colors.AutoModAlert)
            .setFooter({ text: 'This message will be deleted in 30 seconds, a message was sent to the moderation team.'})

        try {
            message.channel.send({ embeds: [AutomodLinkEmbed] }).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 30000) 
            });
        } catch (error) {
            console.log(error);
        }

        if (!guildData || !guildData.AutoMod.AlertsChannel) {
            return
        }

        const channel = message.guild.channels.cache.get(guildData.AutoMod.AlertsChannel);
        if (!channel) return;


        TriggerDomainsWUrls.forEach(domainwurl => {     
            const domain = JSON.parse(domainwurl).domain
            const url = JSON.parse(domainwurl).url     
            
            console.log('here')
             
            
            const baseDomain = GetbaseDomain(domain);

            const AllowSpecificDomain = new ButtonBuilder()
                .setCustomId(JSON.stringify({ffb: 'allow-domain', domain: domain}))
                .setLabel(`Allow ${domain.length > 60 ? domain.slice(0, 60) + '...' : domain}`)
                .setStyle('Success')

            const AllowAllDomain = new ButtonBuilder()
                .setCustomId(JSON.stringify({ffb: 'allow-all-domain', domain: baseDomain}))
                .setLabel(`Allow All *.${baseDomain.length > 60 ? baseDomain.slice(0, 60) + '...' : baseDomain}`)
                .setStyle('Success')
            
            const BanUser = new ButtonBuilder()
                .setCustomId(JSON.stringify({ffb: 'ban-user', UserId: message.author.id}))
                .setLabel(`Ban User`)
                .setStyle('Danger')

            const KickUser = new ButtonBuilder()
                .setCustomId(JSON.stringify({ffb: 'kick-user', UserId: message.author.id}))
                .setLabel(`Kick User`)
                .setStyle('Danger')


            const ActionRow = new ActionRowBuilder()
                .addComponents(AllowSpecificDomain, BanUser, KickUser, AllowAllDomain)

            const ModerationAlert = new EmbedBuilder()
                .setTitle('AutoMod Alert')
                .addFields(
                    { name: `User:`, value: `${message.author}`, inline: true},
                    { name: `Channel:`, value: `${message.channel}`, inline: true,},
                    { name: `Domain:`, value: `${domain}`, inline: false},
                    { name: `Link:`, value: `${url}`, inline: false},
                    { name: `Message:`, value: `${message.content}`},
                            )
                .setColor(client.Config.Colors.AutoModAction)
                .setTimestamp()
                            console.log('here')
        channel.send({ embeds: [ModerationAlert], components: [ActionRow] })
        })
    
    }

}


function AutoModMessages(client, message) {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    const content = message.content.toLowerCase();

    LinkHandler(message, content);

}



module.exports = { AutoModMessages } 


