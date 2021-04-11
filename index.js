process.env.NODE_ENV ?? require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios').default;
const bot = new Telegraf(process.env.TOKEN)


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
bot.on('callback_query', async (ctx) => {
    const { data } = ctx.update.callback_query
    let insulto = await getInsult()
    switch (data) {
        case "quit":
            ctx.deleteMessage()
            break;
        case "diss":
            layoutBtn(ctx, true, "PROVA")
            break;
        case "dissUser":

            break;
        case "addUser":

            break;
        case "submitDiss":

            break;
        case "meText":
            ctx.deleteMessage()            
            ctx.reply(insulto)
            break;
        case "meVoice":
            ctx.deleteMessage()           
            ctx.replyWithVoice({ url: `http://api.voicerss.org/?key=bf5dfed7ee12431fbb778d7331a36f8e&c=OGG&src=${insulto}` })
            break;
        case "meGif":

            break;
        case "userText":

            break;
        case "userVoice":

            break;
        case "userGif":

            break;
        case "submitDiss":

            break;
        case "submitDiss":

            break;
        case "submitDiss":

            break;
        case "submitDiss":

            break;
        case "submitDiss":

            break;
        default:
            break;
    }

})

bot.command('Diss', (ctx) => {

})
bot.command('Dissme', (ctx) => {

})

bot.command('AddUser', (ctx) => {

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
async function layoutBtn(ctx, deleteMessage = true, title = String, arrayDiOggetti = [{ text: 'Quit', callback_data: 'quit' }]) {
    if (deleteMessage) { ctx.deleteMessage() }
    ctx.reply(title, {
        reply_markup: {
            inline_keyboard: [
                arrayDiOggetti
            ]
        }
    })
}
