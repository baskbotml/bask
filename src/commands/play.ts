import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [],
    description: 'Play music',
    options: [
        {
            name: 'query',
            description: 'The query to search for',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'source',
            description: 'The source of the query',
            required: false,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Youtube',
                    value: 'ytsearch:'
                },
                {
                    name: 'Youtube Music',
                    value: 'ytmsearch:'
                },
                {
                    name: 'Soundcloud',
                    value: 'scsearch:'
                }
            ]
        }
    ],
    execute: async (ctx, args) => {
        await ctx.interaction.deferReply();

        const query = ctx.options.getString('query', true);
        const source = ctx.options.getString('source') || 'ytsearch:';

        const track = await args.deps.music.queue.add(source + query, ctx);

        if (track) {
            await ctx.interaction.editReply(`Added ${track.info.title} to the queue!`);
        }
    },
});