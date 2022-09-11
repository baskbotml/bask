const reconDB = require('reconlx');
export const db = new reconDB({uri: process.env.MONGO_URI})