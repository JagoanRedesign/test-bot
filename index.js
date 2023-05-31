require("dotenv").config()

const { freeStorage } = require("@grammyjs/storage-free")
const express = require("express")
const { Bot, webhookCallback, session } = require("grammy")


const port = process.env.PORT
const token = process.env.BOT_TOKEN
const limit = { message: 2, time: 4000 }

const bot = new Bot(token)
const app = express()

app.use(express.json())
app.use(`/${ token }`, webhookCallback(bot, "express"))

bot.use(session({
  initial: () => ({ last_message_date: null, count: 1 }),
  storage: freeStorage(bot.token)
}))

bot.use(async ( ctx, next ) => {
  let session = ctx.session

  let currentTime =  ctx.message
    ? ctx.message.date * 1000 : ctx.callbackQuery
    ? ctx.callbackQuery.date * 1000 : null

  if ( !currentTime ) {
    return await next()
  }

  if ( !session.last_message_date ) {
    let source = {
      last_message_date: currentTime.toString(),
      count: 1
    }

    Object.assign(ctx.session, source)
    await ctx.reply("initialize rate limit session!")
    return await next()
  }

  let cachedCount = session.count
  let cachedTimes = parseInt(session.last_message_date)
  let gap = currentTime - cachedTimes

  if ( cachedCount >= limit.message && gap <= limit.time ) {
    return await ctx.reply("Too many requests!!!")
  }

  let source = {
    last_message_date: currentTime.toString()
  }

  if ( gap <= limit.time ) {
    source.count = cachedCount + 1
    await ctx.reply(`add count : ${ source.count }`)
  } else {
    source.count = cachedCount - 1 < 1 ? 1 : cachedCount - 1
    await ctx.reply(`del count : ${ source.count }`)
  }

  Object.assign(ctx.session, source)
  await next()
})

bot.command("start", ctx => ctx.reply("started"))

app.listen(port)
