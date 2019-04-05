var express = require('express')
var fs = require('fs')
var router = require('./router.js')
var bodyParser = require('body-Parser')
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
var session = require('express-session');

var app = express()
app.use('/public/',express.static('./public/'))
app.use('/node_modules/',express.static('./node_modules/'))
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())
app.use(cookieParser('sadbjakjkadsjd'));
app.use(session({
	secret: 'keyboard cat',
	resave:true,
	saveUninitialized: true,
	duration: 1000,
	activeDuration: 30*60*1000,
	cookie: {
		secure: false,
		maxAge: 30*60*1000
	 }
}));
app.use(router)

process.on("uncaughtException",function(err){
	console.log('发生错误了')
})

app.listen(80,function(){
	console.log('running in 80...')
})

module.exports = app