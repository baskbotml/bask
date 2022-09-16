const { commandModule, CommandType, Context } = require('@sern/handler');
import { ApplicationCommandOptionType } from 'discord.js';
import i18next from 'i18next';
import { publish } from '../../src/plugins/publish';
import { db } from '../../schema/lang'

export default commandModule({
	name: 'lang',
	type: CommandType.Both,
	plugins: [publish()],
	description: 'Set the language of the bot.',
	options: [
		{
			name: 'code',
			description: '2 letter code of the language.',
			type: ApplicationCommandOptionType.String,
			required: true,
			command: {
				onEvent: [],
				async execute(ctx){
					const focusedValue = ctx.options.getFocused();
					const choices = ['es', 'en', 'fr', 'de'];
					const filtered = choices.filter(choice => choice.startsWith(focusedValue));
					await ctx.respond(
						filtered.map(choice => ({ name: choice, value: choice })),
					);
				}
			}
		}
	],
	//alias : [],
	execute: async (ctx, [type, args]) => {
		async function writeLang(language) {
			db.countDocuments({ guildid: ctx.guild.id, userid: ctx.user.id }, async function (err, count) {
				if(count>0){
					const toDelete = await db.findOne({ guildid: ctx.guild.id, userid: ctx.user.id })
					await toDelete.remove()
					// after removed, write it again
					const dbsave = new db(language)
					return dbsave.save()
				} else {
					const dbsave = new db(language)
					return dbsave.save()
				}
			})
			
		}

		if (type === 'text') {
			switch(args[0]) {
				case 'es': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'es'
					  })
					.then(async doc => {await ctx.reply({content: `idioma cambiado a español`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				case 'en': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'en'
					  })
					.then(async doc => {await ctx.reply({content: `changed language to english`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				case 'fr': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'fr'
					  })
					.then(async doc => {await ctx.reply({content: `langue changée en français !`, ephemeral: true})})
					.catch(async error => {await ctx.reply(`error al cambiar el idioma :(`); console.log(error)});
				} break;
				case 'de': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'de'
					  })
					.then(async doc => {await ctx.reply({content: `language changed to de`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				default: {
					await ctx.reply({content: 'you need to put `es`, `en`, `fr` or `de` as an argument.', ephemeral: true})
				} break;
			  }
		} else {
			const option = args.getString('code', true);
			switch(option) {
				case 'es': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'es'
					  })
					.then(async doc => {await ctx.reply({content: `idioma cambiado a español`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				case 'en': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'en'
					  })
					.then(async doc => {await ctx.reply({content: `changed language to english`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				case 'fr': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'fr'
					  })
					.then(async doc => {await ctx.reply({content: `langue changée en français !`, ephemeral: true})})
					.catch(async error => {await ctx.reply(`error al cambiar el idioma :(`); console.log(error)});
				} break;
				case 'de': {
					writeLang({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'de'
					  })
					.then(async doc => {await ctx.reply({content: `language changed to de`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				default: {
					await ctx.reply({content: 'you need to put `es`, `en`, `fr` or `de` as an argument.', ephemeral: true})
				} break;
			  }
		}
	},
});