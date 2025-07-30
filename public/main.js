const [dogpaw,catpaw] = [...document.getElementById('paw-container').children]
const navlistitems = document.querySelectorAll('.nav-list-item')
const form = document.getElementById('book-id')
let com = document.getElementById('com')
let [dog,cat] = ['dogpaw.png','catpaw.png']
let animals = ['dog-run','puppy','dog-play'];
const servicesListContainer = document.getElementById('services-list-container');
const servicesListItems = [...servicesListContainer.children].filter((x,y)=>x.tagName === 'LI');
const hr_services = document.querySelector('.hr-services');
const service_images = ['behavior','bowl','monitor','treatment','waste']
let CURRENT_DEVICE = { // current device object with 2 boolean properties
    mobile:false,
    desk:true
}
let mediaDirectory
switchBanner(document.getElementById('banner-img'),animals,8)
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
    // console.log(e.currentTarget.value)
    let startdate = parseDate(e.currentTarget.value)
    // console.log(startdate)
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
    if(+e.currentTarget.value > max){
        e.currentTarget.value = max
    } 
    // if number is under 1
    if(/((0[0-9])|-)/.test(e.currentTarget.value)){
        e.currentTarget.value = 0
    }


}

/* ----------------------------------------- */
// events
window.onload = () => {
const hr = document.getElementById('hr-main')
    if(isMobileDevice()){
        CURRENT_DEVICE.mobile = true
        CURRENT_DEVICE.desk = false
    }
        setMediaSrc(CURRENT_DEVICE,dogpaw,catpaw)

        // configure hr for header
        // hr.style.top = document.getElementById('header').getBoundingClientRect().y + "px"
        hr.style.top = document.getElementById('header').getBoundingClientRect().y + document.getElementById('header').clientHeight

        // configure services container
        document.body.clientWidth > 900 ? createServicesColumns(hr_services,servicesListItems,true) : createServicesColumns(hr_services,servicesListItems,false);
        
        servicesListItems.map((item,index) => {
            // console.log(item);
            const img = new Image();
            const path = './media/services/', ext = '.png'
            img.src = path + service_images[index] + ext;
            img.classList.add('services-img')

            // append image to li
            // servicesListContainer.appendChild(img)
            item.insertBefore(img,item.children[0])
        })

    
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

                document.body.clientWidth > 900 ? createServicesColumns(hr_services,servicesListItems,true) : createServicesColumns(hr_services,servicesListItems,false);

}
window.onscroll = (e) => {
    const ceiling = document.body.scrollTop;
    const scrollY = window.scrollY;

    // console.log(scrollY > ceiling)
    // change bg header
    if(scrollY > ceiling){
        document.getElementById('header').classList.add('scroll-header-bg');
        nav.children[0].classList.add('enlarge-list-container')
        // navlistitems.forEach(item=>item.classList.add('enlarge-list-item'))
        com.classList.add('com-yellow')
    }else{
        document.getElementById('header').classList.remove('scroll-header-bg')
        nav.children[0].classList.remove('enlarge-list-container')
        
        // navlistitems.forEach(item=>item.classList.remove('enlarge-list-item'))
        com.classList.remove('com-yellow')
    }
}

// submit form
let radios = [...document.querySelectorAll('input')].filter(y=>y.type==='radio')
const payload = {startDate:undefined,endDate:undefined,age:undefined,quantity:undefined,proof_of_vaccination:undefined}
let ageVal;
form.onsubmit = e => {
    e.preventDefault();
    let currentCheckedRadio = radios.find(r=>r.checked)
    // console.log(currentCheckedRadio.value)
    // postFetch('/book/submission',{data:[...document.querySelectorAll('input')].map(v=>v.value)})
    let values = [...document.querySelectorAll('input')].filter(y=>!/(radio|submit)/ig.test(y.type)).map(v=>v.value).concat(currentCheckedRadio.value);
    payload.startDate = values[0]
    payload.endDate = values[1]
    payload.quantity = values[2]
    payload.proof_of_vaccination = values[3]

    postFetch('/book',payload)
    setTimeout(()=>{
        window.location.href = window.location.origin + "/book/submission"
    },1000)
}
/* ----------------------------------------- */
// check if mobile device
function isMobileDevice(){
    return document.body.clientWidth <= 900;
}

function targetMediaDir(currentDevice){
    let dir;
    // console.log(currentDevice)
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

// switch banner fn
function switchBanner(banner,images,seconds){
    images.forEach((img,idx)=>{
        setInterval(()=>{
        banner.src = `./media/${img}.png`
    },(seconds*1000)*((idx+1)))
    })
    
}

function adjustContainerHeight(container,lastItem){
    let padding = 10;
    let yPos = lastItem.getBoundingClientRect().y + padding;
    container.style.height = (yPos) + 'px';
    return;
}

function createServicesColumns(hr_services,servicesListItems,bool){
    // what we do (services)
     if(bool==true){
        // console.log(servicesListItems)
        const [left,right] = [5, hr_services.getBoundingClientRect().x+5];
        for(let i = 0; i < servicesListItems.length; i++){
            
            
        } 
     } 

     if(bool==false){
        for(let i = 0; i < servicesListItems.length; i++){
            servicesListItems[i].classList.remove('absolute')
        }
     }
}

async function postFetch(url,data){
   return await fetch(url, {headers:{'Content-Type':'Application/json'},method:'POST',body:JSON.stringify(data)})
}

function updateNavigator(name,action){
    let id;
    const navitems = [...document.querySelectorAll('.nav-list-item')];
    let item = navitems.find(n=>{
        n = n.children[0].textContent // a element
        console.log(n)
        return new RegExp(name,'i').test(n) || name === n || name === n.toLowerCase();
    }) // find item
        // console.log(item)
        id = document.getElementById(`${item.textContent.toLowerCase()}-id`) // access the id of each section by it's item_name


        console.log(id,item)
    
        return action=='disable' ? disableItem(item,id) : null

function disableItem(item,id){
    // method
    item.style.display = 'none';
    id.style.display = 'none';
    return

}


}
let allinputs = [...document.querySelectorAll('input')]//.filter(x=>x.id!==startDate.id && x.id!==numInput.id);
let formTimer;
function clearInputs(){
    return allinputs.map(x=>x.value = '');
}




// navigation
/*------------------------------------------------------------------- */
updateNavigator('gallery','disable')
// updateNavigator('services','disable')
// updateNavigator('home','disable')
// updateNavigator('book','disable')




// pet age -> icon/size
const selectEelement = document.getElementById('select-input-element')
const options = [...selectEelement.children];
const [years,months,weeks] = [...options].map(( x, index) => +x.value === index ? {value:x.value,content:x.textContent} : null);

console.log(years,months,weeks) // formatted times
const currentSize = document.getElementById('current-size');

// select the value onchange event
selectEelement.onchange = e => {
    const value = e.currentTarget.value;
    console.log(value)
    ageVal  = [years,months,weeks][value]
    console.log(ageVal)
}

// select animal type [cat,rabbit,dog,turtle,snake]
const selectType = document.getElementById('select-type-input')
selectType.onchange = changeType
async function changeType(e){
    const currentType = +e.currentTarget.value;
    await fetch(`/breed/${currentType}`).then(r=>r.json()).then(d=>console.log(d))
    return;
}