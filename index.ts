const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const { Sern } = require('@sern/handler');
const prefix = process.env.PREFIX
import { SernEmitter } from "@sern/handler";
import i18next from "i18next";
const mongoose = require("mongoose");
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
})

Sern.init({client,defaultPrefix: `${prefix}`,commands : './commands', events: './events', sernEmitter: new SernEmitter()});

mongoose.connect(process.env.MONGODB)

i18next.init({
    resources: {
        en: {translation: require('./translations/en.json')},
        es: {translation: require('./translations/es.json')},
        fr: {translation: require('./translations/fr.json')},
        de: {translation: require('./translations/de.json')}
    },
    lng: 'en',
    fallbackLng: 'en',
})

client.on('ready', () => {console.log('Ready!');})

client.login(process.env.TOKEN)