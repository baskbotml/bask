import { Args, commandModule, CommandType, Context, SernOptionsData } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';
import { publish } from '../../src/plugins/publish';
import i18next from "i18next"

export default commandModule({
	type: CommandType.Both,
	plugins: [publish()],
	description: 'play music',
	options: [
		{
			name: 'cancion',
			description: 'nombre de la cancion o url',
			type: ApplicationCommandOptionType.String
		}
	],
	//alias : [],
	execute: async (ctx: Context, [type, args]) => {
		let query;
		const ifSlashOrText = type as string
		if (ifSlashOrText === 'text') {
			console.log('text')
			await ctx.reply(i18next.t('pingCommand.pong'));
		} else if (ifSlashOrText === 'slash') {
			query = args[1].getString('cancion', true) as string
			console.log('slash')
			await ctx.reply(i18next.t('pingCommand.pong') + query);
		}
	},
});