// imports
const fs = require("fs")
const Discord = require("discord.js")

// load config.json if exists
// eslint-disable-next-line import/no-unresolved
const config = fs.existsSync("./config.json") ? require("./config.json") : {}
// load discord token from config or env
const token = config.DISCORD_TOKEN || process.env.DISCORD_TOKEN

// create new discord client
const client = new Discord.Client()

// discord events

// log when discord client is ready
// eslint-disable-next-line no-console
client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`))

// start discord client by login with token
client.login(token)
