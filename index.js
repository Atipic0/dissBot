process.env.NODE_ENV ?? require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios').default;
const bot = new Telegraf(process.env.TOKEN)

bot.help(async (ctx) => {
    ctx.reply('No help for you punk')
})

bot.hears(['kevin', 'Kevin'], (ctx) => {
    ctx.replyWithPhoto('https://i.insider.com/5229449eecad04c3708b4570?width=1100&format=jpeg&auto=webps')
})

bot.command('disskevin', async (ctx) => {

    const insult = await getInsult()
    const insulto = await getInsulto()
    ctx.reply('@K_Silvestri: ' + insult)
    ctx.replyWithVoice({ url: `http://api.voicerss.org/?key=${process.env.AUDIO}&hl=en-us&c=OGG&src=${insult}` })
    ctx.reply('@K_Silvestri: ' + insulto)
    ctx.replyWithVoice({ url: `http://api.voicerss.org/?key=${process.env.AUDIO}&hl=it-it&c=OGG&src=${insulto}` })

})

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


