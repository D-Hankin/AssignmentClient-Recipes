
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
console.log("Start: " + currentUserId);
if (typeof currentUserId != "undefined" && currentUserId != 0) {
    console.log(currentUserId);
    createLogout(currentUserId);
    loadRandomRecipes(currentUserId);
} else {
    loadRandomRecipes(currentUserId)
    createLogin();
    createRegister();
}




home.addEventListener("click", async () => {
    contentContainer.innerHTML="";
    registerLoginPopUp.removeAttribute("open");
    loadRandomRecipes(currentUserId);
    console.log("home: " + currentUserId);
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
    
    console.log("Random: " + currentUserId);
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
    console.log("to meal: " + currentUserId);
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
        localStorage.setItem("current_user", 0);
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
        registerForm.append(registerFormUsername, registerFormPassword, registerFormReEnterPassword, registerFormFirstName, registerFormLastName, registerFormEmail, registerFormSubmit);
        registerLoginPopUp.appendChild(registerForm);
        registerLoginPopUp.setAttribute("open", "true");
    
        registerFormSubmit.addEventListener("click", () => registerFormSubmitEventListener(registerFormUsername, registerFormPassword, registerFormReEnterPassword, registerFormFirstName, 
            registerFormLastName, registerFormEmail));
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
                        console.log(currentUserId);
                        localStorage.setItem("current_user", currentUserId);
                        createHeartImage(recipeImages, currentUserId);
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

function createHeartImage(recipeImages, currentUserId) {

    if (Array.isArray(recipeImages)) {

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
            .then(res => res.text())
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

async function registerFormSubmitEventListener(registerFormUsername, registerFormPassword, registerFormReEnterPassword, registerFormFirstName, 
    registerFormLastName, registerFormEmail) {

        let usernameTaken = false;

        if (registerFormPassword.value == registerFormReEnterPassword.value) {

            if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(registerFormEmail.value) && registerFormUsername.value.trim() != "" && registerFormFirstName.value.trim() != ""
                 && registerFormLastName.value.trim() != "" && registerFormPassword.value.trim() != "") {
                fetch("http://localhost:8080/users")
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    console.log(registerFormUsername.value);
                    for(let i = 0; i < data.length; i++) {
                        if (registerFormUsername.value == data[i].username) {
                            console.log(data[i].username);
                            registerFormUsername.value = ""
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
                                console.log(data)
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