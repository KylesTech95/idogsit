const [dogpaw,catpaw] = [...document.getElementById('paw-container').children]
const navlistitems = document.querySelectorAll('.nav-list-item')
const form = document.getElementById('book-id')
let com = document.getElementById('com')
let [dog,cat] = ['dogpaw.png','catpaw.png']
let petinfoContainer = document.getElementById('pet-info-container')
let animals = ['dog-run','puppy','dog-play'];
const servicesListContainer = document.getElementById('services-list-container');
const servicesListItems = [...servicesListContainer.children].filter((x,y)=>x.tagName === 'LI');
const hr_services = document.querySelector('.hr-services');
const quantityEnable = document.getElementById('quantity-enable-btn')
const service_images = ['behavior','bowl','monitor','treatment','waste']
const petinfoCol = `<div class="petinfo-col">
                    <div id="pettype-col">
                        <ul class="breed-ul"></ul>
                        <label for="pettype">Type</label>
                        <select name="pettype" class="select-type" id="select-type-input">
                            <option value="0">Dog</option>
                            <option value="1">Cat</option>
                            <option value="2">Rabbit</option>
                            <option value="3">Turtle</option>
                            <option value="4">Snake</option>
                        </select>
                        <label for="breed">Breed/Species</label>
                        <input type="text" name="breed" id="breed-input" placeholder="Breed/Species">
                    </div>
                    <div>
                        <label for="petname">Name</label>
                        <input type="text" name="petname" id="petname-input" class="noselect" placeholder="Name">
                    </div>
                    <!-- pet age  -->
                    <div>
                        <label for="petage">Age</label>
                        <input type="number" min="" name="petage" id="petage-input" class="noselect" placeholder="Age">
                        <select name="select-input-element" id="select-input-element">
                            <option value="0">Years</option>
                            <option value="1">Months</option>
                            <option value="2">Weeks</option>
                        </select>
                        <div id="petsize-container">
                            <img id="current-size" class="size-current size ">
                        </div>
                    </div>

                    <!-- pet height and weight -->
                    <div>
                        <!-- height -->
                        <label for="petheight">Height</label>
                        <input type="text" name="" id="">
                        <select name="select-input-element2" id="select-input-element2">
                            <option value="0">cm</option>
                            <option value="1">in</option>
                        </select>

                        <!-- weight -->
                         <label for="petweight">Weight</label>
                        <input type="text" name="" id="">
                        <select name="select-input-element3" id="select-input-element3">
                            <option value="0">lbs</option>
                            <option value="1">kg</option>
                        </select>

                    </div>
                    
                </div>`
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
    if([...petinfoContainer.children].length > 0){
        [...petinfoContainer.children].map(ch => ch.remove());
    }

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
        e.currentTarget.value = 0;
    }

    let targetNum = +e.currentTarget.value;

    console.log(targetNum)
    if(!e.currentTarget.value){
        console.log('nothing entered')
    }
    // append pet info cols
    for(let i = 0; i < targetNum; i++){
        const parser = new DOMParser();
        const element = parser.parseFromString(petinfoCol,'text/html');
        const petElement = element.children[0].children[1].children[0]

        petinfoContainer.appendChild(petElement)

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
        // console.log(n)
        return new RegExp(name,'i').test(n) || name === n || name === n.toLowerCase();
    }) // find item
        // console.log(item)
        id = document.getElementById(`${item.textContent.toLowerCase()}-id`) // access the id of each section by it's item_name


        // console.log(id,item)
    
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

let lockQuantity = false;
// quantity enable
    quantityEnable.onclick = e => {
        console.log(e.currentTarget);
        lockQuantity = false;
        numInput.removeAttribute('disabled');
        quantityEnable.classList.add('hidden')
    }

