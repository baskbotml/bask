import { eventModule, EventType } from "@sern/handler";
import { Queue, Song } from "distube";

export default eventModule({
	type: EventType.External,
	emitter: 'distube',
	execute (queue: Queue, song: Song) {
		
	}
})