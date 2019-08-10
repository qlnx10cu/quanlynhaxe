module.exports = (app, logger, express, path, cookieParser, passport, handlebars, cors, bodyParser) => {
    app.engine('handlebars', handlebars.engine)
    app.set('views', path.join('views'));
    app.set('view engine', 'handlebars');
    app.use(logger('dev'));
    app.use(express.static('public'));
    app.use(express.urlencoded({
        extended: false
    }));
    app.use(express.json({
        limit: '50mb'
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(cors());
}
