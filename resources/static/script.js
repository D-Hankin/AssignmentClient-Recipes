const randomRecipeContainer = document.getElementById("randomRecipeContainer");
//const userRecipeContainer = document.getElementById("userRecipeContainer");
const randomRecipeOption1Container = document.getElementById("randomRecipeOption1Container");
const randomRecipeOption2Container = document.getElementById("randomRecipeOption2Container");
const randomRecipeOption3Container = document.getElementById("randomRecipeOption3Container");
const contentContainer = document.getElementById("contentContainer");
const home = document.getElementById("home");

homepage();

home.addEventListener("click", () => {
    homepage();
})

function homepage() {
    contentContainer.innerHTML= "";

    randomRecipe(randomRecipeContainer);
    randomRecipe(randomRecipeOption1Container);
    randomRecipe(randomRecipeOption2Container);
    randomRecipe(randomRecipeOption3Container);
}

function randomRecipe(container) {
    
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
        console.log(data);
    
        let recipeName = document.createElement("h2");
        recipeName.innerText = data.meals[0].strMeal;
        console.log(data.meals[0].strMeal);
        container.appendChild(recipeName);
        let recipeImage = document.createElement("img");
        recipeImage.src= data.meals[0].strMealThumb;

        recipeImage.addEventListener("click", () => {
            contentContainer.innerHTML = "";
            contentContainer.appendChild(recipeName);
        })

        container.appendChild(recipeImage);
    })
}


// fetch("http://localhost:8080/user/201c9435-6f78-4c68-9a95-829cc43b96a1/my-recipes/8")
// .then(res => res.json())
// .then(data => {
//     console.log(data)
//     let testRecipeName = document.createElement("h2");
//     testRecipeName.innerText = data.recipeName;
//     userRecipeContainer.appendChild(testRecipeName);

// })