process.env.NODE_ENV ?? require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios').default;
const bot = new Telegraf(process.env.TOKEN)


// on start create document in databse with chat id

bot.start((ctx) => {
    ctx.reply('\'SUP')
})

//ctx.update.inline_query.from.id 
//ctx.update.message.entities.id

// show inline keyboard on help. two options: diss user & add diss
// on selection send a callback query with the name of the options as data
bot.help((ctx) => {
    ctx.reply('May I help?', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Diss', callback_data: 'diss' }],
                [{ text: 'AddUser', callback_data: 'addUser' }],
                [{ text: 'SubmitDiss', callback_data: 'addDiss' }],
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
    ctx.reply(' sda', {
        reply_markup: {
            inline_keyboard: [[{ text: 'Me', callback_data: 'me' }], [{ text: 'DissUser', callback_data: 'dissUser' }], [{ text: 'Quit', callback_data: 'quit' }]]
        }
    })
})
bot.command('Diss', (ctx) => {
    ctx.reply(' sda', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Me', callback_data: 'me' }],
                [{ text: 'DissUser', callback_data: 'dissUser' }],
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })
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

})

//action-command to addDiss
bot.action('addDiss', (ctx) => {
    ctx.deleteMessage()
    ctx.reply(' sda', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })
})
bot.command('AddDiss', (ctx) => {

})


//-------------------------------------------------------------------------------------------------------------------
// callback query handler
// use switch statement to handle differente cases
// bot.on('callback_query', (ctx) => {
//     const data = ctx.update.callback_query.data
//     switch (data) {
//         case "dissuser":
//             ctx.reply('who you wanna diss?', {
//                 reply_markup: {
//                     inline_keyboard: [
//                         [{ text: 'Kevin', callback_data: 'kevin' }]
//                         ,
//                         [{ text: 'Dan', callback_data: 'dan' }]                                       <----  RISOLTO COL COMANDO ACTION
//                     ]
//                 }
//             })

//             break;
//         case "adddiss":

//             break;

//         default:
//             break;
//     }

// })
//-------------------------------------------------------------------------------------------------------------------


// handle inline queries
bot.on('inline_query', (ctx) => {
    const { query } = ctx.update.inline_query
    ctx.answerInlineQuery([{ type: 'article', id: 5, title: 'insult', input_message_content: { message_text: `${query}, you suck!` } }])
    console.log(ctx.update.inline_query)
})

// specific command to diss kevin and only kevin
// bot.command('disskevin', async (ctx) => {
//     const insult = await getInsult()
//     const insulto = await getInsulto()
//     ctx.reply('pippo' + insult)
//     ctx.replyWithVoice({ url: `http://api.voicerss.org/?key=${process.env.AUDIO}&hl=en-us&c=OGG&src=${insult}` })
//     ctx.reply('@K_Silvestri: ' + insulto)
//     ctx.replyWithVoice({ url: `http://api.voicerss.org/?key=${process.env.AUDIO}&hl=it-it&c=OGG&src=${insulto}` })

// })

bot.hears(['diss'],)

bot.launch()

// bot.on('text', (ctx) => {
//     const { message } = ctx;
//     console.log(message)
//     console.log(message.entities)
// })

async function getInsult(who = "Giuliano") {
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
