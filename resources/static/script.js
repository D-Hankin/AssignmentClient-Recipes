
//const userRecipeContainer = document.getElementById("userRecipeContainer");

const contentContainer = document.getElementById("contentContainer");
const registerBtnContainer = document.getElementById("registerBtnContainer");
const logBtnContainer = document.getElementById("logBtnContainer");
const home = document.getElementById("home");
const registerLoginContainer = document.getElementById("registerLoginContainer");
const registerLoginPopUp = document.getElementById("registerLoginPopUp");
const registerBtn = document.getElementById("registerBtn");

let recipeImages = []; 
let currentUserId = localStorage.getItem("current_user");

if (typeof currentUserId != "undefined" && currentUserId != 0) {
    createLogout(currentUserId);
    loadRandomRecipes(currentUserId);
    createMyRecipes();
} else {
    loadRandomRecipes(currentUserId)
    createLogin();
    createRegister();
}

home.addEventListener("click", async () => {

    contentContainer.innerHTML="";
    registerLoginPopUp.removeAttribute("open");
    currentUserId = localStorage.getItem("current_user");
    console.log("home: " + currentUserId);
    loadRandomRecipes(currentUserId);
    
    if (currentUserId != 0) {
        createHeartImage(recipeImages, currentUserId);
    }
})

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

    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
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
        console.log(data);
        
        if (currentUserId != 0 && typeof currentUserId !== "undefined") {
            createHeartImage(recipeImage, currentUserId);
        }
        
        recipeName.addEventListener("click", () => {
            toMeal(recipeName, recipeImage, data, currentUserId);
        })

        recipeImage.addEventListener("click", ()=> {
            toMeal(recipeName, recipeImage, data, currentUserId)
        });
        
        if(randomRecipeContainer.innerHTML != "") {
            randomRecipeContainer.append(recipeNameContainer, recipeImageContainer);
        } else {
            randomRecipeOptionsContainer.append(recipeNameContainer, recipeImageContainer);
        }
    })
}

async function toMeal(recipeName, recipeImage, data, currentUserId) {

    contentContainer.innerHTML="";
    recipeName.style.cursor = "";
    recipeImage.style.cursor = "";

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
        if (ingredientsArray[i].trim() != "") {
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
    currentUserId = localStorage.getItem("current_user");
    console.log(currentUserId);
    if(currentUserId != 0) {
        createHeartImage(recipeImage, currentUserId);
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
        loginForm.append(loginFormUsername, loginFormPassword, loginFormSubmit);
        registerLoginPopUp.appendChild(loginForm);
        registerLoginPopUp.setAttribute("open", "true");

        loginFormSubmitEventListener(loginFormUsername, loginFormPassword, loginFormSubmit);
    })
}

function createLogout(currentUserId) {

    registerBtnContainer.innerHTML = "";
    logBtnContainer.innerHTML = "";
    let loginBtn = document.createElement("button");
    loginBtn.innerText = "Log out"
    logBtnContainer.appendChild(loginBtn);
    
    loginBtn.addEventListener("click", () => {
        currentUserId = 0;
        fetch("http://localhost:8080/custom-logout", {
            mode: "no-cors",
            method: "POST",
            credentials: "include"
        })
        
        registerLoginPopUp.removeAttribute("open");
        localStorage.setItem("current_user", 0);
        let removeHearts = document.querySelectorAll("[id*='heart']");
        removeHearts.forEach(function(heart) {
            heart.parentElement.removeChild(heart);
        });

        createLogin();
        createRegister();
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
        registerForm.append(registerFormUsername, registerFormPassword, registerFormReEnterPassword, registerFormFirstName, registerFormLastName, registerFormEmail, 
            registerFormSubmit);
        registerLoginPopUp.appendChild(registerForm);
        registerLoginPopUp.setAttribute("open", "true");
    
        registerFormSubmit.addEventListener("click", () => registerFormSubmitEventListener(registerLoginPopUp, registerFormUsername, registerFormPassword, registerFormReEnterPassword, 
            registerFormFirstName, registerFormLastName, registerFormEmail));
    })
}

async function loginFormSubmitEventListener(loginFormUsername, loginFormPassword, loginFormSubmit) {

    loginFormSubmit.addEventListener("click", () => {

        if (loginFormUsername.value.trim() != "" && loginFormPassword.value.trim() != "") {
            registerLoginPopUp.removeAttribute("open");
            let loginAttempt = {
                username: loginFormUsername.value,
                password: loginFormPassword.value
            }
            try {  
                fetch("http://localhost:8080/custom-login", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(loginAttempt)
                })
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        currentUserId = data.id;
                        localStorage.setItem("current_user", currentUserId);
                        createHeartImage(recipeImages, currentUserId);
                        createLogout();
                        createMyRecipes();
                    } else {
                        alert("Invalid username or password.")
                    }
                })
            } catch {
                alert("Something went wrong. Please try again");
            }  
        } else {
            alert("Please enter a username and password");
        }
    })
}

