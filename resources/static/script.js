const contentContainer = document.getElementById("contentContainer");
const registerBtnContainer = document.getElementById("registerBtnContainer");
const logBtnContainer = document.getElementById("logBtnContainer");
const home = document.getElementById("home");
const registerLoginContainer = document.getElementById("registerLoginContainer");
const registerLoginPopUp = document.getElementById("registerLoginPopUp");
const registerBtn = document.getElementById("registerBtn");
const recipeDialog = document.getElementById("recipeDialog");
const myRecipesBtnConatainer = document.getElementById("myRecipesBtnContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoriesSelect = document.getElementById("categoriesSelect");
const selectCategoryBtn = document.getElementById("selectCategoryBtn");

let currentUserId;
let recipeImages = []; 

if (sessionStorage.getItem("current_user")) {
    currentUserId = sessionStorage.getItem("current_user");
} else {
    sessionStorage.setItem("current_user", 0);
}

if (typeof currentUserId != "undefined" && currentUserId != 0) {
    createLogout(currentUserId);
    loadRandomRecipes(currentUserId);
    createMyRecipes();
    createcategoriesSelect();
} else {
    loadRandomRecipes(currentUserId)
    createLogin();
    createRegister();
    createcategoriesSelect();
}

home.addEventListener("click", async () => {

    contentContainer.innerHTML="";
    registerLoginPopUp.removeAttribute("open");
    currentUserId = sessionStorage.getItem("current_user");
    console.log("home: " + currentUserId);
    loadRandomRecipes(currentUserId);
    
    if (currentUserId != 0) {
        createHeartImage(recipeImages, currentUserId);
    }
})

searchBtn.addEventListener("click", async () => {

    if (searchInput.value.trim() != "" && searchInput.value.length == 1) {
        contentContainer.innerHTML = "";
        let searchResultsHeader = document.createElement("h2");
        searchResultsHeader.innerText = "Search Results";
        let searchResultsList = document.createElement("ul");

        await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=" + searchInput.value)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.meals.forEach(recipe => {
                let li = document.createElement("li");
                    li.innerText = recipe.strMeal;
                    li.style.cursor = "pointer";
                    searchResultsList.appendChild(li);
                    let recipeNameContainer = document.createElement("div");
                    let recipeName = document.createElement("h2");
                    recipeName.innerText = recipe.strMeal;
                    recipeName.style.cursor = "pointer";
                    recipeName.style.textAlign = "center";
                    recipeNameContainer.appendChild(recipeName);
                    let recipeImageContainer = document.createElement("div");
                    recipeImageContainer.id = "RecipeDiv" + recipe.idMeal; 
                    recipeImageContainer.style.position = "relative";
                    recipeImageContainer.style.textAlign = "center";
                    recipeImageContainer.style.width = "100vw";
                    let recipeImage = document.createElement("img");
                    recipeImage.style.cursor = "pointer";
                    recipeImage.style.width = "50%";
                    recipeImage.src = recipe.strMealThumb;
                    recipeImage.id = recipe.idMeal; 
                    recipeImages.push(recipeImage);
                    recipeImageContainer.appendChild(recipeImage);
                    console.log(recipeName);
                    let alreadyLiked = false;
                    li.addEventListener("click", () => toMeal(alreadyLiked, recipeName, recipeImage, data));
            })
        })

        contentContainer.append(searchResultsHeader, searchResultsList);
        searchInput.value = "";


    } else {
        alert("Yuo can only search by the first letter.")
        searchInput.value = "";
    }
})

async function createcategoriesSelect() {

    await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(res => res.json())
    .then(data => {
        console.log(data);

        data.categories.forEach(category => {
            let categoryOption = document.createElement("option");
            categoryOption.innerText = category.strCategory;
            categoriesSelect.appendChild(categoryOption);
            
        })
        selectCategoryBtn.addEventListener("click", () => selectCategoryBtnEventListener())
    })
}

