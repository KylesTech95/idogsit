const {writeFileSync, existsSync, mkdirSync, readdirSync, rmSync, readFileSync, write} = require('fs');
const path = require('path')
const args = process.argv.slice(2,process.argv.length);
const myProcess = require('process')
const maximumServers = 9;
const dir = readdirSync(path.resolve(__dirname,'servers'));
const packageJson = readFileSync(path.resolve(__dirname,'../package.json'),'utf-8')
const jsonObj = (JSON.parse(packageJson))

let num = +args.find(x=>/^[0-9]+$/g.test(x))||1 // num is default to 1 if no args present
num <= maximumServers && Math.abs(dir.length - num) < maximumServers ? duplicateServerFn(num,dir,jsonObj) : console.log('Maximum server limit: ' + maximumServers);


/**------------------------------------------- */
// functions
function duplicateServerFn(num,directory,jsonObj){
    clearDir(directory)
    createServer(num,jsonObj,{})
    return;
}
function createServer(numberOfServers,jsonObj,options){
    let remake = {};
    // try catch
    try{
        let [objStart,fnExecute] = [
            `let params =`,
            `liveServer.start(params)\nconsole.log("listening on port " + params.port)`
        ]
        function setDefaultParam(options){
            return {
                port:options.port||(3000),
                host:options.host||'127.0.0.1',
                root:options.root||path.resolve(__dirname,'../'),
                open:options.open||false,
                ignore:options.ignore||null,
                file:options.file||'index.html',// name of root file served,
                wait:options.wait||1000,
                mount:options.mount||null,
                logLevel:options.logLevel||2, // 0 = errors only, 1 = some, 2 = lots
                // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
                middleware:options.middleware||null, 
            }
        }
        let packages = [
            `const liveServer = require('live-server')`,
            `const bodyparser = require('body-parser')`
        ]
        packages = packages.join`\n`;
        const outBin = `servers`;
        const dirExists = existsSync(path.resolve(__dirname,outBin));
        
        // iterate through the desied number of servers
        for(let i = 0; i <= numberOfServers-1; i++){
            let fname = `server${i+1}`;
            let filename = `${fname}.js`
            options.port = `${3100+(i)}`

            // check if servers (dir) exists
            if(dirExists){
                writeFileSync(path.resolve(
                __dirname,outBin,filename),
                `${packages}\n\n${objStart}${JSON.stringify(setDefaultParam(options)).split(`,`).join`,\n`}\n\n${fnExecute}`,
                // `${packages}\n\n${objStart}\n${'something'}\n${objEnd}\n${fnExecute}`,
                'utf-8');
            } else {
                setTimeout(()=>{
                    mkdirSync(path.resolve(__dirname,outBin))
                    myProcess.nextTick(()=>{
                        writeFileSync(path.resolve(
                    __dirname,outBin,`server${i+1}.js`),
                    `${packages}\n\n${objStart}${JSON.stringify(setDefaultParam(options)).split(`,`).join`,\n`}\n\n${fnExecute}`,
                    // `${packages}\n\n${objStart}\n${'something'}\n${objEnd}\n${fnExecute}`,
                    'utf-8')
                    })
                },1500)
            }
            // add scripts to package.json
            for(let i in jsonObj){
                if(i === 'scripts'){
                    // console.log(jsonObj[i])
                    jsonObj[i][fname] = `node lib/${outBin}/${filename}`;
                }
              }
        }
            remake = JSON.stringify(jsonObj);
            writeFileSync(path.resolve(__dirname,'../package.json'),remake.split`,`.join`,\n`,'utf-8');
        return;
        }
    catch(err){
        throw new Error(err)
    }
}
function clearDir(dir){
    // console.log("DIR\n"+dir)
    console.log(dir)
    dir.map((d,i)=>rmSync(path.resolve(__dirname,'servers',d))) // rm filesystem)
}
