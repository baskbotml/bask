import { model, Schema } from 'mongoose'

const theschema = new Schema({
    songid: { type: String, required: true }
})

// @ts-ignore
export const db = new model('songs-played', theschema)