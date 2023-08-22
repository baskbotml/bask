import { commandModule, CommandType } from '@sern/handler';
import { distube } from '../../index.js';
import { publish } from '../../plugins/publish.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish()],
    description: 'Skip the song',
    options: [],
    execute: async (ctx, options) => {
        const queue = distube.getQueue(ctx.guild!.id)!
        if (queue.songs.length > 1) {
            await queue.skip();
        } else {
            await queue.stop();
        }
        await ctx.reply({content: `The queue was skipped correctly!`, ephemeral: true})
    },
});