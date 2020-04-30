const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

bot.commands = new Discord.Collection();

fs.readdirSync("./events/", (err, files) => {
    if(err) console.error(err)

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("Add to events folder...");
        return;
    }

    console.log(`Loading ${jsfiles.length} commands...`)

    jsfiles.forEach((f, i) => {
        let command = require(`./events/${f}`);
        console.log(`${i + 1}: ${f} loaded...`);
        bot.commands.set(command.name, command);
    })
});

bot.on("ready", async () => {
    bot.user.setActivity(`with ${bot.guilds.map(g => g.memberCount).reduce((a, b) => a + b)} cucks`, { type: "STREAMING"});
    console.log("logged into: " + bot.user.tag);
    console.log("https://discordapp.com/api/oauth2/authorize?client_id=679149812221870090&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2F&scope=bot")
});
    
bot.on('guildMemberAdd', async member => {
    if (member.user.bot && !config.whitelist) {
        (member.ban("Unwhitelisted Bot."));
        (console.log("Unwhitelisted Bot."));
    } 
});  

bot.on('guildBanAdd', guild => {
    guild.fetchAuditLogs({type:22}).then(audit => {
        const executor = audit.entries.first().executor;
        let member = guild.members.get(executor.id)
        if (!config.whitelist || !config.bypass || !config.owner); {
            member.ban({reason:"Unathorized member banned a user manually."})
        }
    })
    .catch((err) => {
        console.log(err);
    })
});

bot.on('channelDelete', async channel => {

    channel.guild.fetchAuditLogs({type:12}).then(audit => audit.entries.find(entry => entry.executor.id == entry.executor.id).then(entry => {  
        author = entry.executor;
        author.ban("User deleted a channel, possible wizz attempt.")
        console.log(`Channel ${channel.name} delete by ${author.tag}`);
    }).catch((err) => {
        console.log(err)
    }))
});
bot.login(config.token)
