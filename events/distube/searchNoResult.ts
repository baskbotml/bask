import { eventModule, EventType } from "@sern/handler";
import { GuildMember, GuildTextBasedChannel, TextChannel } from "discord.js";
import { Queue, Song } from "distube";

export default eventModule({
	type: EventType.External,
	emitter: 'DisTube',
	execute: async (channel: GuildTextBasedChannel, error: Error) => {
		await channel.send({content: 'The search query could not be found'})
	}
})