async function selectCategoryBtnEventListener() {
    
    await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + categoriesSelect.options[categoriesSelect.selectedIndex].value)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        contentContainer.innerHTML = "";
        let categoryHeader = document.createElement("h2");
        categoryHeader.innerText = categoriesSelect.options[categoriesSelect.selectedIndex].value;
        contentContainer.appendChild(categoryHeader);
        categoryMealsList = document.createElement("ul");

        data.meals.forEach(async meal => {
            await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + meal.idMeal)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let li = document.createElement("li");
                li.innerText = data.meals[0].strMeal;
                li.style.cursor = "pointer";
                categoryMealsList.appendChild(li);
                let recipeNameContainer = document.createElement("div");
                let recipeName = document.createElement("h2");
                recipeName.innerText = data.meals[0].strMeal;
                recipeName.style.cursor = "pointer";
                recipeName.style.textAlign = "center";
                recipeNameContainer.appendChild(recipeName);
                let recipeImageContainer = document.createElement("div");
                recipeImageContainer.id = "RecipeDiv" + data.meals[0].idMeal; 
                recipeImageContainer.style.position = "relative";
                recipeImageContainer.style.textAlign = "center";
                recipeImageContainer.style.width = "100vw";
                let recipeImage = document.createElement("img");
                recipeImage.style.cursor = "pointer";
                recipeImage.style.width = "50%";
                recipeImage.src = data.meals[0].strMealThumb;
                recipeImage.id = data.meals[0].idMeal; 
                recipeImages.push(recipeImage);
                recipeImageContainer.appendChild(recipeImage);
                console.log(recipeName.innerText);
                let alreadyLiked = false;
                li.addEventListener("click", () => toMeal(alreadyLiked, recipeName, recipeImage, data));

            })
        })
        contentContainer.appendChild(categoryMealsList);
    })
}

async function loadRandomRecipes(currentUserId) {

    let randomRecipeContainer = document.createElement("div");
    let randomRecipeOptionsContainer = document.createElement("div");
    let recipeSuggestions = document.createElement("h2");
    recipeSuggestions.innerText = "Todays Recipe Suggestions...";
    randomRecipeContainer.appendChild(randomRecipeOptionsContainer);
    contentContainer.append(recipeSuggestions, randomRecipeContainer);
    
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer, currentUserId);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer, currentUserId);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer, currentUserId);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer, currentUserId);
}

async function randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer, currentUserId) {

    await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
           
        let recipeNameContainer = document.createElement("div");
        let recipeName = document.createElement("h2");
        recipeName.innerText = data.meals[0].strMeal;
        recipeName.style.cursor = "pointer";
        recipeName.style.textAlign = "center";
        recipeNameContainer.appendChild(recipeName);
        let recipeImageContainer = document.createElement("div");
        recipeImageContainer.id = "RecipeDiv" + data.meals[0].idMeal; 
        recipeImageContainer.style.position = "relative";
        recipeImageContainer.style.textAlign = "center";
        recipeImageContainer.style.width = "100vw";
        let recipeImage = document.createElement("img");
        recipeImage.style.cursor = "pointer";
        recipeImage.style.width = "50%";
        recipeImage.src = data.meals[0].strMealThumb;
        recipeImage.id = data.meals[0].idMeal; 
        recipeImages.push(recipeImage);
        recipeImageContainer.appendChild(recipeImage);
        
        currentUserId = sessionStorage.getItem("current_user");
        if (currentUserId != 0 && typeof currentUserId !== "undefined") {
            let alreadyLiked = false;
            createHeartImage(alreadyLiked, recipeImage);
        }
        
        recipeName.addEventListener("click", () => {
            let alreadyLiked = false;
            toMeal(alreadyLiked, recipeName, recipeImage, data);
        })

        recipeImage.addEventListener("click", ()=> {
            let alreadyLiked = false; 
            toMeal(alreadyLiked, recipeName, recipeImage, data)
        });
        
        if(randomRecipeContainer.innerHTML != "") {
            randomRecipeContainer.append(recipeNameContainer, recipeImageContainer);
        } else {
            randomRecipeOptionsContainer.append(recipeNameContainer, recipeImageContainer);
        }
    })
}

