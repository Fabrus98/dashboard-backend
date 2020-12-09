require('dotenv').config();
require('./strategies/discord');

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const Store = require('connect-mongo')(session);
const { graphqlHTTP } = require('express-graphql');
const RootSchema = require('./graphql')
const { backendDomain, mongoUri } = require('./config.json')

const app = express();
const PORT = process.env.PORT;
const routes = require('./routes');

mongoose.connect(mongoUri, {
    poolSize: 2,
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use( cors( {
    origin: [ "https://italianhubot-dashboard-backend.herokuapp.com:4000" ],
    credentials: true,
}))

app.use(session( {
    secret: 'secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: RootSchema,
}));

app.use('/api', routes);

//app.listen(PORT, () => console.log(`Girando sulla porta ${PORT}`));

var server = app.listen(PORT || 8080, function () {
    var port = server.address().port;
    console.log("Girando sulla porta: ", port);
  });