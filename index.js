process.env.NODE_ENV ?? require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios').default;
const bot = new Telegraf(process.env.TOKEN)

// DATABASE STUFF
const { Group } = require('./mongoose.js')


// on anything check if its a group, show options only if it is
bot.use(async (ctx, next) => {
    const { chat: { type } } = ctx
    if (type !== 'group') {
        ctx.reply('Dissatron3000 only works in groups, here, have a sip:')
        ctx.reply(await replyWithInsult(ctx))
    } else {
        await next()
    }
})

// on start create document in databse with chat id
// and check if its a group, show options only if it is
bot.start(async (ctx) => {
    const { chat: { id, title } } = ctx
    const groupExists = await Group.findOne({ id }).exec();
    if (!groupExists) {
        const currentGroup = new Group({ id, title })
        currentGroup.save((err) => {
            if (err) return console.error(err);
        });
    }
})

// on every message check if user exists in database
// if it doesnt add it

bot.on(['message'], async (ctx, next) => {
    const { chat: { id: chatId }, from: { id } } = ctx
    const currentGroup = await Group.findOne({ id: chatId })
    const currentUser = { id }
    const userExists = currentGroup.users.find((user) => user.id === id)
    if (!userExists) {
        currentGroup.users.push(currentUser)
        currentGroup.save((err) => {
            if (err) return console.error(err);
        });
    }
    await next()
})

// show inline keyboard on help.
bot.help((ctx) => {
    ctx.reply('May I help?', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'DissTarget', callback_data: 'dissTarget' }],
                [{ text: 'AddTarget', callback_data: 'addTarget' }, { text: 'SubmitDiss', callback_data: 'submitDiss' }],
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })
})
bot.on('callback_query', async (ctx) => {
    const { data } = ctx.update.callback_query
    switch (data) {
        case "quit":
            ctx.deleteMessage()
            break;
        case "dissTarget":
            layoutBtn(ctx, true, "Type @Dissatron3000 and select your target")
            const { chat: { id: chatId } } = ctx
            let inlineQueryListUser;
            const currentGroup = await Group.find({ id: chatId }).then((data) => (inlineQueryListUser = data[0].users))
            console.log(inlineQueryListUser)
            bot.on('inline_query', async (ctx) => {
                const { query } = ctx.update.inline_query
                ctx.answerInlineQuery([{ type: 'article', id: 5, title: `${inlineQueryListUser}`, input_message_content: { message_text: "Se laterr fosse quando finalmente capiró come far funzionare sto coso...MAI", } }])
            })
            break;
        case "addTarget":
            layoutBtn(ctx, true, "Send, in chat, the contact of the person to add.")
            bot.on('contact', async (ctx) => {
                const { message: { contact: { user_id, first_name } }, from: { user_id: sender_id, first_name: sender_name }, chat: { id: chatId } } = ctx
                const currentGroup = await Group.findOne({ id: chatId }).exec();
                const currentUser = { id: user_id }
                const userExists = currentGroup.users.find((user) => user.id === user_id)
                if (!userExists) {
                    currentGroup.users.push(currentUser)
                    currentGroup.save((err) => {
                        if (err) return console.error(err);
                        ctx.reply(`Get ready to be insulted  [${first_name}](tg://user?id=${user_id})!
                        You were added to Dissatron3000 by [${sender_name}](tg://user?id=${sender_id}) `, { parse_mode: 'MarkdownV2' })
                    });
                } else {
                    ctx.reply(`the user is already in the database`, { parse_mode: 'MarkdownV2' })
                }
            })
            break;
        case "submitDiss":

            break;
        default:
            break;
    }

})


bot.launch()

async function getInsult() {
    try {
        const response = await axios.get('https://insult.mattbas.org/api/insult.txt');
        return response.data
    } catch (error) {
        console.error(error);
    }
}
async function getInsulto() {
    try {
        const response = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json');
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
async function replyWithInsult(ctx) {
    let insulto = await getInsulto()
    ctx.reply(insulto)
}
