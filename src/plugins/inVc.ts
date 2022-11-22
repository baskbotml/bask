import { CommandType, EventPlugin, PluginType } from '@sern/handler';

export function inVc() : EventPlugin<CommandType.Slash> {
	return  {
		 type: PluginType.Event,
		 execute: async ([ctx,args], controller) => {
			 const guildMem = await ctx.guild.members.fetch(ctx.user.id);
			 if(guildMem.voice.channel === null) {
				 await ctx.reply({ content: "You are not in a voice channel!", ephemeral:true });
				 return controller.stop();
			 }
			 return controller.next();
		}
	}
}