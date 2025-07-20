const liveServer = require('live-server')
const bodyparser = require('body-parser')

let params ={"port":"3102",
"host":"127.0.0.1",
"root":"/Users/primaryuser/Desktop/idogsit",
"open":false,
"ignore":null,
"file":"index.html",
"wait":1000,
"mount":null,
"logLevel":2,
"middleware":null}

liveServer.start(params)
console.log("listening on port " + params.port)