import { commandModule, CommandType } from '@sern/handler';
import { EmbedBuilder } from 'discord.js'

export default commandModule({
	type: CommandType.Slash,
	plugins: [],
	description: 'See the lyrics',
    options: [],
	//alias : [],
    execute: async (ctx, args) => {
        await ctx.interaction.deferReply({ ephemeral: true })
        if (ctx.guild!.members.me?.voice.channelId) {
            const queue = args.deps.distube.getQueue(ctx.guild!)
            const search = await fetch(`https://lrclib.net/api/search?q=${queue!.songs[0].name}`, {
                headers: {
                    'User-Agent': 'Bask (https://github.com/baskbotml/bask)'
                }
            }).then(res => res.json()) as LRCLibSearch[]
            const lyrics = search[0].plainLyrics
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
                .setTitle(`Lyrics of ${queue!.songs[0].name}`)
                .setDescription(lyrics)
            await ctx.interaction.editReply({embeds: [embed]})
        } else {
            await ctx.interaction.editReply({content: "There's no queue!"})
        }
	},
});

interface LRCLibSearch {
    id: number,
    trackName: string,
    artistName: string,
    albumName: string,
    duration: number,
    instrumental: boolean,
    plainLyrics: string,
    syncedLyrics: string,
}