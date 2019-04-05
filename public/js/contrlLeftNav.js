window.onload = function(){
/*	var liarr = document.getElementsByTagName('li')
    console.log(liarr)
	for(var i = 0;i<liarr.length;i++){
		liarr[i].onclick=function(){
            for(var j = 0;j<liarr.length;j++){
				liarr[j].style.backgroundColor=''
			}	
			this.style.backgroundColor='#ccc'
		}
	}*/
	/*document.getElementById('weightList').onclick=function(){
		var xhr = new XMLHttpRequest();
		var username = document.getElementById('username').value
		var password = document.getElementById('password').value
		console.log(username);
		xhr.open("get","/weightList");
		console.log('准备进行ajax请求')
		xhr.send()
        xhr.onreadystatechange = function () { // 状态发生变化时，函数被回调-->
        	console.log("发送状态:"+xhr.readyState)
        if (xhr.readyState === 4) { // 成功完成-->
            // 判断响应结果:-->
            if (xhr.status === 200) {
                // 成功，通(过responseText拿到响应的文本:-->
                vm.weightdata = JSON.parse(xhr.responseText)
                vm.hello = '欢迎您,'
                vm.nicheng = xhr.responseText[0].nicheng
                this.loginMessage = ''
                console.log(vm.weightdata)
            }
        }
    }*/
    $('#addWeight').click(function(){
    	$('#weightListDiv .maintable').slideUp(10)
    	$('#addWeightBox').slideDown(500)
    	$('#addWeightBox #addWeightIput').focus()
        $('#deleteHistory').hide(0)
        $('#operationRecord').hide()
    })
    $('#weightList').click(function(){
    	$('#addWeightBox').slideUp(0)
    	$('#weightListDiv .maintable').show(500)
        $('#deleteHistory').hide(0)
        $('#operationRecord').hide()
    })
    $('#deleteRecord').click(function(){
        $('#weightListDiv .maintable').slideUp(10)
        $('#addWeightBox').slideUp(0)
        $('#deleteHistory').show(500)
        $('#operationRecord').hide()
    })
    $('#editRecord').click(function(){
        $('#addWeightBox').slideUp(0)
        $('#weightListDiv .maintable').slideUp(10)
        $('#deleteHistory').hide(0)
        $('#operationRecord').show()
    })
}
