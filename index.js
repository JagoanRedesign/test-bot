require("dotenv").config()

const { Bot, webhookCallback } = require("grammy")

const token = process.env.BOT_TOKEN
const bot = new Bot(token)

bot.command("start", ctx => ctx.reply("hello world yaa"))

module.exports = webhookCallback(bot, "http")
