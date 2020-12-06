const router = require('express').Router();
const { getBotGuilds, getGuildRoles, getUserGuilds } = require('../utils/api');
const User = require('../database/schemas/User');
const { getMutualGuilds } = require('../utils/utils');
const GuildConfig = require('../database/schemas/ServerConfig');

router.get('/guilds', async (req, res) => {
    const guilds = await getBotGuilds();
    //const user = await User.findOne( { discordId: req.user.discordId } );
    if(req.user) {
        const userGuilds = await getUserGuilds(req.user.discordId);
        const mutualGuilds = getMutualGuilds( userGuilds, guilds);

        res.send( mutualGuilds );
    } else {
        return res.status(401).send({ msg: 'Non autorizzato' });
    }
});

router.put('/guilds/:guildId/prefix', async (req, res) => {
    const { prefix } = req.body;
    const { guildId } = req.params;
    if(!prefix) return res.status(400).send({ msg: 'Inserisci un prefisso.'});
    const update = await GuildConfig.findOneAndUpdate({ guildId }, { prefix }, { new: true });
    return update ? res.send(update) : res.status(400).send({ msg: 'impossibile trovare il documento' });
});

router.get('/guilds/:guildId/config', async (req, res) => {
    const { guildId } = req.params;
    const config = await GuildConfig.findOne({ guildId });
    return config ? res.send(config) : res.status(404).send({ msg: 'non trovato' });
});

router.get('/guilds/:guildId/roles', async (req, res) => {
    const { guildId } = req.params;
    try {
        const roles = await getGuildRoles( guildId );
        res.send(roles);
    } catch (err) {
        console.log(err);
        res.status(400).send({ msg: 'non trovato' });
    }
    return config ? res.send(config) : res.status(404).send({ msg: 'Errore interno del server.' });
});

router.put('/guilds/:guildId/roles/muted', async (req, res) => {
    const { ruoloMutedID } = req.body;
    const { guildId } = req.params;
    if(!ruoloMutedID) return res.status(400).send({ msg: 'Inserisci un ruolo.'});
    try {
        const update = await GuildConfig.findOneAndUpdate({ guildId }, { ruoloMutedID }, { new: true });
        return update ? res.send(update) : res.status(400).send({ msg: 'impossibile trovare il documento' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: 'Errore interno del server.' });
    }
});

module.exports  = router;