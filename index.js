require("dotenv").config()

const express = require("express")
const { Bot, webhookCallback } = require("grammy")

const port = process.env.PORT
const token = process.env.BOT_TOKEN

const bot = new Bot(token)
const app = express()

app.use(express.json())
app.use(`/${ token }`, webhookCallback(bot, "express"))

bot.command("start", ctx => ctx.reply("hello world yaa"))

app.listen(port, () => console.log("deployed!!"))
