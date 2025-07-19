const liveServer = require('live-server')
const bodyparser = require('body-parser')

var params = {
    port:51743,
    host:'0.0.0.0',
    root:require('path').join(__dirname,'./'),
    open:false,
    ignore:null,
    file:'index.html',// name of root file served,
    wait:1000,
    mount:null,
    logLevel:0, // 0 = errors only, 1 = some, 2 = lots
    // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
    middleware:[function(req,res,next){next()},bodyparser.json(),bodyparser.urlencoded({extended:true})], 

}

liveServer.start(params)
console.log("listening on port " + params.port)