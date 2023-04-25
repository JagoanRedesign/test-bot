require("dotenv").config()

const express = require("express")
const axios = require("axios")
const { Bot, webhookCallback } = require("grammy")

const port = process.env.PORT
const token = process.env.BOT_TOKEN

const bot = new Bot(token)
const app = express()

app.use(express.json())
app.use(`/${ token }`, webhookCallback(bot, "express"))

bot.command("start", ctx => ctx.reply("hello world yaa"))
bot.command("video", async ctx => {
  let url = ctx.message.text.replace("/video").trim()
  let endpoint = `https://dlpanda.com?url=${ url }&token=G7eRpMaa`
  let headers = { headers: { "User-Agent": "Postify/1.0.0" } }
  try {
    let response = await axios.get(endpoint, headers)
    return ctx.reply(`${ response.status } ${ response.statusText }`)
  } catch ( err ) {
    return ctx.reply(`${ err.response.status } ${ err.response.statusText }`)
  }
})

app.listen(port, () => console.log("deployed!!"))
