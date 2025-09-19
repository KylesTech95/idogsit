const countries = ['United States', 'European Union','United Kingdom','Czech Republic','Wayback Machine']
let rabbits = document.querySelectorAll('a')
// filter rabbits
rabbits = [...rabbits].filter(x=> x.hasAttribute('href') && x.hasAttribute('title'));
// map names and filter 
let names = [...rabbits].map(x => x['title']).filter(w=>w.split(" ").length > 1 && !countries.includes(w));
// remove duplicate names with a new Set
let current_names = [...new Set(names)]


// write rabbit names to library (server/lib/rabbits.json)
async function writeRabbitNames(array){
    const payload = JSON.stringify({description:'A list of Rabbit types', rabbits:array});
    await fetch('/rabbits/post',{method:"POST",'headers':{"Content-Type":"Application/json"},body:payload})
    .then(r=>r.json())
    .then(d=>console.log(d))

}


// writeRabbitNames(current_names)


