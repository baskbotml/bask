import { eventModule, EventType } from "@sern/handler";
import { ComponentType, GuildMember, TextChannel } from "discord.js";
import { Queue, Song } from "distube";

export default eventModule({
	type: EventType.External,
	emitter: 'distube',
	execute: async (queue: Queue, song: Song, member: GuildMember) => {
		const message = await (queue.textChannel as TextChannel).send({content: `[${song.name}](${song.url}) was added to the queue by ${member}`})
		const collector = message.createMessageComponentCollector({time: 120_000, componentType: ComponentType.Button})
		collector.on('collect', async (i) => {
			
		})
	}
})