const router = require('express').Router();
const passport = require('passport');
const { frontendDomain } = require('../config.json')

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    //res.redirect( frontendDomain + '/menu');
    res.redirect( 'https://italianhubot.it:2053/menu');
});

router.get('/', (req, res) => {
    if(req.user) {
        res.send(req.user);
    } else {
        res.status(401).send({msg: 'Unauthorized'});
    }
})

module.exports  = router;