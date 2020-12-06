const router = require('express').Router();
const passport = require('passport');
const { domain } = require('../config.json')

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    res.redirect( domain + '/menu');
});

router.get('/', (req, res) => {
    if(req.user) {
        res.send(req.user);
    } else {
        res.status(401).send({msg: 'Unauthorized'});
    }
})

module.exports  = router;