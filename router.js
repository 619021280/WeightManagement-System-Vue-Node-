var express = require('express')
var fs = require('fs')
var router = express.Router()
var methods = require('./method.js')


router.get('/',function(req,res){
	var cookie = req.signedCookies
	if(cookie.cks == undefined){
		fs.readFile('./Views/index.html',function(err,page){
			if (err) { throw err}
				return res.send(page.toString())
		})
		return ;
	}
	methods.findUser(cookie.cks,function(err,result){
		if(err){
			throw err
		}
		if (result.length != 0) {
			req.session.username = result[0].username,
			req.session.password = result[0].password,
			req.session.nicheng = result[0].nicheng
			fs.readFile('./Views/index.html',function(err,page){
				if (err) { throw err}
					return res.send(page.toString())
			})
		}
	})
})

router.post('/test',function(req,res){
	methods.login(req.body,function(err,result){
		if (err) {
			return res.status(200).send('账号或密码输入错误,请重新输入')
		}
		if (result.length != 0) {
			methods.findAll(result[0].nicheng,function(err,weight){
				res.cookie('cks',result[0].nicheng,
				{
					maxAge:30*60*60*1000,
					httpOnly:true,
					signed:true
				})
				req.session.username = result[0].username,
				req.session.password = result[0].password,
				req.session.nicheng = result[0].nicheng
				if (weight.length == 0) {
					return res.status(200).send(result[0].nicheng)
				}else{
					return res.status(200).send(weight)
				}	
			})
		}else{
			return res.status(200).send('账号或密码输入错误,请重新输入')
		}
	})
})

router.get('/weightList',function(req,res){
	var cookie = req.signedCookies
	if(req.signedCookies.cks == undefined){
		return res.send(false)
	}else{
		cookie = JSON.stringify(cookie)
		cookie = JSON.parse(cookie)
		methods.findAll(cookie.cks,function(err,weight){
			if(weight.length){
				if (weight.length == 0) {
					console.log(weight)
					return res.status(200).send(req.session.nicheng)
				}else{
					return res.status(200).send(weight)
				}

			}
		})
	}
})


router.get('/addWeight',function(req,res){
	if (req.session.username == undefined) {
		res.status(200).send(false)
	}else{
		methods.addWeight(req.query.weight,req.session.nicheng,function(err,result){
			if (err) {
				return	res.status(500).send('添加失败')
			}
			return res.status(200).send(true)
		})
	}
})

router.get('/delete',function(req,res){
	if(req.session.nicheng){
		methods.delete(req.query.NO,function(err,result){
			methods.findAll(req.session.nicheng,function(err,weight){
				if (weight.length == 0) {
					console.log(weight)
					return res.status(200).send(req.session.nicheng)
				}else{
					return res.status(200).send(weight)
				}
			})
		})
	}
	
})

router.get('/editWeight',function(req,res){
	if(req.session.nicheng){
		methods.edit(req.query,function(err,result){
			if (result) {
				methods.findAll(req.session.nicheng,function(err,weight){
					if (weight.length == 0) {
						console.log(weight)
						return res.status(200).send(req.session.nicheng)
					}else{
						return res.status(200).send(weight)
					}
				})
			}
		})
	}
})

router.get('/sendMail',function(req,res){
	methods.createYzm(req.query,function(yzm){
		var start = Date.now()
		if(req.session.time){
			var endTime = Date.now()
			if(endTime-req.session.time<30000){
				res.send('发送频繁,请稍后再试')
				return false
			}else{
				mail = req.query.mail+'@qq.com'
				subject='小槑网(www.xiaomei.com)账号注册'
				html = '注册验证码：'+yzm+'，您正在使用邮箱“注册”小槑网帐号，有效时间10分钟。如非本人操作，请忽略此邮件！'
				methods.sendMail(mail,subject,html,function(result){
					console.log(result)
					if(result == false){
						res.send('请检查邮箱')
					}else{
						req.session.yzm=yzm
						req.session.time=start
						res.send(true)
					}
				})
				return false
			}
		}
		if(!req.session.yzm){
			mail = req.query.mail+'@qq.com'
			subject='小槑网(www.xiaomei.com)账号注册'
			html = '注册验证码：'+yzm+'，您正在使用邮箱“注册”小槑网帐号，有效时间10分钟。如非本人操作，请忽略此邮件！'
			methods.sendMail(mail,subject,html,function(result){
				console.log(result)
				if(result == false){
					res.send('请检查邮箱')
				}else{
					req.session.yzm=yzm
					req.session.time=start
					res.send(true)
				}
			})
		}
	})
})

router.post('/getSession',function(req,res){
	var end = Date.now()
	console.log(req.session)
	if(req.session.yzm){
		if(req.session.time){
			if(end-req.session.time<10*60*1000){
				if(req.session.yzm==req.body.yzm){
					//此处调用方法  存储到数据库里面
					methods.signUser(req.body,function(err,result){
						if (err) {
							return	res.status(500).send('添加失败')
						}
						console.log('注册成功')
						res.send('注册成功')
						return true
					})
				}else{
					console.log('验证码错误')
					res.send('验证码错误')
				}
			}else{
				console.log('验证码超时')
				
				res.send('验证码超时,请重新获取')
				return false
			}
		}
	}else{
		console.log('请先获取验证码')
		res.send('请先获取验证码')
		return false
	}
})

router.get('/weightListDelete',function(req,res){
	if(req.session.nicheng){
		methods.findAllDelete(req.session.nicheng,function(err,weight){
			if (weight.length == 0) {
				return res.status(200).send('')
			}else{
				return res.status(200).send(weight)
			}
		})
	}else{
		return res.status(200).send('')
	}
})

router.get('/exit',function(req,res){
	req.session.destroy()
	res.clearCookie('cks')
	res.redirect('/')
})

module.exports = router