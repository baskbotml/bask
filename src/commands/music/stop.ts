import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
    type: CommandType.Slash,
    plugins: [],
    description: 'Stop the song',
    options: [],
    execute: async (ctx, args) => {
        const queue = args.deps.distube.getQueue(ctx.guild!.id)
        await queue?.stop()
        await ctx.reply({content: `The queue was stopped correctly!`, ephemeral: true})
    },
});