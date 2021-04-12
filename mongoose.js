const mongoose = require('mongoose');


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


module.exports = Group;