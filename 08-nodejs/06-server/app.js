const http = require('http')
const url = require('url')
const app = http.createServer()

app.on('request',(req,res)=>{
    console.log(req.method);
    const method = req.method.toLocaleLowerCase();
    const {query,pathname } = url.parse(req.url);
    res.writeHead(200,{
        'content-type':'text/plain;charset=utf-8'
    })
    if(method == 'get'){
        // 路由判断
        if(pathname == '/' || pathname == '/index'){
            res.end('首页');
        }else if(pathname == '/list'){
            res.end('列表')
        }else{
            res.end('不存在')
        }
    }else if(method == 'post'){
        res.end('post不存在')
    }else{
        res.end('不存在333')
    }
})
app.listen(3000);
