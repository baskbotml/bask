import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, GuildMember, GuildTextBasedChannel, PermissionFlagsBits } from 'discord.js'
import { distube } from '../../index.js';
import { publish } from '../../src/plugins/publish.js';
import { inVc } from '../../src/plugins/inVc.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish(), inVc()],
	description: 'Play some music',
    options: [
            {
                name: 'name',
                description: 'The name of the song or URL',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
    execute: async (ctx, args) => {
        try {
            const currentMember = ctx.member as GuildMember;
            const vcConnectionCheck = (await ctx.guild.members.fetch(ctx.user.id)).permissionsIn(currentMember.voice.channelId!)
            if (ctx.guild.members.me?.voice.channelId) {
                if (ctx.guild.voiceStates.cache.get(ctx.client.user!.id)?.channelId !== ctx.guild.voiceStates.cache.get(ctx.user.id)?.channelId)
                    return ctx.reply({content: `You need to stay in the same VC as me!`, ephemeral: true})
            }
            if (vcConnectionCheck!.has(PermissionFlagsBits.Connect)) return ctx.reply({content: `I can't join on that VC!`, ephemeral: true})
            if (vcConnectionCheck!.has(PermissionFlagsBits.Speak)) return ctx.reply({content: `I can't speak on that VC!`, ephemeral: true})
            await distube.play(currentMember.voice.channel!, args[1].getString('name',true), {
                member: currentMember,
                textChannel: ctx.channel as GuildTextBasedChannel,
            })
            await ctx.reply({content: "Should be added to the queue if a message is sent now!", ephemeral: true})
        } catch (err) {
            await ctx.reply({content: `Woah, something bad happened. Check if I can see or join the VC you are on.`, ephemeral: true})
        }
	},
});