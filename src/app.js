require('dotenv').config();
require('./strategies/discord');

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const Store = require('connect-mongo')(session);
const config = require('../../Bot/config.json');
const { graphqlHTTP } = require('express-graphql');
const RootSchema = require('./graphql')
const { backendDomain } = require('./config.json')

const app = express();
const PORT = process.env.PORT || 3002;
const routes = require('./routes');

mongoose.connect(config.mongoUri, {
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
    origin: [ "https://italianhubot-dashboard-backend.herokuapp.com" ],
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

app.listen(PORT, () => console.log(`Girando sulla porta ${PORT}`));