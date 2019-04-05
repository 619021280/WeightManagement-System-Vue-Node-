var mysql = require('mysql');
var sd = require('silly-datetime');
var crypto = require('crypto')
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./mailconfig')

smtpTransport = nodemailer.createTransport(smtpTransport({
	service: config.email.service,
	auth: {
		user: config.email.user,
		pass: config.email.pass
	}
}));

exports.login = function(user,callback){
	username = user.username
	password = user.password
	console.log(typeof username)
	username = JSON.stringify(username)
	password = JSON.stringify(password)
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'123',
		port:'3306',
		database:'reduceweight',
		dateStrings: true
	})
	connection.connect()
	var sql='select * from user where username='+username+' and password='+password
	connection.query(sql,function(err,result){
		if(err){
			console.log('[登录错误1:] - ',err.message);
			callback(err)
			return;
		}
		result = JSON.stringify(result)
		result = JSON.parse(result)
		callback(null,result)
		connection.end()
	})
}

exports.findAll = function(nicheng,callback){
	nicheng = JSON.stringify(nicheng)
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'123',
		port:'3306',
		database:'reduceweight',
		dateStrings: true
	})
	connection.connect()
	var sql='select * from weight where nicheng='+nicheng+' and dispaly=1 order by day desc'
	console.log(sql)
	connection.query(sql,function(err,result){
		if(err){
			console.log('[登录错误2:] - ',err.message);
			callback(err)
			return;
		}
		result = JSON.stringify(result)
		result = JSON.parse(result)
		callback(null,result)
		connection.end()
	})
}

exports.findAllDelete =  function(nicheng,callback){
	nicheng = JSON.stringify(nicheng)
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'123',
		port:'3306',
		database:'reduceweight',
		dateStrings: true
	})
	connection.connect()
	var sql='select * from weight where nicheng='+nicheng+' and dispaly=0 order by deleteday desc'
	console.log(sql)
	connection.query(sql,function(err,result){
		if(err){
			console.log('[查找已经删除的错误:] - ',err.message);
			callback(err)
			return;
		}
		result = JSON.stringify(result)
		result = JSON.parse(result)
		callback(null,result)
		connection.end()
	})
}

exports.findUser = function(username,callback){
	username = JSON.stringify(username)
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'123',
		port:'3306',
		database:'reduceweight',
		dateStrings: true
	})
	connection.connect()
	var sql='select * from user where nicheng='+username
	connection.query(sql,function(err,result){
		if(err){
			console.log('[登录错误:] - ',err.message);
			callback(err)
			return;
		}
		result = JSON.stringify(result)
		result = JSON.parse(result)
		callback(null,result)
		connection.end()
	})
}

exports.addWeight = function(weight,nicheng,callback){
	var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'123',
		port:'3306',
		database:'reduceweight',
		dateStrings: true
	})
	connection.connect()
	var sql='select max(NO) as maxno from weight'
	connection.query(sql,function(err,result){
		if(err){
			console.log('查询错误1(FindById): ',err.message);
			return;
		} 
		result = JSON.stringify(result)
		result = JSON.parse(result)
		var maxno = result[0].maxno
		maxno++
		var addSql = 'insert into weight(day,weight,NO,updateday,nicheng,dispaly) values (?,?,?,?,?,?)'
		var addSqlParams = [time,weight,maxno,time,nicheng,1]
		connection.query(addSql,addSqlParams,function(err,result){
			if(err){
				console.log('[增加体重错误:] - ',err.message);
				callback(err)
				return;
			}
			if(result.affectedRows == 1){
				callback(null,true)
			}	
		})
		connection.end()
	})
}

exports.delete = function(id,callback){
	var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
	time = JSON.stringify(time)
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'123',
		port:'3306',
		database:'reduceweight',
		dateStrings: true
	})
	connection.connect()
	var sql='update weight set dispaly=false,deleteday='+time+' WHERE NO='+id
	console.log(sql)
	connection.query(sql,function(err,result){
		if(err){
			console.log('[登录错误:] - ',err.message);
			callback(err)
			return;
		}
		result = JSON.stringify(result)
		result = JSON.parse(result)
		if(result.affectedRows == 1){
			callback(null,true)
		}	
		connection.end()
	})
}

exports.edit = function(mes,callback){
	var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
	time = JSON.stringify(time)
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'123',
		port:'3306',
		database:'reduceweight',
		dateStrings: true
	})
	connection.connect()
	var sql='update weight set weight='+mes.weight+',updateday='+time+' where NO='+mes.NO
	console.log(sql)
	connection.query(sql,function(err,result){
		if(err){
			console.log('[修改错误:] - ',err.message);
			callback(err)
			return false;
		}
		result = JSON.stringify(result)
		result = JSON.parse(result)
		if(result.affectedRows == 1){
			callback(null,true)
		}	
		connection.end()
	})
}

exports.createYzm=function(mail,callback){
	var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
	var md5 = crypto.createHash('md5')
	md5.update(mail+time)
	callback(md5.digest('hex').slice(0,6))
}

exports.sendMail=function (recipient, subject, html,callback) {

	smtpTransport.sendMail({

		from: config.email.user,
		to: recipient,
		subject: subject,
		html: html

	}, function (error, response) {
		if (error) {
			console.log(error)
			callback(false)
			return false
		}
		console.log(response.messageId)
		callback(true)
	});
}

exports.signUser=function(user,callback){
	var nicheng = user.signNicheng
	var username = user.signUsername
	var password = user.signPassword
	var mail = user.mail+'@qq.com'
	nicheng = JSON.stringify(nicheng)
	username = JSON.stringify(username)
	password = JSON.stringify(password)
	mail = JSON.stringify(mail)
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'123',
		port:'3306',
		database:'reduceweight',
		dateStrings: true
	})
	connection.connect()
	var sql='insert into user values('+username+','+password+','+nicheng+','+mail+')'
	console.log(sql)
	connection.query(sql,function(err,result){
		if(err){
			console.log('[添加用户错误:] - ',err.message);
			callback(err)
			return false;
		}
		result = JSON.stringify(result)
		result = JSON.parse(result)
		if(result.affectedRows == 1){
			callback(null,true)
		}	
		connection.end()
	})
}