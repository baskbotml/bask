import { Args, commandModule, CommandType, Context, SernOptionsData } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';
import { publish } from '../../src/plugins/publish';
import i18next from "i18next"
import { db } from '../../schema/lang'
const { getLang } = require('../../util/getLang')

export default commandModule({
	type: CommandType.Both,
	plugins: [publish()],
	description: 'play music',
	options: [
		{
			name: 'cancion',
			description: 'nombre de la cancion o url',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	//alias : [],
	execute: async (ctx: Context, [type, args]) => {
		getLang(ctx.user.id, ctx.guild.id, i18next)
		if (type === 'text') {
			await ctx.reply(`${i18next.t('pingCommand.pong')} and args are: ${args}`);
		} else {
			const query = args.getString('cancion', true)
			await ctx.reply(i18next.t('pingCommand.pong') + + query);
		}
	},
});