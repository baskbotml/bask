import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
    type: CommandType.Slash,
    plugins: [],
    description: 'Resume the song',
    options: [],
    execute: async (ctx, args) => {
        const queue = args.deps.distube.getQueue(ctx.guild!.id)
        queue?.resume()
        await ctx.reply({content: `The queue was resumed correctly!`, ephemeral: true})
    },
});