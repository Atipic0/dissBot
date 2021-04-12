const mongoose = require('mongoose');
const mongoUrl = `mongodb+srv://petz:${process.env.MONGOPASS}@cluster0.ccmem.mongodb.net/dissBot?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
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



module.exports.Group = Group;