function toMeal(alreadyLiked, recipeName, recipeImage, data) {

    contentContainer.innerHTML="";
    if (recipeName && typeof recipeName.style.cursor !== "undefined") {
        recipeName.style.cursor = "";
    }
    if (recipeImage && typeof recipeImage.style.cursor !== "undefined") {
        recipeImage.style.cursor = "";
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"

    })

    let recipeNameContainer = document.createElement("div");
    recipeNameContainer.appendChild(recipeName);
    let recipeImageContainer = document.createElement("div");
    recipeImageContainer.style.position = "relative";
    recipeImageContainer.style.textAlign = "center";
    recipeImageContainer.style.width = "100vw";
    recipeImage.style.width = "50%";
    recipeImageContainer.style.position = "relative";
    recipeImageContainer.append(recipeImage);

    let recipeIngredientsContainer = document.createElement("div");
    recipeIngredientsContainer.style.width = "95vw";
    let recipeIngredientsList = document.createElement("ul")
    let ingredientsArray = [data.meals[0].strMeasure1 + " " + data.meals[0].strIngredient1, data.meals[0].strMeasure2 + " " + data.meals[0].strIngredient2, 
                            data.meals[0].strMeasure3 + " " + data.meals[0].strIngredient3, data.meals[0].strMeasure4 + " " + data.meals[0].strIngredient4, 
                            data.meals[0].strMeasure5 + " " + data.meals[0].strIngredient5, data.meals[0].strMeasure6 + " " + data.meals[0].strIngredient6, 
                            data.meals[0].strMeasure7 + " " + data.meals[0].strIngredient7, data.meals[0].strMeasure8 + " " + data.meals[0].strIngredient8, 
                            data.meals[0].strMeasure9 + " " + data.meals[0].strIngredient9, data.meals[0].strMeasure10 + " " + data.meals[0].strIngredient10, 
                            data.meals[0].strMeasure11 + " " + data.meals[0].strIngredient11, data.meals[0].strMeasure12 + " " + data.meals[0].strIngredient12, 
                            data.meals[0].strMeasure13 + " " + data.meals[0].strIngredient13, data.meals[0].strMeasure14 + " " + data.meals[0].strIngredient14, 
                            data.meals[0].strMeasure15 + " " + data.meals[0].strIngredient15, data.meals[0].strMeasure16 + " " + data.meals[0].strIngredient16, 
                            data.meals[0].strMeasure17 + " " + data.meals[0].strIngredient17, data.meals[0].strMeasure18 + " " + data.meals[0].strIngredient18, 
                            data.meals[0].strMeasure19 + " " + data.meals[0].strIngredient19, data.meals[0].strMeasure20 + " " + data.meals[0].strIngredient20];
    for(let i = 0; i <ingredientsArray.length; i++) {
        if (ingredientsArray[i].trim() != "" && ingredientsArray[i] != "null null") {
            let li = document.createElement("li");
            li.innerText = ingredientsArray[i];
            recipeIngredientsList.appendChild(li);
        }
    }
    recipeIngredientsContainer.appendChild(recipeIngredientsList);
    recipeIngredientsContainer.style.textAlign = "left";

    let recipeInstructionsContainer = document.createElement("div");
    recipeInstructionsContainer.style.width = "95vw";
    let recipeInstructions = document.createElement("p");
    recipeInstructions.innerText = data.meals[0].strInstructions;
    recipeInstructions.style.width = "95%";

    recipeInstructionsContainer.appendChild(recipeInstructions);
    let recipeSourceContainer = document.createElement("div");
    let recipeSource = document.createElement("p");
    
    if (data.meals[0].strSource == null || data.meals[0].strSource == "") {
        recipeSource.innerText = "Source: No source available.";
    } else {
        recipeSource.innerText = "Source: " + data.meals[0].strSource;
    }

    recipeSource.style.fontStyle = "italic";
    recipeSourceContainer.appendChild(recipeSource) 
    contentContainer.append(recipeNameContainer, recipeImageContainer, recipeIngredientsContainer, recipeInstructionsContainer, recipeSourceContainer);
    currentUserId = sessionStorage.getItem("current_user");

    if (currentUserId !== 0) {
        createHeartImage(alreadyLiked, recipeImage);
    }
}

function createLogin() {
    
    logBtnContainer.innerHTML = "";
    let loginBtn = document.createElement("button");
    loginBtn.innerText = "Log in"
    logBtnContainer.appendChild(loginBtn);
    
    loginBtn.addEventListener("click", () => {
        
        registerLoginPopUp.innerHTML = "";
        let loginForm = document.createElement("form");
        loginForm.style.display = "block";
        let loginFormUsername = document.createElement("input");
        loginFormUsername.placeholder = "Username";
        loginFormUsername.setAttribute("required", "true");
        loginFormUsername.name = "username";
        let loginFormPassword = document.createElement("input");
        loginFormPassword.placeholder = "Password";
        loginFormPassword.type = "password";
        loginFormPassword.name = "password";
        loginFormPassword.setAttribute("required", "true");
        let loginFormSubmit = document.createElement("button");
        loginFormSubmit.type = "button";
        loginFormSubmit.innerText = "Log in";
        let cancelBtn = document.createElement("button");
        cancelBtn.type= "button";
        cancelBtn.innerText = "Cancel";
        cancelBtn.addEventListener("click", () => cancelBtnEventListener());
        loginForm.append(loginFormUsername, loginFormPassword, loginFormSubmit, cancelBtn);
        registerLoginPopUp.appendChild(loginForm);
        registerLoginPopUp.setAttribute("open", true);

        loginFormSubmit.addEventListener("click", () => loginFormSubmitEventListener(loginFormUsername, loginFormPassword));
    })
}

