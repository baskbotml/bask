import { commandModule, CommandType } from '@sern/handler';
import { distube } from '../../index.js';
import { publish } from '../../src/plugins/publish.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish()],
    description: 'Resume the song',
    options: [],
    execute: async (ctx, options) => {
        const queue = distube.getQueue(ctx.guild.id)
        queue?.resume()
        await ctx.reply({content: `The queue was resumed correctly!`, ephemeral: true})
    },
});