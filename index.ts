const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const { Sern } = require('@sern/handler');
const prefix = process.env.PREFIX
import { SernEmitter } from "@sern/handler";
import i18next from "i18next";
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
})

Sern.init({client,defaultPrefix: `${prefix}`,commands : './commands', events: './events', sernEmitter: new SernEmitter()});

import en_translation from "./translations/en.json"
// import es_translation from "./translations/es.json"
// import fr_translation from "./translations/fr.json"
// import de_translation from "./translations/de.json"

i18next.init({
    resources: {
        en: {translation: en_translation},
        // es: {translation: require('./translations/es.json')},
        // fr: {translation: require('./translations/fr.json')},
        // de: {translation: require('./translations/de.json')}
    },
    lng: 'en',
    fallbackLng: 'en',
})

client.on('ready', () => {console.log('Ready!');})

client.login(process.env.TOKEN)