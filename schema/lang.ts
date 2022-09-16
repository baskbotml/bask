const mongoose = require('mongoose');
const schema = new mongoose.Schema({ 
    guildid: {type: String, required: true},
    userid: {type: String, required: true},
    language: {type: String, required: true}
});
const db = new mongoose.model('language' , schema)
export {db};