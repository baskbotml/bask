import { model, Schema } from 'mongoose'

const theschema = new Schema({
    error: {type: String, required: true},
    id: {type: String, required: true}
})

// @ts-ignore
export const db = new model('distube-error', theschema)