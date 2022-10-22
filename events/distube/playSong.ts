import { eventModule, EventType } from "@sern/handler";
import { ActionRowBuilder, ALLOWED_EXTENSIONS, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import { Queue, Song } from "distube";
import axios from "axios"

export default eventModule({
	type: EventType.External,
	emitter: 'DisTube',
	execute: async (queue: Queue, song: Song) => {
		const buttonrow1 = new ActionRowBuilder<ButtonBuilder>()
			.setComponents(
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-pauseplay')
					.setEmoji('⏯')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-stop')
					.setEmoji('⏹️')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-skip')
					.setEmoji('⏭')
					.setStyle(ButtonStyle.Secondary)
			)
		const buttonrow2 = new ActionRowBuilder<ButtonBuilder>()
			.setComponents(
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-mute')
					.setEmoji('🔇')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-lowervolume')
					.setEmoji('🔉')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-highvolume')
					.setEmoji('🔊')
					.setStyle(ButtonStyle.Secondary)
			)
		const buttonrow1disabled = new ActionRowBuilder<ButtonBuilder>()
			.setComponents(
				new ButtonBuilder()
				.setCustomId('events-distube-playSong-skip')
				.setEmoji('⏭')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-pauseplay')
					.setEmoji('⏯')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-stop')
					.setEmoji('⏹️')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true)
			)
		const buttonrow2disabled = new ActionRowBuilder<ButtonBuilder>()
			.setComponents(
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-mute')
					.setEmoji('🔇')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-lowervolume')
					.setEmoji('🔉')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-highvolume')
					.setEmoji('🔊')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true)
			)
		const likeanddislike = await axios.get(`https://returnyoutubedislikeapi.com/votes?videoId=${song.id}`).then(res => res.data)
		const embed = new EmbedBuilder()
			.setAuthor({name: song.member!.user.username, iconURL: song.member?.user.displayAvatarURL()})
			.setTitle(song.name as string)
			.setURL(song.url)
			.setImage(song.thumbnail as string)
			.setFooter({text: `Views: ${song.views} • Likes: ${likeanddislike.likes} • Dislikes: ${likeanddislike.dislikes}`})
		const message = await queue.textChannel!.send({embeds: [embed], components: [buttonrow1, buttonrow2]})
		const collector = message.createMessageComponentCollector({time: 120_000, componentType: ComponentType.Button})
		collector.on('collect', async (i) => {
			await i.deferReply({ ephemeral: true })
			if (i.customId === 'events-distube-playSong-skip') {
				if (queue.songs.length > 1) {
					await queue.skip()
					await i.editReply('Song was skipped correctly')
				} else {
					await queue.stop()
					await i.editReply(`Couldn't skip the song because there wasn't another song after that one.\nStopping queue...`)
				}
				await message.edit({embeds: [embed.setDescription(`Skipped by ${i.user}`)], components: [buttonrow1disabled, buttonrow2disabled]})
			} else if (i.customId === 'events-distube-playSong-stop') {
				await queue.stop()
				await i.editReply({content: 'The queue was stopped correctly'})
			} else if (i.customId === 'events-distube-playSong-pauseplay') {
				if (queue.paused) {
					queue.resume()
					await i.editReply({content: 'The song was resumed correctly'})
				} else {
					queue.pause()
					await i.editReply({content: 'The song was paused correctly'})
				}
			} else if (i.customId === 'events-distube-playSong-mute') {
				queue.setVolume(0)
				await i.editReply({content: 'The queue has been muted correctly.'})
			} else if (i.customId === 'events-distube-playSong-lowervolume') {
				let volume = queue.volume
				volume = queue.volume - 10
				if (volume < 0) {
					queue.setVolume(0)
					await i.editReply({content: `The queue's volume has been lowered correctly to ${volume}%`})
				} else {
					queue.setVolume(volume)
					await i.editReply({content: `The queue's volume has been lowered correctly to ${volume}%`})
				}
			} else if (i.customId === 'events-distube-playSong-highvolume') {
				let volume = queue.volume
				volume = queue.volume + 10
				if (volume >= 100) {
					queue.setVolume(100)
					await i.editReply({content: `The queue's volume has been increased correctly to ${volume}%`})
				} else {
					queue.setVolume(volume)
					await i.editReply({content: `The queue's volume has been increased correctly to ${volume}%`})
				}
			}
		})
		collector.on('end', async () => {
			await message.edit({embeds: [embed], components: [buttonrow1disabled, buttonrow2disabled]})
		})
	}
})