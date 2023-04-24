require("dotenv").config()

const express = require("express")
const { Bot, webhookCallback } = require("grammy")

const tokens = process.env.BOT_TOKEN
const domain = process.env.DOMAIN

const bot = new Bot(tokens)
const app = express()

app.use(express.json())
app.use(`/${ tokens }`, webhookCallback(bot, "express"))

bot.command("start", ctx => ctx.reply("hello world yaa"))

app.listen(5000, async () => {
  let options = { drop_pending_updates: true }
  await bot.api.setWebhook(`https://${ domain }/${ tokens }`, options)
})
