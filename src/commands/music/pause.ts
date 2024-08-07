import { commandModule, CommandType } from '@sern/handler';
import { distube } from '../../index.js';
import { publish } from '../../plugins/publish.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [],
    description: 'Pause the song',
    options: [],
    execute: async (ctx, options) => {
        const queue = distube.getQueue(ctx.guild!.id)
        queue?.pause()
        await ctx.reply({content: `The queue was paused correctly!`, ephemeral: true})
    },
});