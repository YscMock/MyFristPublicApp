const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url');
var users = {};
var server = http.createServer(function(req,res){
      
      //console.log("hao")
      var str = ""
     req.on('data',function(data){
           str += data  //分段把数据存入变量str里
     });
     req.on('end',function(){ //一次性接受完回调处理业务逻辑
         var obj = urlLib.parse(req.url, true);
         console.log(obj)
         const url = obj.pathname; //接口
         const GET = obj.query; //解析过后的json格式的键值对get所传参数；
         const POST = querystring.parse(str); //post提交时单令行传入数据，而get是存在url里面。
         if(url=="/user"){
            switch(GET.act){ //区别接口
                  case 'reg':
                  if(users[GET.user]){
                        res.write('{"ok":"false","msg":"此用户已存在"}')
                  }else{
                        users[GET.user]=GET.pass;
                        res.write('{"ok":"true","msg":"注册成功"}')
                  }
                  break;
                  case 'login':
                  if(users[GET.user]==null){
                        res.write('{"ok":"false","msg":"此用户不存在"}')
                  }else if(users[GET.user]!=GET.pass){
                         res.write('{"ok":"false","msg":"用户名密码错误"}')
                  }else{
                        res.write('{"ok":"true","msg":"登陆成功"}') 
                  }
                  break;
                  default:
                  res.write('{"ok":"false","msg":"未知的act"}')
            }
              res.end();
         }else{
                 var flie_name = './www'+url;
                 fs.readFile(flie_name,function(err,data){
                       if(err){
                             res.write('404')
                       }else{
                             res.write(data);
                       }
                        res.end();
                 })
         }
   })
      
})
server.listen(8083)