function createLogout() {

    contentContainer.innerHTML = "";
    let loginBtn = document.createElement("button");
    loginBtn.innerText = "Log out"
    logBtnContainer.appendChild(loginBtn);
    
    loginBtn.addEventListener("click", async () => {
        currentUserId = 0;
        await fetch("http://localhost:8080/custom-logout", {
            mode: "no-cors",
            method: "POST",
            credentials: "include"
        })
        
        let myBtn = document.getElementById("myRecipesBtn");
        if (myBtn) {
            myBtn.parentElement.removeChild(document.getElementById("myRecipesBtn"));
        }
        registerLoginPopUp.removeAttribute("open");
        sessionStorage.setItem("current_user", 0);
        let removeHearts = document.querySelectorAll("[id*='heart']");
        removeHearts.forEach(function(heart) {
            heart.parentElement.removeChild(heart);
        });
        contentContainer.innerHTML = "";
        loadRandomRecipes();
        createLogin();
        createRegister();
        if (sessionStorage.getItem("count")) {
            sessionStorage.removeItem("count");
        }
    });
}

function createRegister() {
    
    let registerBtn = document.createElement("button");
    registerBtn.innerText = "Register";
    registerBtnContainer.appendChild(registerBtn);

    registerBtn.addEventListener("click", () => {
    
        registerLoginPopUp.innerHTML = "";
        let registerForm = document.createElement("form");
        registerForm.style.display = "block";
        let registerFormUsername = document.createElement("input");
        registerFormUsername.placeholder = "Username";
        registerFormUsername.required = true;
        registerFormUsername.minLength = "6";
        registerFormUsername.maxLength = "15";
        let registerFormPassword = document.createElement("input");
        registerFormPassword.placeholder = "Password";
        registerFormPassword.required = true;
        registerFormPassword.type = "password";
        registerFormPassword.minLength = "6";
        registerFormPassword.maxLength = "20";
        let registerFormReEnterPassword = document.createElement("input");
        registerFormReEnterPassword.placeholder = "Re-enter password";
        registerFormReEnterPassword.required = true;
        registerFormReEnterPassword.type = "password";
        registerFormReEnterPassword.minLength = "6";
        registerFormReEnterPassword.maxLength = "20";
        let registerFormFirstName = document.createElement("input");
        registerFormFirstName.placeholder = "FirstName";
        registerFormFirstName.required = true;
        let registerFormLastName = document.createElement("input");
        registerFormLastName.placeholder = "Last Name";
        registerFormLastName.required = true;
        let registerFormEmail = document.createElement("input");
        registerFormEmail.placeholder = "Email";
        registerFormEmail.required = true;
        registerFormEmail.type = "email";
        let registerFormSubmit = document.createElement("button");
        registerFormSubmit.type = "button";
        registerFormSubmit.innerText = "Register";
        let cancelBtn = document.createElement("button");
        cancelBtn.type= "button";
        cancelBtn.innerText = "Cancel";
        cancelBtn.addEventListener("click", () => cancelBtnEventListener());
        registerForm.append(registerFormUsername, registerFormPassword, registerFormReEnterPassword, registerFormFirstName, registerFormLastName, registerFormEmail, 
            registerFormSubmit, cancelBtn);
        registerLoginPopUp.appendChild(registerForm);
        registerLoginPopUp.setAttribute("open", "true");
    
        registerFormSubmit.addEventListener("click", () => registerFormSubmitEventListener(registerLoginPopUp, registerFormUsername, registerFormPassword, registerFormReEnterPassword, 
            registerFormFirstName, registerFormLastName, registerFormEmail));
    })
}

async function loginFormSubmitEventListener(loginFormUsername, loginFormPassword) {

    if (loginFormUsername.value.trim() != "" && loginFormPassword.value.trim() != "") {
        registerLoginPopUp.removeAttribute("open");
        let loginAttempt = {
            username: loginFormUsername.value,
            password: loginFormPassword.value
        }
        await fetch("http://localhost:8080/custom-login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(loginAttempt)
        })
        .then(res => res.json())
        .then(data => {

            if (!data.error) {
                contentContainer.innerHTML = "";
                registerBtnContainer.innerHTML = "";
                logBtnContainer.innerHTML = "";
                currentUserId = data.id;
                sessionStorage.setItem("current_user", currentUserId);
                let alreadyLiked = false;
                createLogout();
                createMyRecipes();
                loadRandomRecipes()
                createHeartImage(alreadyLiked, recipeImages);
            } else {
                alert("Invalid username or password.")
            }
        })
    } else {
        alert("Please enter a username and password");
    }
}

