export async function postFetch(url,data){
   return await fetch(url, {headers:{'Content-Type':'Application/json'},method:'POST',body:JSON.stringify(data)})
}

export async function getFetch(url){
   return await fetch(url,{method:'GET'})
}

