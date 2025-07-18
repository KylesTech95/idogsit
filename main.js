const [dogpaw,catpaw] = [...document.getElementById('paw-container').children]
let [dog,cat] = ['dogpaw.png','catpaw.png']
let CURRENT_DEVICE = { // current device object with 2 boolean properties
    mobile:false,
    desk:true
}
let mediaDirectory




/* ----------------------------------------- */
// form section

// pick a date
const currentDate = parseDate(new Date().toLocaleDateString())
let [month,day,year] = currentDate.split('-');
let nextDay = `${year}-${String(month<10?`0${month}`:month)}-${Number(day<10?`0${day}`:day)+1}`

const [start,end] = [document.getElementById('startDate'),document.getElementById('endDate')]
    // start date
    start.setAttribute('min',nextDay)
    start.oninput = e => {
        console.log(e.currentTarget.value)
        let startdate = parseDate(e.currentTarget.value)
        console.log(startdate)
        // end date
        end.setAttribute('min',startdate)
    }
   


// number of pets
const numInput = document.getElementById('quantity-picker');
const petimg = document.getElementById('pets-img')
numInput.oninput = e => {
    let max = 12;
    while(!e.currentTarget.value){
        if(!petimg.classList.contains('animation-pets-img')){
            petimg.classList.add('animation-pets-img')
        }
        return false;
    }
    petimg.classList.remove('animation-pets-img');
    
    // if number is over 12
    if(+e.currentTarget.value > 12){
        e.currentTarget.value = 12
    }
    // if number is under 1
    if(/((0[0-9])|-)/.test(e.currentTarget.value)){
        e.currentTarget.value = 0
    }


}





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

function parseDate(date){
    let parsed = date.replace(/\//g,'-')
    return parsed
}