function createHeartImage(alreadyLiked, recipeImages) {

    currentUserId = parseInt(sessionStorage.getItem("current_user"));

    if (currentUserId !== 0) {
    
        if (alreadyLiked == false) {
            if (Array.isArray(recipeImages)) {
                recipeImages.forEach(recipeImage => {
                    let heartImage = document.createElement("img");
                        heartImage.src = "/resources/static/images/heartEmpty.png";
                        heartImage.style.position = "absolute";
                        heartImage.style.top = "1%";
                        heartImage.style.right = "27%";
                        heartImage.style.width = "50px";
                        heartImage.style.height = "50px";
                        heartImage.style.zIndex = "2";
                        heartImage.id = "heart" + recipeImage.id;
                        recipeImage.parentElement.appendChild(heartImage);
                    })
                } else {
                    let heartImage = document.createElement("img");
                    heartImage.src = "/resources/static/images/heartEmpty.png";
                    heartImage.style.position = "absolute";
                    heartImage.style.top = "1%";
                    heartImage.style.right = "27%";
                    heartImage.style.width = "50px";
                    heartImage.style.height = "50px";
                    heartImage.style.zIndex = "2";
                    heartImage.id = "heart" + recipeImages.id;
                    recipeImages.parentElement.appendChild(heartImage);
                    heartImage.addEventListener("click", () => heartImageEventListener(heartImage));
            }  
        } else {
            if (Array.isArray(recipeImages)) {
                recipeImages.forEach(recipeImage => {
                    let heartImage = document.createElement("img");
                        heartImage.src = "/resources/static/images/heartRed.png";
                        heartImage.style.position = "absolute";
                        heartImage.style.top = "1%";
                        heartImage.style.right = "27%";
                        heartImage.style.width = "50px";
                        heartImage.style.height = "50px";
                        heartImage.style.zIndex = "2";
                        heartImage.id = "heart" + recipeImage.id;
                        recipeImage.parentElement.appendChild(heartImage);
                    })
                } else {
                    let heartImage = document.createElement("img");
                    heartImage.src = "/resources/static/images/heartRed.png";
                    heartImage.style.position = "absolute";
                    heartImage.style.top = "1%";
                    heartImage.style.right = "27%";
                    heartImage.style.width = "50px";
                    heartImage.style.height = "50px";
                    heartImage.style.zIndex = "2";
                    heartImage.id = "heart" + recipeImages.id;
                    //recipeImages.parentElement.appendChild(heartImage);
                    heartImage.addEventListener("click", () => heartImageEventListener(heartImage));
                }
        }
    }

}

async function heartImageEventListener(heartImage) {
    
    let recipeId = heartImage.id.replace(/\D/g, "");
    currentUserId = sessionStorage.getItem("current_user");

    if (heartImage.src.includes("/resources/static/images/heartEmpty.png")) {
        if(currentUserId !== 0) {
            try {
                await fetch("http://localhost:8080/user/" + currentUserId + "/my-recipes/add-liked-recipe/" + recipeId, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        recipeId: recipeId, 
                        userId: currentUserId,
                    }),
                })
                .then(res => res.text())
                .then(data => {
                    heartImage.src="/resources/static/images/heartRed.png";
                    alert(data)
                })
            } catch {
                alert("Something went wrong");
            }
        }
    } else {
        try {
            await fetch("http://localhost:8080/user/" + currentUserId + "/my-recipes/remove-liked-recipe/" + recipeId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(res => res.text())
            .then(data => {
                alert(data);
                heartImage.src = "/resources/static/images/heartEmpty.png";
            })
        } catch {
            alert("Something went wrong");
        }
    }
}

