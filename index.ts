const { Client, GatewayIntentBits } = require("discord.js");
const {Manager} = require("erela.js");
require("dotenv").config();
const { Sern } = require('@sern/handler');
const prefix = process.env.PREFIX
const client = new Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})

/* export const distube = new DisTube(client, {
	searchSongs: 2,
	searchCooldown: 30,
	leaveOnEmpty: true,
	emptyCooldown: 25,
	leaveOnFinish: true, // true on the tutorial, false on the copypaste
	nsfw: false,
    emitNewSongOnly: true, // true on the tutorial
    emitAddListWhenCreatingQueue: true,
    emitAddSongWhenCreatingQueue: false,
    youtubeDL: false,
    updateYouTubeDL: false,
	plugins: [
        new SpotifyPlugin({ 
            parallel: true, 
            emitEventsAfterFetching: true,
            api: { clientId: process.env.SPOTIFY_CLIENTID, clientSecret: process.env.SPOTIFY_CLIENTSECRET }
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ],
    youtubeCookie: process.env.YT_COOKIE,
    ytdlOptions: {
        highWaterMark: 1024 * 1024 * 64,
        quality: "highestaudio",
        format: "audioonly",
        liveBuffer: 60000,
        dlChunkSize: 1024 * 1024 * 4,
    }
})*/

Sern.init({client,prefix,commands : './commands', events: './events'});

const nodes = [
    {
        host: 'lava.link',
        password: 'boobas',
        port: 80,
    }
];

// console.log if the node was connected
client.manager = new Manager({nodes, send: (id: any, payload: any) => {const guild = client.guilds.cache.get(id); if(guild) guild.shard.send(payload);}})
client.manager.on("nodeConnect", node => {
    console.log(`Node "${node.options.identifier}" connected.`)
})

// console.log if there was an error
client.manager.on("nodeError", (node, error) => {
    console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
})

client.on("raw", d => client.manager.updateVoiceState(d));

client.on('ready', () => {client.manager.init(client.user.id); console.log('Ready!');})

client.login(process.env.TOKEN)