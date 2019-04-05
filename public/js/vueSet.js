var vm = new Vue({
	el:'#app',
	data:{
		test:'',
		weightdata:'',
		loginvalue:'登录',
		hello:'你好,请',
		loginMessage:'登录',
		nicheng:'',
		weightNumber:'',
		deleteNumber:'',
		login:false,
		editDay:'',
		editWeight:'',
		editNo:'',
		afterEdit:'',
		mail:'',
		signNicheng:'',
		signUsername:'',
		signPassword:'',
		yzm:'',
		signTips:'',
		weightdataDelete:'',
		leftNevId:'1'
	},
	methods:{
		post:function(){
			this.loginvalue="登陆中。。。"
			if (document.getElementById('username').value==''||document.getElementById('password').value=='') {
				this.test = "账号或密码不能为空!!!"
				this.loginvalue="登录"
				return false
			}else{
				var username = document.getElementById('username').value
				var password = document.getElementById('password').value
				this.$http.post('/test',{username:username,password:password}).then((response)=>{
					if (response.data!='账号或密码输入错误,请重新输入') {
						$('.loginMask').hide()
						$('.loginBox').slideUp(200)
						console.log(typeof response.data)
						if (typeof response.data == 'string') {
							this.weightdata = ''
							this.hello = '欢迎您,'
							this.nicheng = response.data
							this.loginMessage = ''
							this.login=true
						}
						if (typeof response.data == 'object') {
							this.weightdata = ''
							this.weightdata = response.data
							this.hello = '欢迎您,'
							this.nicheng = response.data[0].nicheng
							this.loginMessage = ''
							this.login=true
						}
					}else{
						this.test = response.data
						this.loginvalue="登录"
						this.login=false

					}
				},function(){
					this.test = '请求失败哦'
				})
			}

		},
		addWeight:function(){
			this.$http.get('/addWeight?weight='+this.weightNumber).then((response)=>{
				if(response.data == false){
					$('.loginMask').show()
					$('.loginBox').slideDown(200)
				}else if(response.data == '添加失败'){
					console.log('添加失败')
				}else{
					console.log('添加成功')
				}
			},function(){
				this.test = '请求失败哦'
			})
		},
		weightList:function(){
			this.leftNevId=1
			this.$http.get('/weightList').then((response)=>{
				if (typeof response.data == 'string') {
					this.weightdata = ''
					this.hello = '欢迎您,'
					this.nicheng = response.data
					this.loginMessage = ''
				}
				if (typeof response.data == 'object') {
					this.weightdata = ''
					this.weightdata = response.data
					this.hello = '欢迎您,'
					this.nicheng = response.data[0].nicheng
					this.loginMessage = ''
				}
			},function(){
				console.log('请求失败')
			})
		},
		contrlDelete:function(date){
			$(".deleteMask").show()
			$(".deleteBox").show()
			this.deleteNumber=date
		},
		comfirmDelete:function(){
			this.$http.get('/delete?NO='+this.deleteNumber).then((response)=>{
				if (typeof response.data == 'object') {
					this.weightdata = ''
					this.weightdata = response.data
					this.hello = '欢迎您,'
					this.nicheng = response.data[0].nicheng
					this.loginMessage = ''
				}
				if (typeof response.data == 'string') {
					this.weightdata = ''
					this.hello = '欢迎您,'
					this.nicheng = response.data
					this.loginMessage = ''
				}
				$(".deleteMask").hide()
				$(".deleteBox").hide()
			},function(){
				console.log('请求失败')
			})
		},
		cancleDelete:function(){
			$(".deleteMask").hide()
			$(".deleteBox").hide()
		},
		exit:function(){
			this.$http.get('/exit').then((response)=>{
				this.login=false
				this.weightdata=''
				this.loginvalue='登录'
				this.hello='你好,请'
				this.loginMessage='登录'
				this.nicheng=''
			},function(){
				console.log('请求失败')
			})
		},
		cancleEdit:function(){
			$(".editMask").hide()
			$(".editBox").hide()
		},
		comfirmEdit:function(){
			this.$http.get('/editWeight?NO='+this.editNo+'&weight='+this.afterEdit).then((response)=>{
				if (typeof response.data == 'object') {
					this.weightdata = ''
					this.weightdata = response.data
					this.hello = '欢迎您,'
					this.nicheng = response.data[0].nicheng
					this.loginMessage = ''
				}
				if (typeof response.data == 'string') {
					this.weightdata = ''
					this.hello = '欢迎您,'
					this.nicheng = response.data
					this.loginMessage = ''
				}
				$(".editMask").hide()
				$(".editBox").hide()
			},function(){
				console.log('请求失败')
			})
		},
		contrlEdit:function(NO,weight,day){
			$(".editMask").show()
			$(".editBox").show()
			$('#editInput').focus()
			this.editDay=day
			this.editWeight=weight
			this.editNo=NO
		},
		sendMail:function(){
			this.$http.get('/sendMail?mail='+this.mail).then((response)=>{
				if(response.data==true){
					$('#sendMail').attr("disabled",true)
					var i = 10
					var test =  setInterval(function(){
						$('#sendMail').html('重新发送验证码('+i+')');
						i--
						if(i==0){
							clearInterval(test)
							$('#sendMail').attr("disabled",false)
							$('#sendMail').html('重新发送验证码')
						}
					},1000)
				}else{
					console.log(response.data)
					$('#sendMail').html(response.data);
				}
			},function(){
				console.log('请求失败')
			})
		},
		getSession:function(){
			this.$http.post('/getSession',{signNicheng:this.signNicheng,signUsername:this.signUsername,signPassword:this.signPassword,mail:this.mail,yzm:this.yzm}).then((response)=>{
				this.signTips=response.data
			},function(){
				console.log('请求失败')
			})
		},
		weightListDelete:function(){
			this.leftNevId=4
			this.$http.get('/weightListDelete').then((response)=>{
				this.weightdataDelete = response.data
			},function(){
				console.log('请求失败')
			})
		}
	},
	created:function(){
		this.$http.get('/weightList').then((response)=>{
			console.log(response)
			if (typeof response.data == 'string') {
				this.weightdata = ''
				this.hello = '欢迎您,'
				this.nicheng = response.data
				this.loginMessage = ''
				this.login=true
			}
			if (typeof response.data == 'object') {
				this.weightdata = ''
				this.weightdata = response.data
				this.hello = '欢迎您,'
				this.nicheng = response.data[0].nicheng
				this.loginMessage = ''
				this.login=true
			}
		},function(){
			console.log('请求失败')
		})
	}
})