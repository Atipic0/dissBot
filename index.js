process.env.NODE_ENV ?? require('dotenv').config()
const { Telegraf } = require('telegraf')
const https = require('https')

const bot = new Telegraf(process.env.TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help(async (ctx) => {
    let chat = await ctx.getChat()
    console.log(chat)
    ctx.reply('Send me a sticker')
})
bot.command('dissme', (ctx) => {


    https.get('https://evilinsult.com/generate_insult.php?lang=en&type=json', res => {
        let data = [];
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';

        res.on('data', chunk => {
            data.push(chunk);
        });

        res.on('end', () => {
            const body = JSON.parse(Buffer.concat(data).toString());
            ctx.reply(body.insult)
        });

    }).on('error', err => {
        console.log('Error: ', err.message);
        ctx.reply('you are too sad to insult')
    });


})
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears('whothere', (ctx) => ctx.getChatMembersCount((count) => ctx.reply(String(count))))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))