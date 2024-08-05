import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
    type: CommandType.Both,
    plugins: [],
    description: 'get queue command',
    options: [],
    execute: async (ctx, args) => {
        ctx.reply(JSON.stringify(args.deps.music.queue.getQueue(ctx.guildId!)));
    },
});