async function registerFormSubmitEventListener(registerLoginPopUp, registerFormUsername, registerFormPassword, registerFormReEnterPassword, registerFormFirstName, 
    registerFormLastName, registerFormEmail) {

        let usernameTaken = false;

        if (registerFormPassword.value == registerFormReEnterPassword.value) {

            if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(registerFormEmail.value) && registerFormUsername.value.trim() != "" && registerFormFirstName.value.trim() != ""
                    && registerFormLastName.value.trim() != "" && registerFormPassword.value.trim() != "") {

                await fetch("http://localhost:8080/users")
                .then(res => res.json())
                .then(data => {
                    for(let i = 0; i < data.length; i++) {
                        if (registerFormUsername.value == data[i].username) {
                            registerFormUsername.value = "";
                            registerFormPassword.value = "";
                            registerFormReEnterPassword.value = "";
                            usernameTaken = true;
                            alert("That username is already taken! Please try again...");
                            break;
                        }
                    }
                    if(usernameTaken == false) {
                        try {
                            fetch("http://localhost:8080/add-user", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    username: registerFormUsername.value,
                                    password: registerFormPassword.value,
                                    firstName: registerFormFirstName.value,
                                    lastName: registerFormLastName.value,
                                    email: registerFormEmail.value
                                }) 
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (!data.error) {
                                    alert("You have successfully registeered an account!")
                                    registerFormPassword.value = "";
                                    registerFormReEnterPassword.value = "";
                                    registerFormUsername.value = "";
                                    registerFormFirstName.value = "";
                                    registerFormLastName.value = "";
                                    registerFormEmail.value = "";
                                    registerLoginPopUp.removeAttribute("open");
                                }
                            })
                        } catch {
                            alert("Something went wrong, please try again");
                        }           
                    }
                })   
            } else {
                alert("Please enter all fields including a valid email address.")
                registerFormPassword.value = "";
                registerFormReEnterPassword.value = "";
            }
        } else {
            alert("The passwords do no match. Please try again.")
            registerFormPassword.value = "";
            registerFormReEnterPassword.value = "";
        }
    }

function createMyRecipes() {

    let myRecipesBtn = document.createElement("button");
    myRecipesBtn.id = "myRecipesBtn";
    myRecipesBtn.innerText = "My Recipes";
    myRecipesBtn.type = "button";
    myRecipesBtnConatainer.appendChild(myRecipesBtn);
    registerLoginContainer.appendChild(myRecipesBtnConatainer);
    myRecipesBtn.addEventListener("click", () => myRecipesBtnEventListener());
}

