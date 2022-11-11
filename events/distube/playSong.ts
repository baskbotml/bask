import { eventModule, EventType } from '@sern/handler';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
} from 'discord.js';
import { Queue, Song } from 'distube';
import axios from 'axios';
import { db } from '../../schemas/songsPlayed.js';

export default eventModule({
	type: EventType.External,
	emitter: 'DisTube',
	execute: async (queue: Queue, song: Song) => {
		const dbthing = new db({ songid: song.id });
		await dbthing.save();
		const buttonrow1 = new ActionRowBuilder<ButtonBuilder>().setComponents(
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
		);
		const buttonrow2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
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
		);
		const buttonrow1disabled =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-skip')
					.setEmoji('⏭')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-stop')
					.setEmoji('⏹️')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('events-distube-playSong-pauseplay')
					.setEmoji('⏯')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true)
			);
		const buttonrow2disabled =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
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
			);
		const likeanddislike = await axios
			.get(`https://returnyoutubedislikeapi.com/votes?videoId=${song.id}`)
			.then((res) => res.data);
		const embed = new EmbedBuilder()
			.setColor('Random')
			.setAuthor({
				name: song.member!.user.username,
				iconURL: song.member?.user.displayAvatarURL(),
			})
			.setTitle(song.name as string)
			.setURL(song.url)
			.setImage(song.thumbnail as string)
			.setFooter({
				iconURL: 'https://cdn.discordapp.com/emojis/990951871797678110.gif',
				text: `Views: ${song.views} • Likes: ${likeanddislike.likes} • Dislikes: ${likeanddislike.dislikes}`,
			});
		const message = await queue.textChannel!.send({
			embeds: [embed],
			components: [buttonrow1, buttonrow2],
		});
		const collector = message.createMessageComponentCollector({
			time: 120_000,
			componentType: ComponentType.Button,
		});
		collector.on('collect', async (i) => {
			if (i.customId === 'events-distube-playSong-skip') {
				if (queue.songs.length > 1) {
					await queue.skip();
				} else {
					await queue.stop();
				}
				await message.edit({
					embeds: [embed.setDescription(`Skipped by ${i.user}`)],
					components: [buttonrow1disabled, buttonrow2disabled],
				});
				collector.stop();
			} else if (i.customId === 'events-distube-playSong-stop') {
				await queue.stop();
				await message.edit({
					embeds: [embed.setDescription(`Queue stopped by ${i.user}`)],
					components: [buttonrow1disabled, buttonrow2disabled],
				});
				collector.stop();
			} else if (i.customId === 'events-distube-playSong-pauseplay') {
				if (queue.paused) {
					queue.resume();
					await message.edit({
						embeds: [embed.setDescription(`Song resumed by ${i.user}`)],
					});
				} else {
					queue.pause();
					await message.edit({
						embeds: [embed.setDescription(`Song paused by ${i.user}`)],
					});
				}
			} else if (i.customId === 'events-distube-playSong-mute') {
				queue.setVolume(0);
				await message.edit({
					embeds: [embed.setDescription(`Song muted by ${i.user}`)],
				});
			} else if (i.customId === 'events-distube-playSong-lowervolume') {
				let volume = queue.volume;
				volume = volume - 10;
				if (volume <= 0) {
					volume = 0;
					queue.setVolume(volume);
					await message.edit({
						embeds: [embed.setDescription(`Volume lowered by ${i.user} to ${volume}%`)],
					});
				} else {
					queue.setVolume(volume);
					await message.edit({
						embeds: [embed.setDescription(`Volume lowered by ${i.user} to ${volume}%`)],
					});
				}
			} else if (i.customId === 'events-distube-playSong-highvolume') {
				let volume = queue.volume;
				volume = queue.volume + 10;
				if (volume >= 100) {
					volume = 100;
					queue.setVolume(volume);
					await message.edit({embeds: [embed.setDescription(`Volume increased by ${i.user} to ${volume}%`)]})
				} else {
					queue.setVolume(volume);
					await message.edit({embeds: [embed.setDescription(`Volume increased by ${i.user} to ${volume}%`)]})
				}
			}
		});
		collector.on('end', async () => {
			await message.edit({
				components: [buttonrow1disabled, buttonrow2disabled],
			});
		});
	},
});