function createHeartImage(recipeImages, currentUserId) {

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
            heartImage.addEventListener("click", () => heartImageEventListener(heartImage, currentUserId));
    }  
}

function heartImageEventListener(heartImage, currentUserId) {
    
    let recipeId = heartImage.id.replace(/\D/g, "");

    if (heartImage.src.includes("/resources/static/images/heartEmpty.png")) {
        if(currentUserId != 0) {
            try {
                fetch("http://localhost:8080/user/" + currentUserId + "/my-recipes/add-liked-recipe/" + recipeId, {
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
            fetch("http://localhost:8080/user/" + currentUserId + "/my-recipes/remove-liked-recipe/" + recipeId, {
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

                fetch("http://localhost:8080/users")
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

    let myRecipesBtnConatainer = document.createElement("div");
    let myRecipesBtn = document.createElement("button");
    myRecipesBtn.innerText = "My Recipes";
    myRecipesBtn.type = "button";
    myRecipesBtnConatainer.appendChild(myRecipesBtn);
    registerLoginContainer.appendChild(myRecipesBtnConatainer);
    
    myRecipesBtn.addEventListener("click", () => myRecipesBtnEventListener());
}

function myRecipesBtnEventListener() {
    
    contentContainer.innerHTML = "";
    currentUserId = localStorage.getItem("current_user");

    let myRecipesHeaderContainer = document.createElement("div");
    let myRecipesHeader = document.createElement("h2");
    myRecipesHeader.innerText = "My Recipes";
    myRecipesHeaderContainer.appendChild(myRecipesHeader);
    let addNewRecipeContainer = document.createElement("div");
    let addNewRecipeBtn = document.createElement("button");
    addNewRecipeBtn.innerText = "Add a New Recipe";
    addNewRecipeContainer.appendChild(addNewRecipeBtn);
    addNewRecipeBtn.addEventListener("click", () => addNewRecipeBtnEventListerner());

    contentContainer.append(myRecipesHeaderContainer, addNewRecipeContainer);
}

function addNewRecipeBtnEventListerner() {
    
    let newRecipeDialog = document.createElement("dialog");
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

    localStorage.setItem("count", 0);
    newIngredientBtn.addEventListener("click", () => newIngredientBtnEventListener(ingredientDiv));

    let newRecipeMethod = document.createElement("textarea");
    newRecipeMethod.placeholder = "Method";
    newRecipeMethod.style.width = "50vw";
    newRecipeMethod.style.height = "20vw";
    newRecipeMethod.maxLength = "200";
    newRecipeMethod.required = "true";
    newRecipeMethod.name = "method";

    let submitRecipeBtn = document.createElement("button");
    submitRecipeBtn.type = "button";
    submitRecipeBtn.innerText = "Save Recipe";

    
    newRecipeForm.append(newRecipeFormName, ingredientsLabel, ingredientDiv, newIngredientBtn, newRecipeMethod, submitRecipeBtn);
    newRecipeDialog.appendChild(newRecipeForm);
    newRecipeDialog.setAttribute("open", true);
    contentContainer.appendChild(newRecipeDialog);
    
    submitRecipeBtn.addEventListener("click", () => submitRecipeBtnEventListener(newRecipeForm, newRecipeFormName, newRecipeMethod));
}

function newIngredientBtnEventListener(ingredientDiv) {
    
    count = localStorage.getItem("count");

    if (count < 10) {
        let newRecipeIngredient = document.createElement("input");
        newRecipeIngredient.placeholder = "Ingredient";
        newRecipeIngredient.name = "ingredient";
        ingredientDiv.appendChild(newRecipeIngredient);
        let newCount = parseInt(count) + 1;
        localStorage.setItem("count", newCount);
        console.log(newCount);
    } else {
        alert("Only 10 ingredients allowed.")
    }
}

function submitRecipeBtnEventListener(newRecipeForm, newRecipeFormName, newRecipeMethod) {
    
    if (newRecipeFormName.value.trim() != "" && newRecipeMethod.value.trim() != "") {
        let ingredients = document.getElementsByName("ingredient");
        let ingredientsArray = Array.from(ingredients).map(ing => ing.value.trim()).filter(value => value != "");

        console.log(localStorage.getItem("current_user"));
        console.log(newRecipeFormName.value);
        console.log(ingredientsArray);
        console.log(newRecipeMethod.value);

        fetch("http://localhost:8080/user/" + localStorage.getItem("current_user") + "/my-recipes/add-recipe", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                userId : localStorage.getItem("current_user"),
                recipeName: newRecipeFormName.value,
                ingredients: ingredientsArray,
                recipeMethod : newRecipeMethod.value

                // userId : "123456",
                // recipeName: "Moose",
                // ingredients: ["a", "b"],
                // recipeMethod : "Poo"
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })       
    }
}