import { commandModule, CommandType } from '@sern/handler';
import { EmbedBuilder } from 'discord.js';
import { Song } from 'distube';
import { distube } from '../../index.js';
import { publish } from '../../src/plugins/publish.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish()],
    description: 'See the current queue',
    options: [],
    execute: async (ctx, options) => {
        const queue = distube.getQueue(ctx.guild.id)
        const embed = new EmbedBuilder()
            .setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
            .setColor('Random')
            .setTitle('Current queue')
            .setDescription(`${queue!.songs.map((song: Song, id: number) => `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``)}`)
        await ctx.reply({embeds: [embed], ephemeral: true})
    },
});