const hints= [];
let selectedData;
const h1El = document.createElement('h1');
const responseDiv = document.getElementById('response');
const tableEl = document.getElementById('nutrition-facts');
const reloadBtn = document.getElementById('reload-btn');
const dataRow = document.getElementById('data');
const dropdownEl = document.createElement("select");
const formEl = document.getElementById('form');
dropdownEl.setAttribute("class", "dropdown");
dropdownEl.addEventListener("change", (e)=> {
    const index =  e.target.value;
    selectedData = hints[index];
    responseDiv.innerHTML = "";
    tableEl.style.display = 'none';
    if (!selectedData.food){
        throw new Error('Sorry! no item found with this name!');
        responseDiv.innerHTML = `<h2 style="color: red">Sorry! no item found with this name!</h2>`;
    }
    h1El.textContent = selectedData.food.label.split(",")[0];
    const img = document.createElement('img');
    img.setAttribute('src',selectedData.food.image);
    img.setAttribute('alt', `An image showing ${selectedData.food.label}`);
    responseDiv.appendChild(h1El);
    responseDiv.appendChild(img);
    dataRow.innerHTML = "";
    const nutrients = selectedData.food.nutrients;
    const captionEl = document.getElementById('caption');
    captionEl.textContent = `Serving size: ${Math.round(selectedData.measures[0]?.weight)} Gram`;
    for (let key in nutrients){
        let tdElNutrient = document.createElement('td');
        if(key === 'ENERC_KCAL'){
          tdElNutrient.textContent = `${Math.round(nutrients[key])} kcal`;
        } else {
          tdElNutrient.textContent = `${Math.round(nutrients[key])} g`;
         
        }
        dataRow.appendChild(tdElNutrient);
    }
    
    tableEl.append(dataRow);
    tableEl.style.display = 'block';
})
reloadBtn.addEventListener("click", ()=> {
    clearDOM();
})

formEl.addEventListener("submit", (e)=> {
   e.preventDefault();
   const inputEl = document.getElementById('text');
   const inputText = inputEl.value;
   inputEl.value = "";
   getNutritionInfo(inputText);
  
})
function clearDOM(){
  window.location.reload();
}
async function getNutritionInfo(inputText) {
    try {
        const response = await fetch(`http://localhost:3000/nutrition/${inputText}`);
        if(!response.ok){
           throw new Error(`HTTP error: ${response.status}`)
        }
        const data = await response.json();
        if (data.hints.length === 0){
            throw new Error(`Sorry! could not find ${inputText}`);
        }
        data.hints.forEach((hint, i) => {
            var op = new Option();
            op.value = i;
            op.text = hint.food.label.split(",")[0];
            dropdownEl.options.add(op);    
            hints.push(hint);
        });
       
        document.getElementById('dropdown').append(dropdownEl);
    } catch (error) {
        console.error("Error:", error)
        document.getElementById('response').innerHTML = `<h2 style="color: red">${error.message}</h2>`;
    }
}

/***************************** Using Worker Example **************************/
const catImagesContainer = document.querySelector("#image-result");
const getCatDogImagesBtn = document.getElementById('catdog-images-btn');
const dogImagesContainer =  document.getElementById('dog-images-result');
getCatDogImagesBtn.addEventListener("click", getCatDogImages);
const catImages = [];
const dogImages = [];
const worker = new Worker('./worker.js');
const getImagesBtn = document.getElementById('get-images-btn');
getImagesBtn.addEventListener("click", (e)=> {
  const number = document.getElementById('number').value;
  worker.postMessage({
    command: "get cat images",
    number: parseInt(number, 10),
});
 
})

worker.addEventListener("message", (message) => {
    const imagesEl = message.data.result.map(cat=> `<img src=${cat.url} width="200px" alt="cat image"></img>` );
    catImagesContainer.innerHTML = imagesEl;
    worker.terminate();
});


async function getCatDogImages(){
    const limit = document.getElementById('limit').value;
    const response = await fetch(`http://localhost:3000/catdogapi/${limit}`)
    const data = await response.json();
    data[0].forEach(cat => {
        catImages.push(cat.url);
    });
    data[1].forEach(dog=> {
        dogImages.push(dog.url);
    });
   catImagesContainer.innerHTML = catImages.map(image =>`<img src=${image} alt="cat image" width="200px"></img>` );
   dogImagesContainer.innerHTML = dogImages.map(image =>`<img src=${image} alt="dog image" width="200px"></img>` );
}
