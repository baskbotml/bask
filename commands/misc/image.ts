import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { commandModule, CommandType } from '@sern/handler';
import axios from 'axios';
import { ApplicationCommandOptionType } from 'discord.js';
import { publish } from '../../plugins/publish.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'See some images',
	options: [
		{
			name: 'capybara',
			description: 'See a random image of a capybara',
			type: ApplicationCommandOptionType.Subcommand
		}
	],
	execute: async (ctx, options) => {
		switch (ctx.interaction.options.getSubcommand()) {
			case 'capybara': {
				const request = await axios('https://api.capybara-api.xyz/v1/image/random').then(res => res.data)
				const embed = new EmbedBuilder()
					.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
					.setTitle('Capybara')
					.setColor('Random')
					.setImage(request.image_urls.medium)
					.setFooter({text: `ID: ${request.id}`})
				await ctx.interaction.reply({embeds: [embed], ephemeral: true})
			}
		}
	},
});