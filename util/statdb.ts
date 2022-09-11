const reconDB = require('reconlx');
export const statdb = new reconDB({uri: process.env.STATS_MONGO_URI})