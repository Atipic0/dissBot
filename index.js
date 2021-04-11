process.env.NODE_ENV ?? require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios').default;
const bot = new Telegraf(process.env.TOKEN)


// on start create document in databse with chat id

bot.start((ctx) => {
    ctx.reply('\'SUP')
})

// bot.on(['image','gif','video','link','sticker'],(ctx) => {
//     ctx.reply('[WE LOVE YOU](tg://user?id=78229347)', { parse_mode: "MarkdownV2" })
// })


//ctx.update.inline_query.from.id 
//ctx.update.message.entities.id

// show inline keyboard on help. two options: diss user & add diss
// on selection send a callback query with the name of the options as data
bot.help((ctx) => {
    ctx.reply('May I help?', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Diss', callback_data: 'diss' }],
                [{ text: 'AddUser', callback_data: 'addUser' }, { text: 'SubmitDiss', callback_data: 'submitDiss' }],
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })
})
//QUIT
bot.action('quit', (ctx) => {
    ctx.deleteMessage()
})

// action-command to diss
bot.action('diss', (ctx) => {
    ctx.deleteMessage()
    ctx.reply('Who?', {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Me', callback_data: 'me' }, { text: 'DissUser', callback_data: 'dissUser' }],
                [{ text: 'Diss language', callback_data: 'language' }],
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })
})
bot.command('Diss', (ctx) => {
    ctx.deleteMessage()
    ctx.reply('', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Me', callback_data: 'me' }, { text: 'DissUser', callback_data: 'dissUser' }],
                [{ text: 'Diss language', callback_data: 'language' }],
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })
})
bot.action('me', (ctx) => {
    ctx.deleteMessage()
    ctx.reply('h', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Text', callback_data: 'meText' }, { text: 'Voice', callback_data: 'meVoice' }],
                [{ text: 'Gif', callback_data: 'meGif' }],
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }

    })
})
bot.action('meText', async (ctx) => {
    ctx.deleteMessage()
    const insulto = await getInsult()
    ctx.reply(insulto)
})
bot.action('meVoice', async (ctx) => {
    ctx.deleteMessage()
    const insulto = await getInsult()
    ctx.replyWithVoice({ url: `http://api.voicerss.org/?key=bf5dfed7ee12431fbb778d7331a36f8e&c=OGG&src=${insulto}` })
})
bot.action('meGif', (ctx) => {

})
bot.action('dissUser', (ctx) => {

})
bot.action('userText', (ctx) => {

})
bot.action('userVoice', (ctx) => {

})
bot.action('userGif', (ctx) => {

})


// action-command to addUser
bot.action('addUser', (ctx) => {
    ctx.deleteMessage()
    ctx.reply(' sda', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })
})
bot.command('AddUser', (ctx) => {
    ctx.deleteMessage()
})

//action-command to addDiss
bot.action('submitDiss', (ctx) => {
    ctx.deleteMessage()
    ctx.reply('scrivi @dissmeBot YOUR DISS', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })
})
bot.command('SubmitDiss', (ctx) => {

})

// handle inline queries
bot.on('inline_query', (ctx) => {
    const { query } = ctx.update.inline_query
    ctx.answerInlineQuery([{ type: 'article', id: 5, title: 'insult', input_message_content: { message_text: `${query}, you suck!` } }])
    console.log(ctx.update.inline_query)
})


bot.launch()



async function getInsult(who = "User") {
    try {
        const response = await axios.get('https://insult.mattbas.org/api/insult.txt');
        return response.data
    } catch (error) {
        console.error(error);
    }
}
//who=' + who

async function getInsulto() {
    try {
        const response = await axios.get('https://evilinsult.com/generate_insult.php?lang=it&type=json');
        console.log(response.data.insult)
        return response.data.insult
    } catch (error) {
        console.error(error);
    }
}