// pet age -> icon/size
window.onchange = async() => {

    if(lockQuantity==true){
        numInput.setAttribute('disabled',true);
        quantityEnable.classList.remove('hidden')
    } else {
             numInput.removeAttribute('disabled');
            quantityEnable.classList.add('hidden')
    }
    let allPetInputs = document.querySelectorAll('.petinfo-col');
    // console.log(allPetInputs);
        let ap = allPetInputs
    for(let i = 0; i < ap.length; i++){
        
        // console.log(ap[i])
        let ul, typeSelect,breedSelect,name,age, ageSuffix,height, heightMeasure,weight, weightMeasure// instatiate variables within petinfo-col
        ul = ap[i].children[0].children[0];
        ul.classList.add('breed-ul')
        typeSelect = ap[i].children[0].children[2];
        breedSelect = ap[i].children[0].children[4];
        // breedSelect.value = ''
        name = ap[i].children[1].children[1];
        age = ap[i].children[2].children[1];
        ageSuffix = ap[i].children[2].children[2];
        height = ap[i].children[3].children[1];
        heightMeasure = ap[i].children[3].children[2];
        weight = ap[i].children[3].children[4];
        weightMeasure = ap[i].children[3].children[5];
        
        let delBtn = document.createElement('div')
        delBtn.classList.add('del-btn')
        delBtn.textContent = "X";
        ap[i].append(delBtn)
        console.log(ap[i])

        // verify variable placements
        // console.log(typeSelect)
        // console.log(breedSelect)
        // console.log(name)
        // console.log(age);
        // console.log(ageSuffix)
        // console.log(height)
        // console.log(heightMeasure)
        // console.log(weight)
        // console.log(weightMeasure)

        // execute methods
        console.log(ul)
        if(typeSelect){
            typeSelect.onchange = async e => {
                lockQuantity = true;
                if(ul.children.length > 0){
                    let children;
                   children = [...ul.children].map(x=>x.remove()); // remove lis from ul onchange
                }
                const value = e.currentTarget.value;
                const textcontent = e.currentTarget.textContent;
                
                console.log(value)
                console.log(textcontent)

                // capture current breeds object
                let currentBreed = await getBreeds(value);
                console.log(currentBreed);
                let {list, animal} = currentBreed;
                console.log(animal)
                
                // activate ul and store lis of breeds
                //  create lis
                for(let i = 0; i < list.length; i++){
                    // declare/create elements
                    let li = document.createElement('li');
                    let para = document.createElement('p');
                    let family = document.createElement('p');
                    let type = document.createElement('p')
                    let scientific_name = document.createElement('p')
                    let tname = document.createElement('p')
                    // config textcontent
                    // console.log(list[i])
                    
                    // switch statement to read list by animal/breed
                    switch(true){
                        case animal==='snake':
                        family.textContent = list[i].family;
                        para.textContent = list[i].species.join(`, `)
                        break;
                        case animal==='turtle':
                        type.textContent = list[i].type
                        scientific_name.textContent = list[i].scientific_name
                        tname.textContent = list[i].name
                        break;
                        default:
                        para.textContent = list[i];
                        break;
                    }

                    // config classes
                    para.classList.add('breed-p')
                    li.classList.add('breed-li');
                    family.classList.add('breed-family');
                    type.classList.add('breed-type')

                    // append
                    if(type&&scientific_name&&tname){
                        li.append(type);
                        li.append(scientific_name);
                        li.append(tname);
                    }
                    family ? li.appendChild(family) : null;
                    li.appendChild(para);
                    ul.appendChild(li)

                    // li onclick event
                    li.onclick = e => {
                        console.log(e.currentTarget)
                        breedSelect.value =  [...e.currentTarget.children].filter(el=>el.textContent).map(x=>x.textContent).join` `
                        console.log(breedSelect.value)
                    }
                }
                    breedSelect.oninput = e => handleBreedInput(e,list)
            }
        }
        // delete a list-item
        if(delBtn){
            if(delBtn.parentElement===ap[i]){
                delBtn.onclick = () => {
                    ap[i].remove(); // remove info
                    numInput.value>= 0 ? numInput.value-=1 : null;
                }
            }
        }
    }
}

// get breeds fn
    async function getBreeds(value){
        let breeds = await fetch('/breed/'+value).then(r=>r.json()).then(d=>d);
        return breeds;
    }

    function handleBreedInput(e,array){
        let key = e.currentTarget.value;
        
        console.log(key)
        console.log(array)
        // sort list based on value(key)
        
    }  
// navigation
/*------------------------------------------------------------------- */
updateNavigator('gallery','disable')
// updateNavigator('services','disable')
// updateNavigator('home','disable')
// updateNavigator('book','disable')