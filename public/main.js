const [dogpaw, catpaw] = [...document.getElementById("paw-container").children];
const navlistitems = document.querySelectorAll(".nav-list-item");
const form = document.getElementById("book-id");
let com = document.getElementById("com");
let [dog, cat] = ["dogpaw.png", "catpaw.png"];
let petinfoContainer = document.getElementById("pet-info-container");
let animals = ["dog-run", "puppy", "dog-play"];
const servicesListContainer = document.getElementById(
  "services-list-container"
);
const servicesListItems = [...servicesListContainer.children].filter(
  (x, y) => x.tagName === "LI"
);
const hr_services = document.querySelector(".hr-services");
const quantityEnable = document.getElementById("quantity-enable-btn");
const service_images = ["behavior", "bowl", "monitor", "treatment", "waste"];
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
                        <select name="select-input-age" id="select-input-age">
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
                        <select name="select-input-height" id="select-input-height">
                            <option value="0">cm</option>
                            <option value="1">in</option>
                        </select>

                        <!-- weight -->
                         <label for="petweight">Weight</label>
                        <input type="text" name="" id="">
                        <select name="select-input-weight" id="select-input-weight">
                            <option value="0">lbs</option>
                            <option value="1">kg</option>
                        </select>

                    </div>
                    <!-- proof of vaccination -->
         <div id="proof-title" class="form-title">
            <h1 class="vacc">Proof of Vaccination</h1>
            </div>

            <div id="proof-container">
                <div class="proof-col">
                    <div class="radio-container">
                        <!-- yes -->
                        <div>
                            <label for="proof_of_vaccination">YES</label>
                            <input type="radio" value="true" name="pov" id="proof-yes"required>
                        </div>
                        <!-- no -->
                        <div>
                            <label for="proof_of_vaccination">NO</label>
                            <input type="radio" value="false" name="pov" id="proof-no"required>
                        </div>
                        <!-- other -->
                        <div>
                            <label for="proof_of_vaccination">OTHER</label>
                            <input type="radio" value="other" name="pov" id="proof-other"required>
                        </div>
                    </div>
                </div>
            </div>
            <input type="file" id="file-input" form="upload-pet" name="file"/>
            <!-- The HTML input element's form attribute specifies the form that the <input> element belongs to. -->
            <img id="file-img"/>
                </div>`;
let formTimer;
let lockQuantity = false;
let CURRENT_DEVICE = {
  // current device object with 2 boolean properties
  mobile: false,
  desk: true,
};
let mediaDirectory;
switchBanner(document.getElementById("banner-img"), animals, 8);
/* ----------------------------------------- */
// form section
// pick a date
const currentDate = parseDate(new Date().toLocaleDateString());
let [month, day, year] = currentDate.split("-");
let nextDay = `${year}-${String(month < 10 ? `0${month}` : month)}-${
  Number(day < 10 ? `0${day}` : day) + 1
}`;

const [start, end] = [
  document.getElementById("startDate"),
  document.getElementById("endDate"),
];
// start date
start.setAttribute("min", nextDay);
start.oninput = (e) => {
  // console.log(e.currentTarget.value)
  let startdate = parseDate(e.currentTarget.value);
  // console.log(startdate)
  // end date
  end.setAttribute("min", startdate);
};

// number of pets
const numInput = document.getElementById("quantity-picker");
const petimg = document.getElementById("pets-img");
numInput.oninput = (e) => {
  if ([...petinfoContainer.children].length > 0) {
    [...petinfoContainer.children].map((ch) => ch.remove());
  }

  let max = 12;
  while (!e.currentTarget.value) {
    if (!petimg.classList.contains("animation-pets-img")) {
      petimg.classList.add("animation-pets-img");
    }
    return false;
  }
  petimg.classList.remove("animation-pets-img");

  // if number is over 12
  if (+e.currentTarget.value > max) {
    e.currentTarget.value = max;
  }
  // if number is under 1
  if (/((0[0-9])|-)/.test(e.currentTarget.value)) {
    e.currentTarget.value = 0;
  }

  let targetNum = +e.currentTarget.value;

  if (!e.currentTarget.value) {
    // console.log('nothing entered')
  }
  // append pet info cols
  for (let i = 0; i < targetNum; i++) {
    const parser = new DOMParser();
    const element = parser.parseFromString(petinfoCol, "text/html");
    const petElement = element.children[0].children[1].children[0];

    petinfoContainer.appendChild(petElement);
  }

  // add image to pet info
  document.querySelectorAll("#file-input").forEach((fileinput) => {
    fileinput.allgood = false;
    fileinput.onchange = (e) => {
      fileinput.allgood = true;
      const img = document.getElementById("file-img");
      const form = document.getElementById("upload-pet");

      // // post file to server
      //  if([...document.querySelectorAll('#file-input')].every(x=>x.allgood===true)){
      //     form.submit();
      // }
    };
  });
};
/* ----------------------------------------- */
// events
window.onload = () => {
  const hr = document.getElementById("hr-main");
  if (isMobileDevice()) {
    CURRENT_DEVICE.mobile = true;
    CURRENT_DEVICE.desk = false;
  }
  setMediaSrc(CURRENT_DEVICE, dogpaw, catpaw);

  // configure hr for header
  // hr.style.top = document.getElementById('header').getBoundingClientRect().y + "px"
  hr.style.top =
    document.getElementById("header").getBoundingClientRect().y +
    document.getElementById("header").clientHeight;

  // configure services container
  document.body.clientWidth > 900
    ? createServicesColumns(hr_services, servicesListItems, true)
    : createServicesColumns(hr_services, servicesListItems, false);

  servicesListItems.map((item, index) => {
    // console.log(item);
    const img = new Image();
    const path = "./media/services/",
      ext = ".png";
    img.src = path + service_images[index] + ext;
    img.classList.add("services-img");

    // append image to li
    // servicesListContainer.appendChild(img)
    item.insertBefore(img, item.children[0]);
  });
};
window.onresize = () => {
  if (isMobileDevice()) {
    CURRENT_DEVICE.mobile = true;
    CURRENT_DEVICE.desk = false;
  } else {
    CURRENT_DEVICE.mobile = false;
    CURRENT_DEVICE.desk = true;
  }

  setMediaSrc(CURRENT_DEVICE, dogpaw, catpaw);

  document.body.clientWidth > 900
    ? createServicesColumns(hr_services, servicesListItems, true)
    : createServicesColumns(hr_services, servicesListItems, false);
};
window.onscroll = (e) => {
  const ceiling = document.body.scrollTop;
  const scrollY = window.scrollY;

  // console.log(scrollY > ceiling)
  // change bg header
  if (scrollY > ceiling) {
    document.getElementById("header").classList.add("scroll-header-bg");
    nav.children[0].classList.add("enlarge-list-container");
    // navlistitems.forEach(item=>item.classList.add('enlarge-list-item'))
    com.classList.add("com-yellow");
  } else {
    document.getElementById("header").classList.remove("scroll-header-bg");
    nav.children[0].classList.remove("enlarge-list-container");

    // navlistitems.forEach(item=>item.classList.remove('enlarge-list-item'))
    com.classList.remove("com-yellow");
  }
};

// submit form
let radios = [...document.querySelectorAll("input")].filter(
  (y) => y.type === "radio"
);
let payload = {};
let ageVal;
form.onsubmit = (e) => {
  e.preventDefault();
  let values = [
    ...document.querySelectorAll("input"),
    ...document.querySelectorAll("select"),
    ...document.querySelectorAll("textarea"),
  ].filter((y) => !/(submit)/gi.test(y.type));
  // console.log(values);
  let names = values
    .map((v) => v.name)
    .sort((a, b) => {
      return Number(a.slice(-1)) - Number(b.slice(-1)); // sort the array
    });

  console.log(names);
  // iterate through names (formatted)
  for (let i = 0; i < names.length; i++) {
    if (names.indexOf(values[i].name) !== -1) {
      // payload.propertyName = the value's value
      payload[values[i].name] = values[i].value;
    }
  }
  // if files are uploaded
  if (
    [...document.querySelectorAll("#file-input")].every(
      (x) => x.allgood === true
    )
  ) {
    const fileForm = document.getElementById("upload-pet");
    // submit file form
    fileForm.submit();
    // submit booking
    postFetch("/book", payload);
    setTimeout(() => {
      window.location.href = window.location.origin + "/book/submission";
    }, 1000);
  } else {
    let novalue = [...document.querySelectorAll("#file-input")].filter(
      (noval) => !noval.value
    );
    console.log("NO VALUE!");
    console.log(novalue);
  }
};
/* ----------------------------------------- */
// check if mobile device
function isMobileDevice() {
  return document.body.clientWidth <= 900;
}

function targetMediaDir(currentDevice) {
  let dir;
  // console.log(currentDevice)
  for (let property in currentDevice) {
    if (currentDevice[property]) {
      dir = `./media/${property}/`;
    }
  }
  // console.log(dir)
  return dir;
}

function setMediaSrc(currentDevice, dogpaw, catpaw) {
  mediaDirectory = targetMediaDir(currentDevice);
  dogpaw.setAttribute("src", mediaDirectory + dog);
  catpaw.setAttribute("src", mediaDirectory + cat);
}

function parseDate(date) {
  let parsed = date.replace(/\//g, "-");
  return parsed;
}

// switch banner fn
function switchBanner(banner, images, seconds) {
  images.forEach((img, idx) => {
    setInterval(() => {
      banner.src = `./media/${img}.png`;
    }, seconds * 1000 * (idx + 1));
  });
}

function adjustContainerHeight(container, lastItem) {
  let padding = 10;
  let yPos = lastItem.getBoundingClientRect().y + padding;
  container.style.height = yPos + "px";
  return;
}

function createServicesColumns(hr_services, servicesListItems, bool) {
  // what we do (services)
  if (bool == true) {
    // console.log(servicesListItems)
    const [left, right] = [5, hr_services.getBoundingClientRect().x + 5];
    for (let i = 0; i < servicesListItems.length; i++) {}
  }

  if (bool == false) {
    for (let i = 0; i < servicesListItems.length; i++) {
      servicesListItems[i].classList.remove("absolute");
    }
  }
}

async function postFetch(url, data) {
  return await fetch(url, {
    headers: { "Content-Type": "Application/json" },
    method: "POST",
    body: JSON.stringify(data),
  });
}

function updateNavigator(name, action) {
  let id;
  const navitems = [...document.querySelectorAll(".nav-list-item")];
  let item = navitems.find((n) => {
    n = n.children[0].textContent; // a element
    // console.log(n)
    return (
      new RegExp(name, "i").test(n) || name === n || name === n.toLowerCase()
    );
  }); // find item
  // console.log(item)
  id = document.getElementById(`${item.textContent.toLowerCase()}-id`); // access the id of each section by it's item_name

  // console.log(id,item)

  return action == "disable" ? disableItem(item, id) : null;

  function disableItem(item, id) {
    // method
    item.style.display = "none";
    id.style.display = "none";
    return;
  }
}
let allinputs = [...document.querySelectorAll("input")]; //.filter(x=>x.id!==startDate.id && x.id!==numInput.id);
function clearInputs() {
  return allinputs.map((x) => (x.value = ""));
}

// quantity enable
quantityEnable.onclick = (e) => {
  console.log(e.currentTarget);
  lockQuantity = false;
  numInput.removeAttribute("disabled");
  quantityEnable.classList.add("hidden");
};

// pet age -> icon/size
window.onchange = async () => {
  if (document.querySelectorAll(".del-btn").length > 0) {
    let allDls = [...document.querySelectorAll(".del-btn")];
    allDls.map((d) => d.remove());
  }
  if (lockQuantity == true) {
    numInput.setAttribute("disabled", true);
    quantityEnable.classList.remove("hidden");
  } else {
    numInput.removeAttribute("disabled");
    quantityEnable.classList.add("hidden");
  }
  let allPetInputs = document.querySelectorAll(".petinfo-col");
  // console.log(allPetInputs);
  let ap = allPetInputs;
  for (let i = 0; i < ap.length; i++) {
    // console.log(ap[i])
    let proofs,
      proofContainer,
      fileinp,
      typeSelect,
      breedSelect,
      name,
      age,
      ageSuffix,
      height,
      heightMeasure,
      weight,
      weightMeasure, // instatiate variables within petinfo-col
      ul = ap[i].children[0].children[0];
    ul.classList.add("breed-ul");
    typeSelect = ap[i].children[0].children[2];
    breedSelect = ap[i].children[0].children[4];
    name = ap[i].children[1].children[1];
    age = ap[i].children[2].children[1];
    ageSuffix = ap[i].children[2].children[2];
    height = ap[i].children[3].children[1];
    heightMeasure = ap[i].children[3].children[2];
    weight = ap[i].children[3].children[4];
    weightMeasure = ap[i].children[3].children[5];
    fileinp = [...ap[i].children].find((f) => f.type === "file");
    proofContainer = [...ap[i].children].find(
      (con) => con.id === "proof-container"
    );
    let proofCol = proofContainer.children[0];
    let radioContainer = [...proofCol.children[0].children]; // div
    console.log(radioContainer);
    proofs = [...radioContainer].map((x) => x.children[1]);
    proofs.forEach((proof) => proof.setAttribute("name", "pov" + (i + 1)));
    console.log(proofs);

    typeSelect.setAttribute("name", "type" + (i + 1));
    breedSelect.setAttribute("name", "breed" + (i + 1));
    name.setAttribute("name", "name" + (i + 1));
    age.setAttribute("name", "age" + (i + 1));
    height.setAttribute("name", "height" + (i + 1));
    weight.setAttribute("name", "weight" + (i + 1));
    fileinp.setAttribute("name", "file" + (i + 1));
    ageSuffix.setAttribute("name", "select-input-age" + (i + 1));
    heightMeasure.setAttribute("name", "select-input-height" + (i + 1));
    weightMeasure.setAttribute("name", "select-input-weight" + (i + 1));

    let delBtn = document.createElement("div");
    delBtn.classList.add("del-btn");
    delBtn.textContent = "X";
    ap[i].append(delBtn);
    // console.log(ap[i])

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

    if (typeSelect) {
      typeSelect.onchange = async (e) => {
        lockQuantity = true;
        if (ul.children.length > 0) {
          let children;
          children = [...ul.children].map((x) => x.remove()); // remove lis from ul onchange
        }
        const value = e.currentTarget.value;
        const textcontent = e.currentTarget.textContent;

        console.log(value);
        console.log(textcontent);

        // capture current breeds object
        let currentBreed = await getBreeds(value);
        console.log(currentBreed);
        let { list, animal } = currentBreed;
        // console.log(animal)

        // activate ul and store lis of breeds
        //  create lis
        for (let i = 0; i < list.length; i++) {
          let li = addRows(ul, i, animal, list);

          // li onclick event
          li.onclick = (e) => {
            console.log(e.currentTarget);
            breedSelect.value = [...e.currentTarget.children]
              .filter((el) => el.textContent)
              .map((x) => x.textContent).join` `;
            console.log(breedSelect.value);
          };
        }
        // handle breed input
        breedSelect.oninput = (e) => handleBreedInput(e, animal, list);
      };
    }
    typeSelect.onclick = async (e) => {
      // remove lis
      if (+e.currentTarget.value === 0) {
        let breedSelect = [...e.currentTarget.parentElement.children].find(
          (x) => x.id == "breed-input"
        );
        // if(e.currentTarget.parentElement.children[0].children.length > 0){
        // let children;
        // children = [...ul.children].map(x=>x.remove()); // remove lis from ul onchange
        // }
        let currentBreed = await getBreeds(e.currentTarget.value);
        let { list, animal } = currentBreed;

        // activate ul and store lis of breeds
        //  create lis
        for (let i = 0; i < list.length; i++) {
          let li = addRows(ul, i, animal, list);
          // li onclick event
          li.onclick = (e) => {
            // console.log(e.currentTarget)
            breedSelect.value = [...e.currentTarget.children]
              .filter((el) => el.textContent)
              .map((x) => x.textContent).join` `;
            // console.log(breedSelect.value)
          };
        }
        // handle breed input
        breedSelect.oninput = (e) => handleBreedInput(e, animal, list);
      }
    };
    // delete a list-item
    if (delBtn) {
      if (delBtn.parentElement === ap[i]) {
        delBtn.onclick = () => {
          ap[i].remove(); // remove info
          numInput.value >= 0 ? (numInput.value -= 1) : null;
        };
      }
    }
  }
};

function addRows(ul, i, animal, list) {
  // declare/create elements
  let li = document.createElement("li");
  let para = document.createElement("p");
  let family = document.createElement("p");
  let type = document.createElement("p");
  let scientific_name = document.createElement("p");
  let tname = document.createElement("p");
  // config textcontent
  // console.log(list[i])

  // switch statement to read list by animal/breed
  switch (true) {
    case animal === "snake":
      family.textContent = list[i].family;
      para.textContent = list[i].species.join(`, `);
      break;
    case animal === "turtle":
      type.textContent = list[i].type;
      scientific_name.textContent = list[i].scientific_name;
      tname.textContent = list[i].name;
      break;
    default:
      para.textContent = list[i];
      break;
  }

  // config classes
  para.classList.add("breed-p");
  li.classList.add("breed-li");
  family.classList.add("breed-family");
  type.classList.add("breed-type");

  // append
  if (type && scientific_name && tname) {
    li.append(type);
    li.append(scientific_name);
    li.append(tname);
  }
  family ? li.appendChild(family) : null;
  li.appendChild(para);
  ul.appendChild(li);

  return li;
}
// get breeds fn
async function getBreeds(value) {
  let breeds = await fetch("/breed/" + value)
    .then((r) => r.json())
    .then((d) => d);
  return breeds;
}

function handleBreedInput(e, animal, array) {
  let key = e.currentTarget.value;
  let regex = new RegExp(key, "gi");
  // console.log(array)
  // sort list based on value(key)
  let mylist;
  switch (true) {
    case animal === "snake":
      // console.log(array)
      mylist = new Set([...array].map((item) => [...item.species]).flat());
      break;
    case animal === "turtle":
      mylist = [...array].map((item) => item.type + " " + item.name);
      break;
    default:
      mylist = array.map((item) => item);
      break;
  }

  // console.log(mylist)
  let filtered = [...mylist].filter((x, y) => regex.test(x));
}
// navigation
/*------------------------------------------------------------------- */
updateNavigator("gallery", "disable");
// updateNavigator('services','disable')
// updateNavigator('home','disable')
// updateNavigator('book','disable')

console.log(
  new Date(Date.now())
    .toLocaleDateString()
    .split("/")
    .map((x) => {
      x = Number(x);
      return x < 10 ? "0" + x : x;
    })
    .reverse()
    .join(".")
);
