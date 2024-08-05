import { Context, Init } from "@sern/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, ComponentType, EmbedBuilder } from "discord.js";
import { Connectors, Shoukaku } from "shoukaku";
import { Queue } from "./queue.js";

export class Music implements Init {
    private client: Client

    public shoukaku: Shoukaku;
    public queue: Queue;

    constructor(client: Client) {
        this.client = client;
        this.shoukaku = new Shoukaku(new Connectors.DiscordJS(this.client), [
            {
                name: 'main',
                url: 'localhost:2333',
                auth: 'youshallnotpass'
            }
        ]);
        this.queue = new Queue(this.client, this.shoukaku);
    }

    async init() {
        this.shoukaku.on('ready', () => {
            console.log('[MUSIC] Shoukaku is ready!')
        })
        this.shoukaku.on('error', (name, error) => {
            console.log(`[MUSIC] Shoukaku node "${name}" emitted an error: ${error.message}`)
        })
        this.shoukaku.on('close', (name, code, reason) => {
            console.log(`[MUSIC] Shoukaku node "${name}" closed with code ${code} and reason ${reason}`)
        })
    }
}