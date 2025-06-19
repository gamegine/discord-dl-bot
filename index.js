// imports
const fs = require("fs")

const http = require("http")
const https = require("https")
const Discord = require("discord.js")

// load config.json if exists
const config = fs.existsSync("./config.json") ? require("./config.json") : {}
// load discord token from config or env
const token = config.DISCORD_TOKEN || process.env.DISCORD_TOKEN
// set download dir path
const downloadDir =
	config.DOWNLOAD_DIR || process.env.DOWNLOAD_DIR || "./download"
// download files types (extensions)
const downloadTypes = new RegExp(
	config.FILETYPES || process.env.FILETYPES || /\.(jpg|jpeg|png|gif|mp4)$/,
)
// create new discord client
const client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
	],
})

// discord events

// log when discord client is ready
client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`))

// for each message process
client.on("messageCreate", (msg) => {
	// get all url to download
	const urls = []
	// get all url from message
	{
		const msgUrls = msg.content.match(/https?:\/\/[^\s]+/g)
		// get only urls match type media
		if (msgUrls) {
			msgUrls.forEach((url) => {
				if (url.match(downloadTypes)) {
					urls.push(url)
				}
			})
		}
	}
	// add url from attachments
	if (msg.attachments.size > 0) {
		msg.attachments.forEach((attachment) => {
			if (attachment.name.match(downloadTypes)) {
				urls.push(attachment.url)
			}
		})
	}
	// log all files to download
	if (urls.length > 0) console.log(`start download:\n - ${urls.join("\n - ")}`)
	// download all  files
	urls.forEach((url) => {
		const fileName = url
			.replace(/https?:\/+/, "")
			.replaceAll("/", "-")
			.split("?")[0] // test.png?arg=xx -> test.png
		const filePath = `${downloadDir}/${fileName}`

		// skip if file exists
		if (fs.existsSync(filePath)) {
			console.log(`   skip file ${fileName} already exists`)
			return
		}
		// download file
		const file = fs.createWriteStream(filePath)
		// select protocol
		const protocol = url.startsWith("https") ? https : http
		const request = protocol.get(url, (response) => {
			response.pipe(file)
		})
		// log errors
		request.on("error", (err) => {
			console.error(`   download error: ${url}\n${err}`)
		})
		// log file is downloaded
		file.on("finish", () => {
			console.log(`   ${fileName} downloaded`)
		})
	})
})

// start discord client by login with token
client.login(token)
