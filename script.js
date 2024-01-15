const options = {
    method: 'GET',
    headers: {}
  };
const formEl = document.getElementById('form');
formEl.addEventListener("submit", (e)=> {
   e.preventDefault();
   const inputEl = document.getElementById('text');
   const inputText = inputEl.value;
   const apiKey = document.getElementById('api-key').value;
   const apiHost = document.getElementById('api-host').value;
   options.headers = {'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': apiHost };
   inputEl.value = "";
   getNutritionInfo(inputText, options);
  
   
})

async function getNutritionInfo(inputText, options) {
    try {
        const response = await fetch(`https://edamam-food-and-grocery-database.p.rapidapi.com/api/food-database/v2/parser?ingr=${inputText}`, options);
        const data = await response.json();
        const h1El = document.createElement('h1');
        const responseDiv = document.getElementById('response');
        const tableEl = document.getElementById('nutrition-facts');
        const dataRow = document.getElementById('data');
        responseDiv.innerHTML = "";
        tableEl.style.display = 'none';
        if (!data.parsed[0]){
            throw new Error('Sorry! no item found with this name!');
        }
        h1El.textContent = data.parsed[0]?.food?.label;
        const img = document.createElement('img');
        img.setAttribute('src',data.parsed[0].food.image);
        img.setAttribute('alt', `An image showing ${data.parsed[0]?.food?.label}`);
        responseDiv.appendChild(h1El);
        responseDiv.appendChild(img);
        dataRow.innerHTML = "";
        const nutrients = data.parsed[0]?.food?.nutrients;
        for (let key in nutrients){
            let tdElNutrient = document.createElement('td');
            tdElNutrient.textContent = `${nutrients[key]}`;
            dataRow.appendChild(tdElNutrient);
        }
        
        tableEl.append(dataRow);
        tableEl.style.display = 'block';
        
    } catch (error) {
        document.getElementById('response').innerHTML = `<h2 style="color: red">${error.message}</h2>`;
       
    }
}
