import { commandModule, CommandType } from '@sern/handler';
import { distube } from '../../index.js';
import { publish } from '../../src/plugins/publish.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish()],
    description: 'Shuffle the queue',
    options: [],
    execute: async (ctx, options) => {
        const queue = distube.getQueue(ctx.guild.id)
        await queue?.shuffle()
        await ctx.reply({content: `The queue was shuffled correctly!`, ephemeral: true})
    },
});