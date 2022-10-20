import { commandModule, CommandType, Context } from '@sern/handler';

export default commandModule({
	type: CommandType.Both,
	plugins: [],
	description: 'A ping command',
	//alias : [],
    execute: async (ctx: Context, options) => {
		await ctx.reply('Pong 🏓');
	},
});