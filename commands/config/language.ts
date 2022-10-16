import { commandModule, CommandType, Context } from '@sern/handler';
import { ApplicationCommandOptionType, GuildMember, PermissionsBitField } from 'discord.js';
import i18next from 'i18next';
import { publish } from '../../src/plugins/publish';
import { db } from '../../schema/langUser'
import { db as dbGuild } from '../../schema/langGuild'

export default commandModule({
	name: 'lang',
	type: CommandType.Both,
	plugins: [publish()],
	description: 'Set the language of the bot.',
	options: [
		{
			name: 'user',
			description: 'Set the language for the user.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'code',
					description: '2 letter code of the language.',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
					command: {
						onEvent: [],
						async execute(ctx){
							const focusedValue = ctx.options.getFocused(true) as any
							const choices = ['es', 'en', 'fr', 'de'];
							const filtered = choices.filter(choice => choice.startsWith(focusedValue));
							await ctx.respond(
								filtered.map(choice => ({ name: choice, value: choice })),
							);
						}
					}
				}
			]
		},
		{
			name: 'guild',
			description: 'Set the language for the Discord server.',
			type: ApplicationCommandOptionType.Subcommand,
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
			]
		}
	],
	//alias : [],
	execute: async (ctx: Context, [type, args]) => {
		async function writeLangUser(language) {
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
		async function writeLangGuild(language) {
			dbGuild.countDocuments({ guildid: ctx.guild.id }, async function (err, count) {
				if(count>0){
					const toDelete = await db.findOne({ guildid: ctx.guild.id })
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
			const [first, second] = args
			switch(args.join(' ')) {
				case 'user es': {
					writeLangUser({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'es'
					  })
					.then(async doc => {await ctx.reply({content: `idioma cambiado a español`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				case 'user en': {
					writeLangUser({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'en'
					  })
					.then(async doc => {await ctx.reply({content: `changed language to english`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				case 'user fr': {
					writeLangUser({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'fr'
					  })
					.then(async doc => {await ctx.reply({content: `langue changée en français !`, ephemeral: true})})
					.catch(async error => {await ctx.reply(`error al cambiar el idioma :(`); console.log(error)});
				} break;
				case 'user de': {
					writeLangUser({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'de'
					  })
					.then(async doc => {await ctx.reply({content: `language changed to de`, ephemeral: true})})
					.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
				} break;
				case 'guild es': {
					if ((ctx.member as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator)) {
						writeLangUser({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'es'
						})
							.then(async doc => {await ctx.reply({content: `idioma cambiado a español`, ephemeral: true})})
							.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
					} else {
						ctx.reply({content: `you don't have permission to use this command!`, ephemeral: true})
					}
				} break;
				case 'guild en': {
					if ((ctx.member as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator)) {
						writeLangUser({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'en'
						})
							.then(async doc => {await ctx.reply({content: `language changed to english`, ephemeral: true})})
							.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
					} else {
						ctx.reply({content: `you don't have permission to use this command!`, ephemeral: true})
					}
				} break;
				case 'guild fr': {
					if ((ctx.member as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator)) {
						writeLangUser({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'fr'
						})
							.then(async doc => {await ctx.reply({content: `langue changée en français !`, ephemeral: true})})
							.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
					} else {
						ctx.reply({content: `you don't have permission to use this command!`, ephemeral: true})
					}
				} break;
				case 'guild de': {
					if ((ctx.member as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator)) {
						writeLangUser({
						guildid: ctx.guild.id,
						userid: ctx.user.id,
						language: 'de'
						})
							.then(async doc => {await ctx.reply({content: `language changed to german`, ephemeral: true})})
							.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
					} else {
						ctx.reply({content: `you don't have permission to use this command!`, ephemeral: true})
					}
				} break;
				default: {
					console.log(args)
					await ctx.reply({content: 'ERROR: You did not use the correct usage.\nUSAGE: `<prefix>lang <user or guild (last for admins)> <es, en, de, fr>`'})
				} break;
			  }
		} else {
			const subcommand = args.getSubcommand();
			const option = args.getString('code', true);
			switch (subcommand) {
				case 'user': {
					switch(option) {
						case 'es': {
							writeLangUser({
								guildid: ctx.guild.id,
								userid: ctx.user.id,
								language: 'es'
							})
							.then(async doc => {await ctx.reply({content: `idioma cambiado a español`, ephemeral: true})})
							.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
						} break;
						case 'en': {
							writeLangUser({
								guildid: ctx.guild.id,
								userid: ctx.user.id,
								language: 'en'
							})
							.then(async doc => {await ctx.reply({content: `changed language to english`, ephemeral: true})})
							.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
						} break;
						case 'fr': {
							writeLangUser({
								guildid: ctx.guild.id,
								userid: ctx.user.id,
								language: 'fr'
							})
							.then(async doc => {await ctx.reply({content: `langue changée en français !`, ephemeral: true})})
							.catch(async error => {await ctx.reply(`error al cambiar el idioma :(`); console.log(error)});
						} break;
						case 'de': {
							writeLangUser({
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
				} break;
				case 'guild': {
					switch (option) {
					case 'es': {
						if ((ctx.member as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator)) {
							writeLangUser({
							guildid: ctx.guild.id,
							userid: ctx.user.id,
							language: 'es'
							})
								.then(async doc => {await ctx.reply({content: `idioma cambiado a español`, ephemeral: true})})
								.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
						} else {
							ctx.reply({content: `you don't have permission to use this command!`, ephemeral: true})
						}
					} break;
					case 'en': {
						if ((ctx.member as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator)) {
							writeLangUser({
							guildid: ctx.guild.id,
							userid: ctx.user.id,
							language: 'en'
							})
								.then(async doc => {await ctx.reply({content: `language changed to english`, ephemeral: true})})
								.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
						} else {
							ctx.reply({content: `you don't have permission to use this command!`, ephemeral: true})
						}
					} break;
					case 'fr': {
						if ((ctx.member as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator)) {
							writeLangUser({
							guildid: ctx.guild.id,
							userid: ctx.user.id,
							language: 'fr'
							})
								.then(async doc => {await ctx.reply({content: `langue changée en français !`, ephemeral: true})})
								.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
						} else {
							ctx.reply({content: `you don't have permission to use this command!`, ephemeral: true})
						}
					} break;
					case 'de': {
						if ((ctx.member as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator)) {
							writeLangUser({
							guildid: ctx.guild.id,
							userid: ctx.user.id,
							language: 'de'
							})
								.then(async doc => {await ctx.reply({content: `language changed to german`, ephemeral: true})})
								.catch(async error => {await ctx.reply({content: `error al cambiar el idioma :(`, ephemeral: true}); console.log(error)});
						} else {
							ctx.reply({content: `you don't have permission to use this command!`, ephemeral: true})
						}
					} break;
				}
			}
		}
	}
}
});