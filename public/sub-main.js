const [dogpaw,catpaw] = [...document.getElementById('paw-container').children]
const navlistitems = document.querySelectorAll('.nav-list-item')
const form = document.getElementById('book-id')
let com = document.getElementById('com')
let [dog,cat] = ['dogpaw.png','catpaw.png']
let animals = ['dog-run','puppy','dog-play'];
const servicesListContainer = document.getElementById('services-list-container');
const hr_services = document.querySelector('.hr-services');
const service_images = ['behavior','bowl','monitor','treatment','waste']
let CURRENT_DEVICE = { // current device object with 2 boolean properties
    mobile:false,
    desk:true
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


function updateNavigator(name,action){
    let id;
    const navitems = [...document.querySelectorAll('.nav-list-item')];
    let item = navitems.find(n=>{
        n = n.children[0].textContent // a element
        console.log(n)
        return new RegExp(name,'i').test(n) || name === n || name === n.toLowerCase();
    }) // find item
        // console.log(item)
        id = document.getElementById(`${item.textContent.toLowerCase()}-id`) && document.getElementById(`${item.textContent.toLowerCase()}-id`) // access the id of each section by it's item_name


        console.log(id,item)
    
        return action=='disable' ? disableItem(item,id) : null

function disableItem(item,id){
    // method
    item.style.display = 'none';
    id ? id.style.display = 'none' : null;
    return

}


}
// async function postFetch(url,data){
//    return await fetch(url, {headers:{'Content-Type':'Application/json'},method:'POST',body:JSON.stringify(data)})
// }
updateNavigator('gallery','disable')