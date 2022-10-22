import { eventModule, EventType } from "@sern/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, GuildMember, TextChannel } from "discord.js";
import { Queue, Song } from "distube";

export default eventModule({
	type: EventType.External,
	emitter: 'DisTube',
	execute: async (queue: Queue, song: Song, member: GuildMember) => {
		await (queue.textChannel as TextChannel).send({content: `[${song.name}](${song.url}) was added to the queue by ${member}`})
	}
})