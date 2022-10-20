import { Client, GatewayIntentBits } from 'discord.js';
import { Sern, SernEmitter } from '@sern/handler';
import "dotenv/config"
import DisTube from "distube";
import SpotifyPlugin from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import SoundCloudPlugin from "@distube/soundcloud";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent, //Make sure this is enabled for text commands!
	],
});

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
    emptyCooldown: 60
})

Sern.addExternal(distube)

Sern.init({
	client,
	defaultPrefix: process.env.PREFIX,
	commands: './commands',
	events: './events',
    sernEmitter: new SernEmitter()
});

client.login();