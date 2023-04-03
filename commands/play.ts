import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/publish.js';
import { ApplicationCommandOptionType } from 'discord.js';
import i18next from 'i18next';

export default commandModule({
	type: CommandType.Both,
	plugins: [publish()],
	description: 'The play command.',
	options: [
		{
			name: 'query',
			description: 'The search query',
			type: ApplicationCommandOptionType.String,
			required: true,
		}
	],
	alias : ['p'],
	execute: async (ctx, [args, options]) => {
		const query = args === 'text' ? options.join(' ') : options.getString('query', true) || undefined
		if (!query) {
			const msg = await ctx.reply({ content: i18next.t('play.error.noQuery').toString() })
			setTimeout(async () => { msg.delete() }, 5000)
		}
	},
});
