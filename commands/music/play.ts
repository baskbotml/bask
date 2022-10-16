import { Args, commandModule, CommandType, Context, SernOptionsData } from '@sern/handler';
import { ApplicationCommandOptionType, GuildMember, GuildMemberManager } from 'discord.js';
import { publish } from '../../src/plugins/publish';
import i18next from "i18next"
const { getLang } = require('../../util/getLangUser')

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
		const guildmembercheck = ctx.client.guilds.cache.get(ctx.guild.id)?.members.cache.get(ctx.user.id)
		const guildmemberVC_id = (ctx.member! as GuildMember).voice.channelId
		if (guildmembercheck?.voice.channel) {
			if (guildmemberVC_id === ctx.guild.members.me!.voice.channelId) {
				
			} else {
				ctx.reply({content: `${i18next.t('play.NotSameVC', { voicechannelid: `${ctx.guild.members.me!.voice.channel}` })}`, ephemeral: true})
			}
		} else {
			ctx.reply({content: `${i18next.t('play.NotInVC')}`, ephemeral: true})
		}
	},
});