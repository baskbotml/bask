import { commandModule, CommandType } from '@sern/handler';
import i18next from 'i18next';
import { publish } from '../../src/plugins/publish';
import db from '../../schema/lang'

export default commandModule({
	name: 'lang',
	type: CommandType.Both,
	plugins: [publish()],
	description: 'A ping command',
	//alias : [],
	execute: async (ctx, [type, args]) => {
		async function writeLang(lang) {
			const dbsave = new db.save(lang)
			return dbsave.save()
		}
		if (type === 'text') {
			switch(args[0]) {
				case 'es': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'es'	
					  })
					.then(async doc => {await ctx.reply(`idioma cambiado a español`)})
					.catch(async error => {await ctx.reply(`error al cambiar el idioma :(`)});
				} break;
				case 'en': {

				} break;
			  }
		} else {
			
		}
	},
});