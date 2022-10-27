import { commandModule, CommandType } from '@sern/handler';
import { EmbedBuilder } from 'discord.js'
import { distube } from '../../index.js';
import { publish } from '../../src/plugins/publish.js';
import Genius from "genius-lyrics";
const genius = new Genius.Client()

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Loop the song or queue',
    options: [],
	//alias : [],
    execute: async (ctx) => {
        await ctx.interaction.deferReply({ephemeral: true})
        if (ctx.guild.members.me?.voice.channelId) {
            const queue = distube.getQueue(ctx.guild)
            const search = await genius.songs.search(queue!.songs[0].name as string)
            const song = search[0]
            let lyrics
            try {
                lyrics = await song.lyrics()
            } catch (error) {
                lyrics = "Lyrics not found!"
            }
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