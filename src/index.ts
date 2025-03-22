import { Client, GatewayIntentBits } from 'discord.js';
import { makeDependencies, Sern } from '@sern/handler';
import "dotenv/config"
import { DisTube, Events } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import mongoose from 'mongoose';
import { db as distubeerror } from './schemas/distubeError.js';
import { Publisher } from '@sern/publisher';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { YouTubePlugin } from '@distube/youtube';

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
        new YouTubePlugin(),
        new YtDlpPlugin({ update: true }),
        new SoundCloudPlugin(),
        new SpotifyPlugin({
            api: {
                clientId: process.env.SPOTIFY_CLIENT as string,
                clientSecret: process.env.SPOTIFY_SECRET as string
            },
        }),
    ],
    emitAddSongWhenCreatingQueue: false,
    joinNewVoiceChannel: false,
})

await makeDependencies(({ add }) => {
    add('@sern/client', client);
    add('@sern/publisher', deps => new Publisher(deps['@sern/modules'],
        deps['@sern/emitter'],
        deps['@sern/logger']!));
    add('distube', distube);
});
Sern.init({
	defaultPrefix: 'b!',
	commands: 'dist/commands',
	events: 'dist/events'
});

distube.on(Events.ERROR, async (error, queue) => {
    if (error.name === 'CANNOT_RESOVE_SONG')
        return queue.textChannel!.send(`Cannot find the track!`)

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
    console.log(`Error with ID ${id}\n${error}`)
    if (queue.textChannel) await queue.textChannel.send('An error ocurred.\nNotified correctly! ID: ' + '`' + id + '`') && await writetoDB({error: String(error), id: id})
    await writetoDB({error: String(error), id: id})
})

// distube.on(Events ., (queue, ) => queue.textChannel!.send(`No result found for ${query}!`));

client.login();