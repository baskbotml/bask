// all code from @EvolutionX-10 on sern community discord bot <3
import { commandModule, CommandType } from "@sern/handler";
import { inspect } from "node:util";

export default commandModule({
	type: CommandType.Text,
	//alias : [],
	execute: async (ctx, args) => {
		if (ctx.user.id !== '703974042700611634') return

		let code: string[] | string = ctx.options;
		code = code.join(" ") as string;
		if (code.includes("await")) {
			const ar = code.split(";");
			const last = ar.pop();
			code = `(async () => {\n${ar.join(";\n")}\nreturn ${
				last?.trim() ?? " "
			}\n\n})();`;
		}
		const { channel, guild, client, user, member, message } = ctx;

		let result: unknown | string;

		try {
			result = eval(code);
		} catch (error) {
			result = error;
		}
		if (result instanceof Promise)
			result = await result.catch((e: Error) => new Error(e.message));
		if (typeof result !== "string") {
			result = inspect(result, {
				depth: 0,
			});
		}

		result = "```js\n" + result + "\n```";

		if ((result as string).length > 2000) {
			channel!.send("Result is too long to send");
		}

		await ctx.channel!.send({ content: result as string });
	},
});