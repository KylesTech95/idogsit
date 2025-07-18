const {Jimp} = require('jimp');
const path = require('path')
const fs = require('fs');
// file info for conversion
const fileToConvert = fs.readdirSync(path.resolve(__dirname,'input'))[0]||undefined;
// const input = 'input'+"/"+fileToConvert
let input = 'input'+"/"+fileToConvert
const output = 'output';

// input = input.replace(/jpg$/g,'png')

async function convert(input,type,outputBin){
// snatch firstname from input
let filename = input.replace(/input(\\|\/)/g,'').replace(/\.[a-z]{3,4}$/g,'')+".";
let tpe = input.match(/(png|jpg|jpeg|avif)$/)[0];
console.log("CHECKTYPES")
console.log(tpe)
console.log(type)
console.log("TYPE:\n"+tpe+"\n")
console.log(filename)
console.log("FILENAME:\n"+filename)

// if the current type equals desired type, end it
if(tpe === type){
    console.log('Sorry, but your file is already under type ' + tpe===type ? tpe : undefined )
    return false;
} else {
    // read image from input
    const image = await Jimp.read(path.resolve(__dirname,input));
    // switch between the desired file extension
    switch(true){
        case type==='png':
            filename += (type)
        break;
        case type==='jpg':
            filename += (type)
        break;
        case type==='jpeg':
            filename += (type)
        break;
        case type==='avif':
            filename += (type)
        break;
        default:
            console.log(undefined);
    }

    /**----------------------------------------- */
    // resize factory

    image.resize({h:500,w:750})
    image.crop({x:100,y:0,h:275,w:500})


    /**----------------------------------------- */
    // write image to output
    console.log(outputBin)
    image.write(path.resolve(__dirname,outputBin,filename))
    return;
    }
}


convert(input,'png',output);

module.exports = {convert}