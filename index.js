process.env.NODE_ENV ?? require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios').default;
const mongoose = require('mongoose');
const bot = new Telegraf(process.env.TOKEN)

// DATABASE STUFF
const mongoUri = `mongodb+srv://petz:${process.env.MONGOPASS}@cluster0.ccmem.mongodb.net/dissBot?retryWrites=true&w=majority`
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    console.log("DB Connected")
});

const groupSchema = new mongoose.Schema({
    id: String,
    title: String,
    users: [Object],
    group_insults: [String]
});
const Group = mongoose.model('Group', groupSchema)
const userSchema = new mongoose.Schema({
    id: String,
    insults_created: [Object],
    insults_personal: [Object]
});
const insultSchema = new mongoose.Schema({
    id: String,
    text: String,
    created_by: String,
    created_for: String
});

// on anything check if its a group, show options only if it is
bot.use(async (ctx, next) => {
    const { chat: { type } } = ctx

    if (type !== 'group') {
        ctx.reply('Dissatron3000 only works in groups, you punk!')
    } else {
        await next()
    }
})

// on start create document in databse with chat id
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

bot.on('message', async (ctx, next) => {
    const { chat: { id: chatId }, from: { id } } = ctx
    const currentGroup = await Group.findOne({ id: chatId })
    const currentUser = { id }
    const users = currentGroup.users
    const userExists = users.find((user) => user.id === id)
    if (!userExists) {
        currentGroup.users.push(currentUser)
        currentGroup.save((err) => {
            if (err) return console.error(err);
        });
    }
    await next()
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


// action-command to addUser
bot.action('addUser', (ctx) => {

    ctx.deleteMessage()
    ctx.reply('send the contact of the person in the chat!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Quit', callback_data: 'quit' }],
            ]
        }
    })




})

bot.on('contact', async (ctx) => {
    const { message: { contact: { user_id, first_name } }, from: { user_id: sender_id, first_name: sender_name }
    } = ctx
    const { chat: { id: chatId } } = ctx
    const currentGroup = await Group.findOne({ id: chatId }).exec();
    const currentUser = { id: user_id }
    const users = currentGroup.users
    const userExists = users.find((user) => user.id === user_id)
    if (!userExists) {
        currentGroup.users.push(currentUser)
        currentGroup.save((err) => {
            if (err) return console.error(err);
            ctx.reply(`Ready to be insulted  [${first_name}](tg://user?id=${user_id}) ?
You were added to Dissatron3000 by [${sender_name}](tg://user?id=${sender_id}) 
                `, { parse_mode: 'MarkdownV2' })
        });

    } else {
        ctx.reply(`the user is already in the database`, { parse_mode: 'MarkdownV2' })
    }
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
})

bot.launch()

async function getInsult(who = "Kevin") {
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
