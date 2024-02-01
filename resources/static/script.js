
//const userRecipeContainer = document.getElementById("userRecipeContainer");

const contentContainer = document.getElementById("contentContainer");
const registerBtnContainer = document.getElementById("registerBtnContainer");
const logBtnContainer = document.getElementById("logBtnContainer");
const home = document.getElementById("home");
const registerLoginContainer = document.getElementById("registerLoginContainer");
const registerLoginPopUp = document.getElementById("registerLoginPopUp");
const registerBtn = document.getElementById("registerBtn");

let isLoggedIn = false;
let currentUserId = 0;
let recipeImages = []; 

loadRandomRecipes();

if (isLoggedIn == false) {
    createLogin();
    createRegister();
} else {
    createLogout();
}

home.addEventListener("click", async () => {
    contentContainer.innerHTML="";
    registerLoginPopUp.removeAttribute("open");
    loadRandomRecipes();
    console.log("homepage");
})

async function loadRandomRecipes() {
    let randomRecipeContainer = document.createElement("div");
    let randomRecipeOptionsContainer = document.createElement("div");
    let recipeSuggestions = document.createElement("h2");
    recipeSuggestions.innerText = "Todays Recipe Suggestions...";
    randomRecipeContainer.appendChild(randomRecipeOptionsContainer);
    contentContainer.append(recipeSuggestions, randomRecipeContainer);
    
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer);
    await randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer);
}

async function randomRecipe(randomRecipeContainer, randomRecipeOptionsContainer) {
    
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        
        let recipeNameContainer = document.createElement("div");
        let recipeName = document.createElement("h2");
        recipeName.innerText = data.meals[0].strMeal;
        recipeName.style.cursor = "pointer";
        recipeName.style.textAlign = "center";
        recipeNameContainer.appendChild(recipeName);
        
        //console.log(data.meals[0].strMeal);
        
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
        
        recipeName.addEventListener("click", () => {
            toMeal(recipeName, recipeImage, heartImage, data);
        })

        recipeImage.addEventListener("click", ()=> {
            toMeal(recipeName, recipeImage, heartImage, data)
        });
        
        //console.log(recipeName.innerText + " loading complete");
        
        if(randomRecipeContainer.innerHTML != "") {
            randomRecipeContainer.append(recipeNameContainer, recipeImageContainer);
        } else {
            randomRecipeOptionsContainer.append(recipeNameContainer, recipeImageContainer);
        }
    })
}

async function toMeal(recipeName, recipeImage, heartImage, data) {

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

    heartImage.src = "/resources/static/images/heartEmpty.png";
    heartImage.style.position = "absolute";
    heartImage.style.top = "0.5%";
    heartImage.style.right = "27%";
    heartImage.style.width = "50px";
    heartImage.style.height = "50px";
    heartImage.style.zIndex = "2";
    heartImage.id = "heart" + recipeImage.id;

    recipeImageContainer.append(recipeImage, heartImage);
    let recipeInstructionsContainer = document.createElement("div");
    recipeInstructionsContainer.style.width = "95vw";
    let recipeInstructions = document.createElement("p");
    recipeInstructions.innerText = data.meals[0].strInstructions;
    recipeInstructions.style.width = "95%";
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

function createLogout() {

    registerBtnContainer.innerHTML = "";
    logBtnContainer.innerHTML = "";
    let loginBtn = document.createElement("button");
    loginBtn.innerText = "Log out"
    logBtnContainer.appendChild(loginBtn);
    currentUserId = 0;
    
    loginBtn.addEventListener("click", () => {
        console.log("click logout")
        fetch("http://localhost:8080/custom-logout", {
            mode: "no-cors",
            method: "POST",
            credentials: "include"
        })
        
        isLoggedIn = false;
        console.log("logout");
        registerLoginPopUp.removeAttribute("open");
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
        registerFormUsername.setAttribute("required", "true");
        let registerFormPassword = document.createElement("input");
        registerFormPassword.placeholder = "Password";
        registerFormPassword.setAttribute("required", "true");
        let registerFormFirstName = document.createElement("input");
        registerFormFirstName.placeholder = "FirstName";
        registerFormFirstName.setAttribute("required", "true");
        let registerFormLastName = document.createElement("input");
        registerFormLastName.placeholder = "Last Name";
        registerFormLastName.setAttribute("required", "true");
        let registerFormEmail = document.createElement("input");
        registerFormEmail.placeholder = "Email";
        registerFormEmail.setAttribute("required", "true");
        let registerFormSubmit = document.createElement("button");
        registerFormSubmit.type = "button";
        registerFormSubmit.innerText = "Register";
        registerForm.append(registerFormUsername, registerFormPassword, registerFormFirstName, registerFormLastName, registerFormEmail, registerFormSubmit);
        registerLoginPopUp.appendChild(registerForm);
        registerLoginPopUp.setAttribute("open", "true");
    
        registerFormSubmit
    
        
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
                        isLoggedIn = true;
                        currentUserId = data.id;
                        console.log(currentUserId);
                        createHeartImage(currentUserId);
                        createLogout();
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

function createHeartImage(currentUserId) {

    console.log(currentUserId);
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
            heartImage.addEventListener("click", () => heartImageEventListener(heartImage, currentUserId));
    })
        
}

function heartImageEventListener(heartImage, currentUserId) {
    
    let recipeId = heartImage.id.replace(/\D/g, "");

    if (heartImage.src.includes("/resources/static/images/heartEmpty.png")) {
        console.log(currentUserId);
        console.log(recipeId);
        
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
                .then(res => res.text)
                .then(data => {
                    console.log(data);
                    heartImage.src="/resources/static/images/heartRed.png";
                    alert(data)
                })
    
            } catch {
                alert("Something went wrong")
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
            .then(res => res.text)
            .then(data => {
                console.log(data);
                alert(data);
                heartImage.src = "/resources/static/images/heartEmpty.png";
            })
        } catch {
            console.log("red");

        }
    }
}