async function myRecipesBtnEventListener() {
    
    contentContainer.innerHTML = "";
    currentUserId = sessionStorage.getItem("current_user");
    let myRecipesHeaderContainer = document.createElement("div");
    let myRecipesHeader = document.createElement("h2");
    myRecipesHeader.innerText = "My Recipes";
    myRecipesHeaderContainer.appendChild(myRecipesHeader);
    let addNewRecipeContainer = document.createElement("div");
    let addNewRecipeBtn = document.createElement("button");
    addNewRecipeBtn.innerText = "Add a New Recipe";
    addNewRecipeContainer.appendChild(addNewRecipeBtn);
    let event = -1;
    addNewRecipeBtn.addEventListener("click", () => addNewRecipeBtnEventListener(event));
    let myRecipesContainer = document.createElement("div");

    await fetch ("http://localhost:8080/user/" + sessionStorage.getItem("current_user") + "/my-recipes")
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.length == 0) {
            let noRecipes = document.createElement("h3");
            noRecipes.innerText = "You don't currently have any personal recipes saved.";
            myRecipesContainer.appendChild(noRecipes);
        } else {
            data.forEach(recipe => {
                let singleRecipeContainer = document.createElement("div");
                singleRecipeContainer.id = "singleRecipeContainer";
                singleRecipeContainer.style.border = "1px solid black";
                singleRecipeContainer.style.margin = "2% 1% 2% 1%";
                singleRecipeContainer.style.padding = "1%"
                let singleRecipeHeader = document.createElement("h3");
                singleRecipeHeader.innerText = recipe.recipeName;
                let ingredientUl = document.createElement("ul");

                for(let i = 0; i < recipe.ingredients.length; i++) {
                    let li = document.createElement("li");
                    li.innerText = recipe.ingredients[i];
                    console.log(recipe.ingredients[i]);
                    ingredientUl.appendChild(li);
                }
    
                let recipeMethodText = document.createElement("p");
                recipeMethodText.innerText = recipe.recipeMethod;
    
                let recipeEditBtn = document.createElement("button");
                recipeEditBtn.type = "button";
                recipeEditBtn.innerText = "Edit Recipe";
                recipeEditBtn.id = recipe.userRecipeId;
                let event = recipe.userRecipeId;
                recipeEditBtn.addEventListener("click", () => addNewRecipeBtnEventListener(event, recipe.recipeName, recipe.recipeMethod));

                let deleteRecipeBtn = document.createElement("button");
                deleteRecipeBtn.type = "button";
                deleteRecipeBtn.innerText = "Delete Recipe"
                deleteRecipeBtn.id = "d" + recipe.userRecipeId;
                deleteRecipeBtn.addEventListener("click", () => deleteRecipeBtnEventListener(deleteRecipeBtn.id));
    
                singleRecipeContainer.append(singleRecipeHeader, ingredientUl, recipeMethodText, recipeEditBtn, deleteRecipeBtn);
                myRecipesContainer.appendChild(singleRecipeContainer);
            })
        }
    })

    let divider = document.createElement("div");
    divider.style.width = "100vw";
    divider.style.height = "5px";
    divider.style.backgroundColor = "black";

    let likedRecipesContainer = document.createElement("div");
    let likedRecipesHeader = document.createElement("h2");
    likedRecipesHeader.innerText = "My Liked Recipes";
    let likedRecipesList = document.createElement("ul");

    await fetch("http://localhost:8080/user/" + sessionStorage.getItem("current_user") + "/my-recipes/liked-recipes")
    .then(res => res.json())
    .then(data => {
        if (data.length == 0) {
            let noRecipes = document.createElement("h3");
            noRecipes.innerText = "You don't currently have any liked recipes.";
            likedRecipesContainer.appendChild(noRecipes);
        } else {
            data.forEach(recipe => {
                console.log(recipe);
                fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + recipe.recipeNumber) 
                .then(res => res.json())
                .then(data1 => {
                    console.log(data1);
                    let li = document.createElement("li");
                    li.innerText = data1.meals[0].strMeal;
                    li.style.cursor = "pointer";
                    likedRecipesList.appendChild(li);
                    let recipeNameContainer = document.createElement("div");
                    let recipeName = document.createElement("h2");
                    recipeName.innerText = data1.meals[0].strMeal;
                    recipeName.style.cursor = "pointer";
                    recipeName.style.textAlign = "center";
                    recipeNameContainer.appendChild(recipeName);
                    let recipeImageContainer = document.createElement("div");
                    recipeImageContainer.id = "RecipeDiv" + data1.meals[0].idMeal; 
                    recipeImageContainer.style.position = "relative";
                    recipeImageContainer.style.textAlign = "center";
                    recipeImageContainer.style.width = "100vw";
                    let recipeImage = document.createElement("img");
                    recipeImage.style.cursor = "pointer";
                    recipeImage.style.width = "50%";
                    recipeImage.src = data1.meals[0].strMealThumb;
                    recipeImage.id = data1.meals[0].idMeal; 
                    recipeImages.push(recipeImage);
                    recipeImageContainer.appendChild(recipeImage);
                    let alreadyLiked = true;
                    li.addEventListener("click", () => toMeal(alreadyLiked, recipeName, recipeImage, data1, sessionStorage.getItem("current_user")));
                })
            
            })
        }
    })

    likedRecipesContainer.append(likedRecipesHeader, likedRecipesList);

    contentContainer.append(myRecipesHeaderContainer, addNewRecipeContainer, myRecipesContainer, divider, likedRecipesContainer);
}

function addNewRecipeBtnEventListener(event, recipeName, method) {

    recipeDialog.innerHTML = "";
    recipeDialog.style.position = "absolute";
    recipeDialog.style.top = "10%";
    let newRecipeForm = document.createElement("form");
    let newRecipeFormName = document.createElement("input");
    newRecipeFormName.placeholder = "Recipe Name";
    newRecipeFormName.required = "true";
    newRecipeFormName.name = "newRecipeName";
    
    let ingredientsLabel = document.createElement("label");
    ingredientsLabel.innerText = "Add Ingredients (max 10)";
    
    let ingredientDiv = document.createElement("div");
    let newRecipeIngredient = document.createElement("input");
    newRecipeIngredient.name = "ingredient";
    newRecipeIngredient.placeholder = "Ingredient";
    
    let newIngredientBtn = document.createElement("button");
    newIngredientBtn.type = "button";
    newIngredientBtn.innerText = "Add Another Ingredient";
    
    ingredientDiv.append(newRecipeIngredient, newIngredientBtn);
    
    sessionStorage.setItem("count", 0);
    newIngredientBtn.addEventListener("click", () => newIngredientBtnEventListener(ingredientDiv));
    
    let newRecipeMethod = document.createElement("textarea");
    newRecipeMethod.placeholder = "Method";
    newRecipeMethod.style.width = "50vw";
    newRecipeMethod.style.height = "20vw";
    newRecipeMethod.maxLength = "200";
    newRecipeMethod.required = "true";
    newRecipeMethod.name = "method";
    
    if (event != -1) {
        newRecipeFormName.value = recipeName;
        newRecipeMethod.value = method;
    }
    let submitRecipeBtn = document.createElement("button");
    submitRecipeBtn.type = "button";
    submitRecipeBtn.innerText = "Save Recipe";

    let cancelBtn = document.createElement("button");
    cancelBtn.type= "button";
    cancelBtn.innerText = "Cancel";
    cancelBtn.addEventListener("click", () => cancelBtnEventListener())

    newRecipeForm.append(newRecipeFormName, ingredientsLabel, ingredientDiv, newIngredientBtn, newRecipeMethod, submitRecipeBtn, cancelBtn);
    recipeDialog.appendChild(newRecipeForm);
    recipeDialog.setAttribute("open", true);
    contentContainer.appendChild(recipeDialog);
    
    submitRecipeBtn.addEventListener("click", () => submitRecipeBtnEventListener(event, newRecipeFormName, newRecipeMethod));
}

