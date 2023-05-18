import { Client, GatewayIntentBits } from 'discord.js';
import { DefaultLogging, Dependencies, Sern, SernEmitter, single, Singleton } from '@sern/handler';
import "dotenv/config"
import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { SoundCloudPlugin } from "@distube/soundcloud";
import mongoose from 'mongoose';
import { db as distubeerror } from './schemas/distubeError.js';
import { db as songsplayed } from './schemas/songsPlayed.js';
import express from 'express'
const app = express();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent, //Make sure this is enabled for text commands!
        GatewayIntentBits.GuildVoiceStates
	],
});

app.use(express.static("public"))

app.get("/", function (req, res) {
    res.send("<p>bask is up</p>")
})

app.get("/songsplayed", async function (req, res) {
    songsplayed.countDocuments({}, function (err: Error, count: Number) {
		if (err) throw err
		res.status(200).send(count.toString())
	})
})

app.listen(process.env.PORT || 4020,
    () => console.log("The webserver is listening"));

mongoose.connect(process.env.MONGODB as string).then(() => console.log('Connected to MongoDB'))

export const distube = new DisTube(client, {
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: false,
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

interface MyDependencies extends Dependencies {
    '@sern/client': Singleton<Client>;
    '@sern/logger': Singleton<DefaultLogging>;
}
export const useContainer = Sern.makeDependencies<MyDependencies>({
    build: root => root
        .add({ '@sern/client': single(client)  }) 
        .upsert({ '@sern/logger': single(new DefaultLogging()) })
        .add({ 'distube': single(distube) })
});
Sern.init({
	defaultPrefix: 'b!',
	commands: 'dist/commands',
	events: 'dist/events',
    containerConfig: {
        get: useContainer
    }
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