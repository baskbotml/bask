import { Client, GatewayIntentBits } from 'discord.js';
import {
	Dependencies,
	Sern,
	single,
	Singleton,
	DefaultLogging,
} from '@sern/handler';
import 'dotenv/config';
import { Kazagumo } from 'kazagumo';
import { Connectors, NodeOption } from 'shoukaku';
import i18n from 'i18next'
import FsBackend, { FsBackendOptions } from 'i18next-fs-backend'
import { lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { __dirname } from './util/underscores.js';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

interface MyDependencies extends Dependencies {
	'@sern/client': Singleton<Client>;
	'@sern/logger': Singleton<DefaultLogging>;
}

export const useContainer = Sern.makeDependencies<MyDependencies>({
	build: (root) =>
		root
			.add({ '@sern/client': single(() => client) })
			.upsert({ '@sern/logger': single(() => new DefaultLogging()) }), //using upsert because it replaces the default provided
});

Sern.init({
	defaultPrefix: 'b!',
	commands: 'dist/commands',
	containerConfig: {
		get: useContainer,
	},
});

const Nodes = [{
	name: 'server1',
	url: `${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}`,
	auth: process.env.LAVALINK_PASSWORD,
	secure: false
}] as NodeOption[]

export const kazagumo = new Kazagumo(
	{
		defaultSearchEngine: "youtube",
		send: (guildId, payload) => {
			const guild = client.guilds.cache.get(guildId);
			if (guild) guild.shard.send(payload);
		},
	},
	new Connectors.DiscordJS(client),
	Nodes
);

i18n.use(FsBackend)
i18n.init<FsBackendOptions>({
	initImmediate: false,
	fallbackLng: 'en',
	lng: 'en',
	preload: readdirSync(join(__dirname, '../locales')).filter((fileName) => {
		const joinedPath = join(join(__dirname, '../locales'), fileName)
		const isDirectory = lstatSync(joinedPath).isDirectory()
		return isDirectory
	}),
	backend: {
		loadPath: 'locales/{{lng}}.json'
	}
})

client.login(process.env.TOKEN);
