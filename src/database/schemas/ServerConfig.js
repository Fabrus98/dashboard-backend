const mongoose = require('mongoose');

const serverConfigSchema = new mongoose.Schema( {
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    serverName: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: false,
    },
    prefix: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: '!',
    },
    ruoloStandardID: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    ruoloMutedID: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    ruoliAssegnabili: {
        type: mongoose.SchemaTypes.Array,
        required: false,
    },
    logChannelID: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    minorLogChannelID: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    globalLogChannelID: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    reportChannelID: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    adminTrackerValue: {
        type: mongoose.SchemaTypes.Number,
        required: false,
    },
    unmuteTime: {
        type: mongoose.SchemaTypes.Number,
        required: false,
        default: 6,
    },
});

module.exports = mongoose.model('serverConfig', serverConfigSchema);