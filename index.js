require("dotenv").config()

const express = require("express")
const axios = require("axios")
const { Bot, webhookCallback } = require("grammy")

const domain = process.env.DOMAIN
const port = process.env.PORT
const token = process.env.BOT_TOKEN

const bot = new Bot(token)
const app = express()

app.use(express.json())
app.use(`/${ token }`, webhookCallback(bot, "express"))

bot.command("start", ctx => ctx.reply("hello world yaa"))
bot.command("video", ctx => {
  let url = ctx.message.text.replace("/video").trim()
  let endpoint = `https://dlpanda.com?url=${ url }&token=G7eRpMaa`
  axios.get(endpoint)
    .then(response => {
      let text = `${ response.status } ${ response.statusText }`
      ctx.reply(text)
      console.log(text)
    })
    .catch(err => {
      let text = `${ err.response.status } ${ err.response.statusText }`
      ctx.reply(text)
      console.error(err.response)
    })
})

app.listen(port, async () => {
  let options = { drop_pending_updates: true }
  await bot.api.setWebhook(`https://${ domain }/${ token }`, options)
})
