import { commandModule, CommandType, Context, SlashOptions } from '@sern/handler';
import { ApplicationCommandOptionType, Guild, GuildMember, GuildTextBasedChannel, messageLink, VoiceBasedChannel, VoiceChannel, VoiceState } from 'discord.js'
import { distube } from '../../index.js';
import { publish } from '../../src/plugins/publish.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Loop the song or queue',
    options: [
            {
                name: 'type',
                description: '0 for disable, 1 for song, 2 for queue',
                type: ApplicationCommandOptionType.Number,
                required: true,
                min_value: 0,
                max_value: 2
            }
        ],
	//alias : [],
    execute: async (ctx) => {
        const queue = distube.getQueue(ctx.guild.id)
        queue?.setRepeatMode(ctx.interaction.options.getNumber('type') as number)
        switch (ctx.interaction.options.getNumber('type') as number) {
            case 0:
                await ctx.reply({content: "Looping has been disabled.", ephemeral: true});
                break;
            case 1: 
                await ctx.reply({content: "From now on, the song playing will be looped!", ephemeral: true});
                break;
            case 2:
                await ctx.reply({content: "From now on, all the queue will be looped!", ephemeral: true});
                break;
        }
        
	},
});