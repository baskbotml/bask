import { Client, GatewayIntentBits } from 'discord.js';
import { Sern, SernEmitter } from '@sern/handler';
import "dotenv/config"
import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { SoundCloudPlugin } from "@distube/soundcloud";
import mongoose from 'mongoose';
import { db as distubeerror } from './schemas/distubeError.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent, //Make sure this is enabled for text commands!
        GatewayIntentBits.GuildVoiceStates
	],
});

mongoose.connect(process.env.MONGODB as string).then(() => console.log('Connected to MongoDB'))

export const distube = new DisTube(client, {
    plugins: [
        new SpotifyPlugin({
            api: {
                clientId: process.env.SPOTIFY_CLIENT as string,
                clientSecret: process.env.SPOTIFY_SECRET as string
            }
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ],
    leaveOnEmpty: true,
    emptyCooldown: 60,
    emitAddSongWhenCreatingQueue: false,
    joinNewVoiceChannel: false
})

Sern.addExternal(distube)

Sern.init({
	client,
	defaultPrefix: process.env.PREFIX,
	commands: './commands',
	events: './events',
    sernEmitter: new SernEmitter()
});

distube.on('error', async (channel, error) => {
    function makeid(length: number) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    async function writetoDB(data: any) {
        const db = new distubeerror(data)
        return db.save()
    }
    const id = makeid(20)
    if (channel) await channel.send('An error ocurred.\nNotified correctly! ID:' + '`' + id + '`') && await writetoDB({error: String(error), id: id})
    else await writetoDB({error: String(error), id: id})
})

client.login(process.env.TOKEN);