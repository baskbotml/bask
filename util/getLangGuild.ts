import { db } from '../schema/langUser'

async function getLang(guildID: String, i18n: any) {
	try {
		const getIfItExists = await db.findOne({ guildid: guildID })
		return i18n.changeLanguage(getIfItExists.language)
	} catch (error) {
		// no language was found for that userid in that guildid, so we default to fallback (in init, what are you watching here? go back to work!)
	}
}

module.exports = { getLang }