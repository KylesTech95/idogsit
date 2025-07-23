const liveServer = require('live-server')
const bodyparser = require('body-parser')
const path = require('path')

let middleware = [
    bodyparser.json(),
    bodyparser.urlencoded({extended:true}),
    function(req,res,next){
        // method
        if(req.path==='/schedule' && req.method ==='POST'){
            console.log(req.body)
        }


        next()
    }
]
let params ={"port":"3100",
"host":"127.0.0.1",
"root":"C:\\Users\\Kyles\\OneDrive\\Desktop\\idogsit",
"open":false,
"ignore":null,
"file":"index.html",
"wait":1000,
"mount":['../../node_modules'],
"logLevel":2,
"middleware":middleware}

liveServer.start(params)
console.log("listening on port " + params.port)