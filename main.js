const [dogpaw,catpaw] = [...document.getElementById('paw-container').children]
let [dog,cat] = ['dogpaw.png','catpaw.png']
let CURRENT_DEVICE = { // current device object with 2 boolean properties
    mobile:false,
    desk:true
}
let mediaDirectory



/* ----------------------------------------- */
// events
window.onload = () => {

    if(isMobileDevice()){
        CURRENT_DEVICE.mobile = true
        CURRENT_DEVICE.desk = false
    }

        setMediaSrc(CURRENT_DEVICE,dogpaw,catpaw)
}
window.onresize = () => {

    if(isMobileDevice()){
        CURRENT_DEVICE.mobile = true
        CURRENT_DEVICE.desk = false
    } else {
        CURRENT_DEVICE.mobile = false
        CURRENT_DEVICE.desk = true
    }

        setMediaSrc(CURRENT_DEVICE,dogpaw,catpaw)

}










/* ----------------------------------------- */
// check if mobile device
function isMobileDevice(){
    return document.body.clientWidth <= 900;
}

function targetMediaDir(currentDevice){
    let dir;
    console.log(currentDevice)
    for(let property in currentDevice){
        if(currentDevice[property]){
            dir = `./media/${property}/`
        }
    }
    // console.log(dir)
    return dir
}

function setMediaSrc(currentDevice,dogpaw,catpaw){
    mediaDirectory = targetMediaDir(currentDevice);
    dogpaw.setAttribute('src',mediaDirectory+dog);
    catpaw.setAttribute('src',mediaDirectory+cat);
}