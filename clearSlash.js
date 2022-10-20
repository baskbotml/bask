const { Client, GatewayIntentBits, REST, Routes } = require("discord.js")
require("dotenv").config()

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands('918823941273968640'), { body: [] })
.then(() => console.log('Successfully deleted all application commands.'))
.catch(console.error);

client.on('ready', () => {console.log("ready");})

client.login(process.env.TOKEN)