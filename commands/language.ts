import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
    type: CommandType.Both,
    plugins: [],
    description: 'Set the language of the server.',
    options: [],
    execute: async (ctx, options) => {
        
    },
});