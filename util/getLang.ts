import { db } from '../schema/lang'

async function getLang(userID: String, guildID: String, i18n: any) {
    const getIfItExists = await db.findOne({ userid: userID, guildid: guildID })
    console.log(getIfItExists.language)
    try {
        i18n.changeLanguage(getIfItExists.language)
    } catch (error) {
        // no language was found for that userid in that guildid, so we default to fallback (in init, what are you watching here? go back to work!)
    }
}

module.exports = { getLang }