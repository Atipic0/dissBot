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
});

const groupSchema = new mongoose.Schema({
    id: String,
    users: [Object],
    group_insults: [String]
});

const Group = mongoose.model('Group', groupSchema)


// on start create document in databse with chat id

bot.start((ctx) => {
    const { chat } = ctx
    const { id } = chat

    const currentGroup = new Group({ id })

    currentGroup.save((err) => {
        if (err) return console.error(err);
        ctx.reply(`added group with id: ${id}`)
    });

})
// on every message
bot.on('text', async (ctx) => {

    const { chat } = ctx
    const { id: chatId } = chat
    const { from } = ctx
    const { id } = from

    const currentGroup = await Group.findOne({ id: chatId }).exec();
    const currentUser = { id }

    const users = currentGroup.users
    const userExists = users.find((user) => user.id === id)
    if (!userExists) {
        currentGroup.users.push(currentUser)
        currentGroup.save((err) => {
            if (err) return console.error(err);
        });
    }
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


// handle inline queries
bot.on('inline_query', (ctx) => {
    const { query } = ctx.update.inline_query
    ctx.answerInlineQuery([{ type: 'article', id: 5, title: 'insult', input_message_content: { message_text: `${query}, you suck!` } }])
    console.log(ctx.update.inline_query)
})

bot.launch()

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
