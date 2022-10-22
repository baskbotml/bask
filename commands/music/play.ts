import { commandModule, CommandType, Context, SlashOptions } from '@sern/handler';
import { ApplicationCommandOptionType, GuildMember, GuildTextBasedChannel, VoiceBasedChannel } from 'discord.js'
import { distube } from '../..';

export default commandModule({
	type: CommandType.Slash,
	plugins: [],
	description: 'Play some music',
    options: [
            {
                name: 'name',
                description: 'The name of the song or URL',
                type: ApplicationCommandOptionType.String
            }
        ],
	//alias : [],
    execute: async (ctx, args) => {
        if (!ctx.client.guilds.cache.get(ctx.guildId)?.members.cache.get(ctx.user.id)?.voice.channel) return await ctx.reply({content: "You are not in a voice channel!", ephemeral: true})
        distube.play(ctx.message.member?.voice.channel as VoiceBasedChannel, args[1].getString('name') as string, {
            member: ctx.message.member as GuildMember,
            textChannel: ctx.message.channel as GuildTextBasedChannel,
        })
        await ctx.reply({content: "Should be added to the queue if a message is sent now!", ephemeral: true})
	},
});