import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session'
import route from './routes/index'
import { connect } from './utils/mongodb'
import bodyParser from 'body-parser'

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('blog_node_cookie'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(
	session({
		secret: 'blog_node_cookie',
		name: 'session_id', //# 在浏览器中生成cookie的名称key，默认是connect.sid
		resave: true,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 1000 * 30, httpOnly: true }, //过期时间
	}),
);


// 连接数据库
connect();

// 304
app.get('/*', function(req, res, next){
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

//初始化所有路由
route(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
