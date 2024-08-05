import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
    type: CommandType.Both,
    plugins: [],
    description: 'Skip the current track',
    options: [],
    execute: async (ctx, args) => {
        await args.deps.music.queue.skip(ctx);
        await ctx.reply('Skipped the current track');
    },
});