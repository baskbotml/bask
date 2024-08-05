import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
	type: CommandType.Both,
	plugins: [],
	description: 'A ping command',
	//alias : [],
	execute: async (ctx, args) => {
		const startFetch = performance.now()
		await args.deps.music.queue.add('ytmsearch:ilovelouiscole', ctx)
		const untilResolve = performance.now()
		await ctx.reply(`Pong 🏓 took ${untilResolve - startFetch}`);
	},
});