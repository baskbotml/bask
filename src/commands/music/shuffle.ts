import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
    type: CommandType.Slash,
    plugins: [],
    description: 'Shuffle the queue',
    options: [],
    execute: async (ctx, args) => {
        const queue = args.deps.distube.getQueue(ctx.guild!.id)
        await queue?.shuffle()
        await ctx.reply({content: `The queue was shuffled correctly!`, ephemeral: true})
    },
});