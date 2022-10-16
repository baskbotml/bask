const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const { Sern } = require("@sern/handler");
const prefix = process.env.PREFIX;
import SoundCloudPlugin from "@distube/soundcloud";
import SpotifyPlugin from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { SernEmitter } from "@sern/handler";
import DisTube from "distube";
import i18next from "i18next";
const mongoose = require("mongoose");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

Sern.init({
	client,
	defaultPrefix: `${prefix}`,
	commands: "./commands",
	events: "./events",
	sernEmitter: new SernEmitter(),
});

mongoose.connect(process.env.MONGODB);

i18next.init({
	resources: {
		en: { translation: require("./translations/en.json") },
		es: { translation: require("./translations/es.json") },
		fr: { translation: require("./translations/fr.json") },
		de: { translation: require("./translations/de.json") },
	},
	lng: "en",
	fallbackLng: "en",
});

client.distube = new DisTube(client, {
	leaveOnStop: false,
	emitNewSongOnly: true,
	plugins: [
		new SpotifyPlugin({
			emitEventsAfterFetching: true,
			api: {
				clientId: `${process.env.SPOTIFY_CLIENT}`,
				clientSecret: `${process.env.SPOTIFY_SECRET}`,
			},
		}),
		new SoundCloudPlugin(),
		new YtDlpPlugin(),
	],
});

client.on("ready", () => {
	console.log("Ready!");
});

client.login(process.env.TOKEN);
