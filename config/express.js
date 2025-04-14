const passport = require('passport');
var config = require('./config.js'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    cors = require('cors');

// Create a new Express application instance
module.exports = function () {
    var app = express();

    // Development logging
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    // Updated body parser with increased size limit
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '20mb'
    }));
    app.use(bodyParser.json({ limit: '20mb' }));

    // Basic middleware
    app.use(cookieParser());
    app.use(methodOverride('_method'));

    // Session configuration
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax'
        }
    }));

    // CORS configuration
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
        exposedHeaders: ['Set-Cookie']
    }));

    // Initialize passport
    app.use(passport.initialize());
    require('./passport.js'); // Include the passport configuration

    // View engine setup
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    // Create API router
    const apiRouter = express.Router();

    // Use API router with prefix only in production
    if (process.env.NODE_ENV === 'production') {
        app.use('/api', apiRouter);
    } else {
        app.use('', apiRouter); // No prefix in development
    }

    // Routes - all use the apiRouter
    require('../app/routes/index.server.routes.js')(apiRouter);
    require('../app/routes/users.server.routes.js')(apiRouter);
    require('../app/routes/templates.server.routes.js')(apiRouter);
    require('../app/routes/search.server.routes.js')(apiRouter);
    require('../app/routes/comments.server.routes.js')(apiRouter);

    // Static files
    app.use(express.static('./public'));

    return app;
};
