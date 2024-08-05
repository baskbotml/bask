import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, GuildMember, Message, type Client } from "discord.js";
import { LoadType, type Shoukaku, type Track } from "shoukaku";
import { type Context } from "@sern/handler";

const queueDb = <{ id: string, tracks: Track[] }[]>[]

export class Queue {
    private client: Client;
    private shoukaku: Shoukaku;
    
    constructor(client: Client, shoukaku: Shoukaku) {
        this.client = client;
        this.shoukaku = shoukaku;
    }

    async add(query: string, ctx: Context) {
        const queue = queueDb.find(q => q.id === ctx.guildId);
        if (!queue) {
            queueDb.push({ id: ctx.guildId!, tracks: [] });
            return;
        }

        const node = this.shoukaku.options.nodeResolver(this.shoukaku.nodes);
        const lvlResponse = await node?.rest.resolve(query);

        if (!lvlResponse || [ LoadType.ERROR, LoadType.EMPTY ].includes(lvlResponse.loadType)) {
            return void ctx.channel?.send('No tracks found');
        }

        switch (lvlResponse.loadType) {
            case LoadType.SEARCH:
                queue.tracks.push(lvlResponse.data[0]);
                break;
            case LoadType.TRACK:
                queue.tracks.push(lvlResponse.data);
                break;
            case LoadType.PLAYLIST:
                queue.tracks.push(...lvlResponse.data.tracks);
                break;
        }

        if (queue.tracks.length === 1) {
            await this.play(ctx);
        }

        return queue.tracks[queue.tracks.length - 1];
    }

    async play(ctx: Context, next = false) {
        const queue = queueDb.find(q => q.id === ctx.guildId);
        if (!queue) {
            return;
        }
        let player = this.getPlayer(ctx.guildId!)
        if (!player) {
            player = await this.joinChannel(ctx);
        }
		if (next) {
			queue.tracks.shift();
		}
        player.playTrack({ track: queue.tracks[0] });
    }

    async skip(ctx: Context) {
        const queue = queueDb.find(q => q.id === ctx.guildId);
        if (!queue) {
            return;
        }
        const player = this.getPlayer(ctx.guildId!);
        player?.stopTrack();
    }

    async joinChannel(ctx: Context) {
        const player = await this.shoukaku.joinVoiceChannel({
            channelId: (ctx.member as GuildMember).voice.channel?.id!,
            guildId: ctx.guildId!,
            shardId: 0
        });
        player.on('start', async (r) => {
            await this.np(ctx);
        });
        player.on('end', async (r) => {
            const queue = this.getQueue(ctx.guildId!)
            if (!queue.tracks[1]) {
                return player.destroy();
            }
            await this.play(ctx, true);
        });
        return player
    }

    getQueue(guildId: string) {
        const findQueue = queueDb.find(q => q.id === guildId);
        if (!findQueue) {
            queueDb.push({ id: guildId, tracks: [] });
            return queueDb[queueDb.length - 1];
        }
        return findQueue;
    }

    getPlayer(guildId: string) {
        return this.shoukaku.players.get(guildId);
    }

    async np(ctx: Context) {
        const queue = this.getQueue(ctx.guildId!);
		const player = this.getPlayer(ctx.guildId!);
        const track = queue.tracks[0];
        if (!queue) {
            return await ctx.channel?.send('No tracks in queue!');
        }
		if (!player) {
			return await ctx.channel?.send('No player found!');
		}

        const buttonrow1 = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setCustomId('ev-music-playSong-pauseplay')
				.setEmoji('⏯')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('ev-music-playSong-stop')
				.setEmoji('⏹️')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('ev-music-playSong-skip')
				.setEmoji('⏭')
				.setStyle(ButtonStyle.Secondary)
		);
		const buttonrow2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setCustomId('ev-music-playSong-mute')
				.setEmoji('🔇')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('ev-music-playSong-lowervolume')
				.setEmoji('🔉')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('ev-music-playSong-highvolume')
				.setEmoji('🔊')
				.setStyle(ButtonStyle.Secondary)
		);
		const buttonrow1disabled =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setCustomId('ev-music-playSong-skip')
					.setEmoji('⏭')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('ev-music-playSong-stop')
					.setEmoji('⏹️')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('ev-music-playSong-pauseplay')
					.setEmoji('⏯')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true)
			);
		const buttonrow2disabled =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setCustomId('ev-music-playSong-mute')
					.setEmoji('🔇')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('ev-music-playSong-lowervolume')
					.setEmoji('🔉')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('ev-music-playSong-highvolume')
					.setEmoji('🔊')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true)
			);
        
		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(track.info.title)
			.setURL(track.info.uri!)
			.setImage(track.info.artworkUrl || 'https://images.unsplash.com/photo-1519681393784-d120267933ba');

        const message = await ctx.channel?.send({
            embeds: [embed],
            components: [buttonrow1, buttonrow2]
        })!;

        const collector = message.createMessageComponentCollector({
			time: 120_000,
			componentType: ComponentType.Button,
		});

        collector.on('collect', async (i) => {
			if (i.user.id !== ctx.userId) {
				return i.reply({ content: 'You are not the author of this command!', ephemeral: true });
			}
			switch (i.customId) {
				case 'ev-music-playSong-pauseplay':
					if (player.paused) {
						player.setPaused(false);
						await message.edit({
							embeds: [embed.setDescription(`Resumed by <@${ctx.userId}>`)],
						})
					} else {
						player.setPaused(true);
						await message.edit({
							embeds: [embed.setDescription(`Paused by <@${ctx.userId}>`)],
						})
					}
					await i.deferUpdate();
					break;
				case 'ev-music-playSong-stop':
					await player.destroy();
					await message.edit({
						embeds: [embed.setDescription(`Stopped by <@${ctx.userId}>`)],
						components: [buttonrow1disabled, buttonrow2disabled]
					});
					await i.deferUpdate();
					break;
				case 'ev-music-playSong-skip':
					await this.skip(ctx);
					await message.edit({
						embeds: [embed.setDescription(`Skipped by <@${ctx.userId}>`)],
						components: [buttonrow1disabled, buttonrow2disabled]
					});
					await i.deferUpdate();
					break;
				case 'ev-music-playSong-mute':
					player.setGlobalVolume(0);
					await message.edit({
						embeds: [embed.setDescription(`Muted by <@${ctx.userId}>`)],
					});
					await i.deferUpdate();
					break;
				case 'ev-music-playSong-lowervolume':
					let num = player.volume - 10;
					if (num < 0) {
						num = 0;
					} else if (num > 100) {
						num = 100;
					}
					player.setGlobalVolume(num);
					await message.edit({
						embeds: [embed.setDescription(`Volume set to ${num} by <@${ctx.userId}>`)],
					});
					await i.deferUpdate();
					break;
				case 'ev-music-playSong-highvolume':
                    let n = player.volume + 10;
					if (n < 0) {
						n = 0;
					} else if (n > 100) {
						n = 100;
					}
					player.setGlobalVolume(n);
					await message.edit({
						embeds: [embed.setDescription(`Volume set to ${n} by <@${ctx.userId}>`)],
					});
					await i.deferUpdate();
					break;
				}})
		collector.on('end', async () => {
			await message.edit({
				components: [buttonrow1disabled, buttonrow2disabled]
			})
		})
    }
}