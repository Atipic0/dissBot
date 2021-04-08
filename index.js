process.env.NODE_ENV ?? require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios').default;
const bot = new Telegraf(process.env.TOKEN)


// on start create document in databse with chat id
bot.start()

// on message check user id and add to database if not present
bot.on('text')

// show inline keyboard on help. two options: diss user & add diss
// on selection send a callback query with the name of the options as data
bot.help((ctx) => {
    ctx.reply('ready to diss?', {
        reply_markup: {
            inline_keyboard: [[
                { text: 'diss user', callback_data: 'dissuser' }
            ], [
                { text: 'add diss', callback_data: 'adddiss' }
            ]]
        }
    })
})

// callback query handler
// use switch statement to handle differente cases
bot.on('callback_query', (ctx) => {
    const data = ctx.update.callback_query.data

    switch (data) {
        case "dissuser":
            ctx.reply('who you wanna diss?', {
                reply_markup: {
                    inline_keyboard: [[
                        { text: 'Kevin', callback_data: 'kevin' }
                    ], [
                        { text: 'Dan', callback_data: 'dan' }
                    ]]
                }
            })

            break;
        case "adddiss":

            break;

        default:
            break;
    }

})

// handle inline queries
bot.on('inline_query', (ctx) => {
    const query = ctx.update.inline_query.query
    ctx.answerInlineQuery([{ type: 'article', id: 5, title: 'insult', input_message_content: { message_text: `${query}, you suck!` } }])
})

// specific command to diss kevin and only kevin
bot.command('disskevin', async (ctx) => {

    const insult = await getInsult()
    const insulto = await getInsulto()
    ctx.reply('@K_Silvestri: ' + insult)
    ctx.replyWithVoice({ url: `http://api.voicerss.org/?key=${process.env.AUDIO}&hl=en-us&c=OGG&src=${insult}` })
    ctx.reply('@K_Silvestri: ' + insulto)
    ctx.replyWithVoice({ url: `http://api.voicerss.org/?key=${process.env.AUDIO}&hl=it-it&c=OGG&src=${insulto}` })

})

bot.hears(['diss'],)

bot.launch()


async function getInsult(who = 'kevin') {
    try {
        const response = await axios.get('https://insult.mattbas.org/api/insult.txt?who=' + who);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

async function getInsulto() {
    try {
        const response = await axios.get('https://evilinsult.com/generate_insult.php?lang=it&type=json');
        return response.data.insult
    } catch (error) {
        console.error(error);
    }
}


