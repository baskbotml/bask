import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [],
    description: 'Set the volume of the queue',
    options: [
        {
            name: 'volume',
            description: 'Set the volume',
            type: ApplicationCommandOptionType.Number,
            min_value: 0,
            max_value: 100,
            required: true
        }
    ],
    execute: async (ctx, args) => {
        const option = ctx.interaction.options.getNumber('volume') as number
        const queue = args.deps.distube.getQueue(ctx.guild!.id)
        queue?.setVolume(option)
        await ctx.reply({content: `The volume was set to ${option}%`, ephemeral: true})
    },
});