function newIngredientBtnEventListener(ingredientDiv) {
    
    let count;

    if (sessionStorage.getItem("count")) {
        count = sessionStorage.getItem("count");
    } else {
        sessionStorage.setItem("count", 0);
    }   

    if (count < 10) {
        let newRecipeIngredient = document.createElement("input");
        newRecipeIngredient.placeholder = "Ingredient";
        newRecipeIngredient.name = "ingredient";
        ingredientDiv.appendChild(newRecipeIngredient);
        let newCount = parseInt(count) + 1;
        sessionStorage.setItem("count", newCount);
    } else {
        alert("Only 10 ingredients allowed.")
    }
}

async function submitRecipeBtnEventListener(event, newRecipeFormName, newRecipeMethod) {
    
    if (event == -1) {
        if (newRecipeFormName.value.trim() != "" && newRecipeMethod.value.trim() != "") {
            let ingredients = document.getElementsByName("ingredient");
            let ingredientsArray = Array.from(ingredients).map(ing => ing.value.trim()).filter(value => value != "");
    
            await fetch("http://localhost:8080/user/" + sessionStorage.getItem("current_user") + "/my-recipes/add-recipe", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    userId : sessionStorage.getItem("current_user"),
                    recipeName: newRecipeFormName.value,
                    ingredients: ingredientsArray,
                    recipeMethod : newRecipeMethod.value
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                contentContainer.innerHTML = "";
            })       
        }
    } else {
        if (newRecipeFormName.value.trim() != "" && newRecipeMethod.value.trim() != "") {
            let ingredients = document.getElementsByName("ingredient");
            let ingredientsArray = Array.from(ingredients).map(ing => ing.value.trim()).filter(value => value != "");
    
            await fetch("http://localhost:8080/user/" + sessionStorage.getItem("current_user") + "/my-recipes/" + event + "/edit-recipe", {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    userId : sessionStorage.getItem("current_user"),
                    recipeName: newRecipeFormName.value,
                    ingredients: ingredientsArray,
                    recipeMethod : newRecipeMethod.value
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })       
        }   
    }
    contentContainer.innerHTML = "";
    myRecipesBtnConatainer.innerHTML = "";
    registerBtnContainer.innerHTML = "";
    logBtnContainer.innerHTML = "";
    createRegister();
    createMyRecipes();
    recipeDialog.innerHTML = "";
    recipeDialog.removeAttribute("open");

    myRecipesBtnEventListener();
}

async function deleteRecipeBtnEventListener(deleteRecipeBtnid) {

    let confirmation = window.confirm("Are you sure?");
    if(confirmation) {
        await fetch("http://localhost:8080/user/" + sessionStorage.getItem("current_user") + "/my-recipes/" + deleteRecipeBtnid.replace(/\D/g, "") + "/delete-recipe", {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(res => res.text())
        .then(data => {
            registerBtnContainer.innerHTML = "";
            logBtnContainer.innerHTML = "";
            createLogout();
            recipeDialog.innerHTML = "";
            recipeDialog.removeAttribute("open");
            myRecipesBtnEventListener();
            myRecipesBtnConatainer.innerHTML = "";
            alert(data)
        })
    }
}

function cancelBtnEventListener() {
    recipeDialog.removeAttribute("open");
    registerLoginPopUp.removeAttribute("open");
}