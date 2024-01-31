
//const userRecipeContainer = document.getElementById("userRecipeContainer");

const contentContainer = document.getElementById("contentContainer");
const home = document.getElementById("home");

loadRandomRecipes();

home.addEventListener("click", async () => {
    contentContainer.innerHTML="";
    loadRandomRecipes();
    console.log("homepage");
})

async function loadRandomRecipes() {
    let randomRecipeContainer = document.createElement("div");
    let randomRecipeOptionsContainer = document.createElement("div");
    randomRecipeContainer.appendChild(randomRecipeOptionsContainer);
    contentContainer.appendChild(randomRecipeContainer);
    
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer);
}

function randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer) {
    
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        
        let recipeNameContainer = document.createElement("div");
        let recipeName = document.createElement("h2");
        recipeName.innerText = data.meals[0].strMeal;
        recipeName.style.cursor = "pointer";
        recipeNameContainer.appendChild(recipeName);

        //console.log(data.meals[0].strMeal);
        let recipeImageContainer = document.createElement("div");
        let recipeImage = document.createElement("img");
        recipeImage.style.cursor = "pointer";
        recipeImage.src = data.meals[0].strMealThumb;
        recipeImage.id = data.meals[0].idMeal; 
        recipeImageContainer.appendChild(recipeImage);
        
        recipeName.addEventListener("click", () => {
            toMeal(recipeName, recipeImage, data);
        })

        recipeImage.addEventListener("click", ()=> {
            toMeal(recipeName, recipeImage, data)
        });
        
        //console.log(recipeName.innerText + " loading complete");
        
        if(randomRecipeContainer.innerHTML != "") {
            randomRecipeContainer.append(recipeNameContainer, recipeImageContainer);
        } else {
            randomRecipeOptionsContainer.append(recipeNameContainer, recipeImageContainer);
        }
    })
}

async function toMeal(recipeName, recipeImage, data) {

    contentContainer.innerHTML="";
    recipeName.style.cursor = "";
    recipeImage.style.cursor = "";
    let recipeNameContainer = document.createElement("div");
    recipeNameContainer.appendChild(recipeName);
    let recipeImageContainer = document.createElement("div");
    recipeImageContainer.appendChild(recipeImage);
    let recipeInstructionsContainer = document.createElement("div");
    let recipeInstructions = document.createElement("p");
    recipeInstructions.innerText = data.meals[0].strInstructions;
    recipeImageContainer.appendChild(recipeInstructions);
    let recipeSourceContainer = document.createElement("div");
    let recipeSource = document.createElement("p");

    if (data.meals[0].strSource == null || data.meals[0].strSource == "") {
        recipeSource.innerText = "Source: No source available.";
    } else {
        recipeSource.innerText = "Source: " + data.meals[0].strSource;
    }

    recipeSource.style.fontStyle = "italic";
    recipeSourceContainer.appendChild(recipeSource) 
    contentContainer.append(recipeNameContainer, recipeImageContainer, recipeInstructionsContainer, recipeSourceContainer);
}


// fetch("http://localhost:8080/user/201c9435-6f78-4c68-9a95-829cc43b96a1/my-recipes/8")
// .then(res => res.json())
// .then(data => {
//     console.log(data)
//     let testRecipeName = document.createElement("h2");
//     testRecipeName.innerText = data.recipeName;
//     userRecipeContainer.appendChild(testRecipeName);

// })