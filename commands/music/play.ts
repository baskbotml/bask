import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, GuildMember, GuildTextBasedChannel, PermissionFlagsBits, VoiceBasedChannel } from 'discord.js'
import { distube } from '../../index.js';
import { publish } from '../../plugins/publish.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Play some music',
    options: [
            {
                name: 'name',
                description: 'The name of the song or URL',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
	//alias : [],
    execute: async (ctx, args) => {
        try {
            const vcConnectionCheck = ctx.client.guilds.cache.get(ctx.guild!.id)?.members.cache.get(ctx.user.id)?.permissionsIn((ctx.interaction.member as GuildMember).voice.channelId as string)
            if (!ctx.client.guilds.cache.get(ctx.guild!.id)?.members.cache.get(ctx.user.id)?.voice.channel) return await ctx.reply({content: "You are not in a voice channel!", ephemeral: true})
            if (ctx.guild!.members.me?.voice.channelId) {if (ctx.guild!.voiceStates.cache.get(ctx.client.user!.id)?.channelId !== ctx.guild!.voiceStates.cache.get(ctx.user.id)?.channelId) return await ctx.reply({content: `You need to stay in the same VC as me!`, ephemeral: true})}
            if (!vcConnectionCheck!.has(PermissionFlagsBits.Connect)) return await ctx.reply({content: `I can't join on that VC!`, ephemeral: true})
            if (!vcConnectionCheck!.has(PermissionFlagsBits.Speak)) return await ctx.reply({content: `I can't speak on that VC!`, ephemeral: true})
            distube.play((ctx.interaction.member as GuildMember).voice.channel!, args[1].getString('name')!, {
                member: ctx.interaction.member as GuildMember,
                textChannel: ctx.interaction.channel as GuildTextBasedChannel,
            })
            await ctx.reply({content: "Should be added to the queue if a message is sent now!", ephemeral: true})
        } catch (err) {
            await ctx.reply({content: `Woah, something bad happened. Check if I can see or join the VC you are on.`, ephemeral: true})
        }
	},
});