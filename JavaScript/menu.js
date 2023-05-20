// Declaring variables
const dashboardLinks = document.querySelectorAll(".links li a");
const profileImage = document.getElementById("profileImage");
const scrollButton = document.getElementById("scrollButton");
const cart = document.querySelector(".cart");
const foodsContainer = document.querySelector(".foods");
const profileButton = document.querySelector(".cart .user-profile");
const signupForm = document.querySelector(".cart .signup-form");
const loginForm = document.querySelector(".cart .login-form");
const loginSwitchLink = document.getElementById("loginSwitcher");
const signupSwitchLink = document.getElementById("signupSwitcher");
const foodFilters = document.querySelectorAll(".content.home .menu .category");
const favFilter = foodFilters[foodFilters.length - 1];
const cartMoney = document.getElementById("money");
const searchInput = document.getElementById("search");
const logoutButton = document.getElementById("logout");
const viewAllFoodButton = document.querySelector(".view-all");
const ordersContainer = document.querySelector(".menu .orders");
const removeAllFoodButton = document.getElementById("remove-all");
const checkOutButton = document.getElementById("check");
const foodEmptyMessage = document.getElementById("message");
let usersArray; // users who have accounts
let currentUser; // current user who is signed in
// WHen the page is loaded
window.onload = () => {
  // Pizza filter (default)
  foodsFetching("Pizza");
  if (window.localStorage.users) {
    usersArray = JSON.parse(window.localStorage.users);
  } else {
    usersArray = [];
  }

  if (window.localStorage.currentUser) {
    currentUser = JSON.parse(window.localStorage.currentUser);
    calculatingMoneyCart();
    createOrderItem();
    signedUser(true);
    if (currentUser.orders.length == 0) {
      setTimeout(() => {
        clearCart();
      }, 100);
    }
  } else {
    currentUser = {};
    signedUser(false);
    repeatingPopup();
    favFilter.style.display = "none";
    setTimeout(() => {
      clearCart();
    }, 100);
  }
};

function repeatingPopup() {
  let handler = setInterval(() => {
    if (window.localStorage.currentUser) {
      clearInterval(handler);
    }
    if (
      !window.localStorage.currentUser &&
      document.body.firstElementChild.className != "login-advice-box" &&
      !signupForm.classList.contains("open-close")
    ) {
      popupLogin();
    }
  }, 30000); // Every 30 seconds
}

function popupLogin() {
  // <HTML>
  let popupBox = document.createElement("div");
  popupBox.className = "login-advice-box";

  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("Login"));
  popupBox.appendChild(h2);

  let p = document.createElement("p");
  p.appendChild(
    document.createTextNode(
      "You need to signup/login to order your food & to access the rest of the pages."
    )
  );
  popupBox.appendChild(p);

  let confirmButton = document.createElement("button");
  confirmButton.className = "button-style";
  confirmButton.appendChild(document.createTextNode("Proceed"));
  let confirmIcon = document.createElement("i");
  confirmIcon.className = "fa fa-arrow-circle-right";
  confirmButton.appendChild(confirmIcon);
  confirmButton.addEventListener("click", proceedLogin);
  popupBox.appendChild(confirmButton);

  let cancelButton = document.createElement("button");
  cancelButton.className = "button-style";
  let cancelIcon = document.createElement("i");
  cancelIcon.className = "fa fa-x";
  cancelButton.appendChild(cancelIcon);
  cancelButton.addEventListener("click", cancelPopup);
  popupBox.appendChild(cancelButton);

  document.body.prepend(popupBox);
  // </HTML>
  document.body.classList.add("backdrop-bg");

  function cancelPopup() {
    document.body.classList.remove("backdrop-bg");
    document.body.children[0].remove();
  }
  function proceedLogin() {
    cancelPopup();
    profileButton.click();
    openCartButton.click();
  }
}

// Open cart for small screens
const openCartButton = document.querySelector(".open-cart");
openCartButton.onclick = () => {
  cart.classList.add("opens");
};

// Close cart for small screens
const closeCartButton = document.querySelector(".cart .close-cart");
closeCartButton.onclick = () => {
  cart.classList.remove("opens");
  // profileButton.click();
};

// Getting the data from the JSON FIle
async function foodsFetching(foodType) {
  let foods = await (await fetch("foods.json")).json();

  switch (foodType) {
    case "all":
      createFoodBox(foods);
      break;
    case "Pizza":
    case "Burger":
    case "Hotdog":
    case "Fish":
    case "Snacks":
    case "Drinks":
      foods = foods.filter((e) => e.type == foodType);
      createFoodBox(foods);
      break;
    case "Favourits":
      let favFoods = [];
      foods.forEach((f) => {
        currentUser.favFoods.forEach((c) => {
          if (f.code == c) {
            favFoods.push(f);
          }
        });
      });
      createFoodBox(favFoods);
      break;
    default: // Search
      foods = foods.filter((e) => e.name.toLowerCase().startsWith(foodType));
      createFoodBox(foods);
  }
}

// Food Filters
foodFilters.forEach((f) => {
  f.onclick = () => {
    // Clear the search input if any
    searchInput.value = "";

    foodFilters.forEach((f) => f.classList.remove("active"));
    f.classList.add("active");
    let foodName = f.children[1].innerHTML;
    foodsFetching(foodName);

    setTimeout(() => {
      if (foodsContainer.innerHTML == "") {
        foodsContainer.appendChild(foodEmptyMessage);
      }
    }, 100);
  };
});

viewAllFoodButton.onclick = () => {
  foodsFetching("all");
  foodFilters.forEach((f) => f.classList.remove("active"));
};

// Serach Input
searchInput.onkeyup = () => {
  foodsFetching(searchInput.value);
  // Remove active class from the filters
  foodFilters.forEach((f) => f.classList.remove("active"));

  // Display the "Not found" message
  setTimeout(() => {
    if (foodsContainer.innerHTML == "") {
      let noFoodMessage = document.createElement("span");
      noFoodMessage.className = "empty-food-message";
      let icon = document.createElement("i");
      icon.className = "fa-solid fa-circle-exclamation";
      noFoodMessage.appendChild(icon);
      noFoodMessage.appendChild(
        document.createTextNode(`"${searchInput.value}" not found`)
      );
      foodsContainer.appendChild(noFoodMessage);
    }
  }, 100);
};

// Creating the food boxs
function createFoodBox(array) {
  foodsContainer.innerHTML = "";
  let animationTime = 100;
  for (let i = 0; i < array.length; i++) {
    // <HTML>
    let food = document.createElement("div");
    food.className = "food";
    food.setAttribute("data-code", array[i].code);
    food.style.animationDelay = `${animationTime}ms`;
    animationTime += 100;
    //IF the user is a guest
    if (!window.localStorage.currentUser) {
      // This will not allow guests to order food
      food.classList.add("block");
    }

    let btn = document.createElement("Button");
    btn.className = "add-fav";
    btn.addEventListener("click", addFavFoods);
    if (window.localStorage.currentUser) {
      // This for saving the fav foods of the user
      if (currentUser.favFoods.indexOf(food.getAttribute("data-code")) != -1) {
        btn.classList.add("added");
      }
    }
    let btnIcon = document.createElement("i");
    btnIcon.className = "fa fa-heart";
    btn.appendChild(btnIcon);
    food.appendChild(btn);

    let foodImage = document.createElement("img");
    foodImage.src = array[i].src;
    food.appendChild(foodImage);

    let foodDescriptions = document.createElement("div");
    foodDescriptions.className = "description";

    let foodDetails = document.createElement("div");
    foodDetails.className = "food-details";

    let foodPriceRate = document.createElement("div");
    foodPriceRate.className = "food-price-rate";

    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(array[i].name));
    foodDescriptions.appendChild(h3);

    let stars = document.createElement("div");
    stars.className = "stars";
    for (let j = 0; j < 5; j++) {
      let star = document.createElement("i");
      star.className = "fa fa-star";
      if (j >= array[i].stars) {
        star.classList.add("fa-regular");
      }

      stars.appendChild(star);
    }
    foodPriceRate.appendChild(stars);

    let foodPrice = document.createElement("div");
    foodPrice.className = "price";
    let dollarIcon = document.createElement("i");
    dollarIcon.className = "fa-solid fa-dollar-sign";
    foodPrice.appendChild(dollarIcon);
    let foodAmount = document.createElement("span");
    foodAmount.className = "amount";
    foodAmount.appendChild(document.createTextNode(" " + array[i].price));
    foodPrice.appendChild(foodAmount);

    foodPriceRate.appendChild(foodPrice);
    foodDetails.appendChild(foodPriceRate);

    let addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.setAttribute("data-code", array[i].code);
    addButton.addEventListener("click", addFoodToCart);
    let plusIcon = document.createElement("i");
    plusIcon.className = "fa fa-plus";
    addButton.appendChild(plusIcon);
    foodDetails.appendChild(addButton);

    foodDescriptions.appendChild(foodDetails);
    food.appendChild(foodDescriptions);
    foodsContainer.appendChild(food);
    // </HTML>
  }
}
// Add button function
function addFoodToCart(e) {
  let foodCode = e.currentTarget.getAttribute("data-code");
  let foodPrice =
    +e.currentTarget.parentElement.children[0].children[1].children[1]
      .innerHTML;
  let foodImg = e.currentTarget.parentElement.parentElement.previousSibling.src;
  let foodName = e.currentTarget.parentElement.previousSibling.innerHTML;

  if (matchCode()) {
    var sameFood;
    sameFood.quantity = sameFood.quantity + 1;
    sameFood.price += foodPrice;
  } else {
    let obj = {
      img: foodImg,
      foodName: foodName,
      foodCode: foodCode,
      quantity: 1,
      price: foodPrice,
      pricePerOne: foodPrice,
    };
    currentUser.orders.push(obj);
  }
  window.localStorage.currentUser = JSON.stringify(currentUser);

  calculatingMoneyCart();
  createOrderItem();

  saveToUsersArray();

  function matchCode() {
    let bool = false;
    currentUser.orders.forEach((o) => {
      if (o.foodCode == foodCode) {
        sameFood = o;
        bool = true;
      }
    });
    return bool;
  }
}
console.log(foodEmptyMessage);
function addFavFoods(e) {
  let btn = e.currentTarget;
  let foodCode = btn.parentElement.getAttribute("data-code");

  if (!btn.classList.contains("added")) {
    btn.classList.add("added");
    currentUser.favFoods.push(foodCode);
  } else {
    btn.classList.remove("added");
    currentUser.favFoods = currentUser.favFoods.filter((e) => {
      return e != foodCode;
    });

    foodFilters.forEach((f) => {
      // This for removing the foods after UnFav them (only for the fav filter)
      if (f.classList.contains("fav") && f.classList.contains("active")) {
        btn.parentElement.classList.add("remove-fav");
        setTimeout(() => {
          btn.parentElement.remove();
          if (foodsContainer.innerHTML == "") {
            foodsContainer.appendChild(foodEmptyMessage);
          }
        }, 1000);
      }
    });
  }
  window.localStorage.currentUser = JSON.stringify(currentUser);

  usersArray.forEach((e) => {
    if (e.email == currentUser.email) {
      e.favFoods = currentUser.favFoods;
    }
  });
  window.localStorage.users = JSON.stringify(usersArray);
}

//When clicking the profile button
profileButton.onclick = () => {
  profileButton.classList.toggle("open-close-login");
  profileButton.children[1].classList.toggle("open-close");
  signupForm.classList.toggle("open-close");
  loginForm.classList.remove("login-on");
};

// Go the the login form
loginSwitchLink.onclick = () => {
  loginForm.classList.add("login-on");
  // loginForm.children[1].children[0].children[1].children[0].focus();
};

// Return to the signup form
signupSwitchLink.onclick = () => {
  loginForm.classList.remove("login-on");
  // signupForm.children[1].children[0].children[1].children[0].focus();
};

// Signup inputs
let signupInputs = document.querySelectorAll(".signup-form input");
signupInputs.forEach((input) => {
  let rgx = new RegExp(`${input.getAttribute("data-match")}`, "gi");

  input.onkeyup = () => {
    if (input.value.trim() != "") {
      if (input.value.split(" ")[0].match(rgx)) {
        addRemoveClass(input, "passed", "error");
      } else {
        addRemoveClass(input, "error", "passed");
      }
    } else {
      addRemoveClass(input, "error", "passed");
    }
  };
  input.onblur = () => {
    input.value = input.value.split(" ")[0];
  };
});
// Signup Form
signupForm.children[1].onsubmit = (e) => {
  // Stop the website from reloading on submitting
  e.preventDefault();

  let emailLabel =
    signupInputs[2].parentElement.parentElement.firstElementChild;
  // Check whether the email is found or not
  if (checkEmail()) {
    addRemoveClass(signupInputs[2], "passed", "error");
    if (emailLabel.children.length == 1) {
      emailLabel.lastElementChild.remove();
    }
  } else {
    addRemoveClass(signupInputs[2], "error", "passed");

    if (emailLabel.children.length == 0) {
      // So the message wont be repeated
      if (signupInputs[2].value != "") {
        let message = document.createElement("span");
        message.appendChild(
          document.createTextNode(
            "This user already exit, please try a different one"
          )
        );
        emailLabel.appendChild(message);
      }
    }
  }

  if (checkInputs()) {
    /*
     Storing the signup informations in an object
      then pushing it to the array
      then saving it to the local Storage
    */
    let obj = {
      firstName: signupInputs[0].value,
      lastName: signupInputs[1].value,
      email: signupInputs[2].value,
      password: signupInputs[3].value,
      profileImage: "images/guest-pic.svg",
      orders: [],
      favFoods: [],
      bills: [],
    };
    // currentUserMenu.email = obj.email;
    usersArray.push(obj);
    window.localStorage.users = JSON.stringify(usersArray);

    // All inputs are good
    currentUser = obj;
    window.localStorage.currentUser = JSON.stringify(currentUser);
    // Clear the inputs and remove the passed class
    signupInputs.forEach((i) => {
      i.value = "";
      i.parentElement.classList.remove("passed");
    });
    // The user is now signed in
    signedUser(true);
    profileButton.click();
  } else {
    signupInputs.forEach((input) => {
      if (!input.parentElement.classList.contains("passed")) {
        input.parentElement.classList.add("error");
      }
    });
  }

  // Checking the inputs that has the passed class
  function checkInputs() {
    let bool = true;

    signupInputs.forEach((input) => {
      if (!input.parentElement.classList.contains("passed")) {
        bool = false;
      }
    });

    return bool;
  }

  // Check whether the email is found or not
  function checkEmail() {
    let bool = true;

    if (signupInputs[2].value == "") {
      bool = false;
    }
    usersArray.forEach((u) => {
      if (signupInputs[2].value == u.email) {
        bool = false;
      }
    });

    return bool;
  }
};

let loginInputs = document.querySelectorAll(".login-form input");
loginForm.children[1].onsubmit = (e) => {
  // Stop the website from reloading on submitting
  e.preventDefault();
  var obj;
  if (matchEmail()) {
    addRemoveClass(loginInputs[0], "passed", "error");

    if (matchEmailPassword()) {
      addRemoveClass(loginInputs[1], "passed", "error");
      // Both email and password are verified
      currentUser = obj;
      window.localStorage.currentUser = JSON.stringify(currentUser);

      // Clear the inputs and remove the passed class
      loginInputs.forEach((i) => {
        i.value = "";
        i.parentElement.classList.remove("passed");
      });
      // The user is now signed in
      signedUser(true);
      signupSwitchLink.click();
      profileButton.click();
      calculatingMoneyCart();
      createOrderItem();

      if (currentUser.orders.length == 0) {
        clearCart();
      }

      // window.location.reload()
    } else {
      addRemoveClass(loginInputs[1], "error", "passed");
    }
  } else {
    addRemoveClass(loginInputs[0], "error", "passed");
    addRemoveClass(loginInputs[1], "error", "passed");
  }

  function matchEmail() {
    let found = false;
    usersArray.forEach((u) => {
      if (loginInputs[0].value.trim() == u.email) {
        found = true;
        obj = u;
      }
    });
    return found;
  }

  function matchEmailPassword() {
    let found = false;
    usersArray.forEach((u) => {
      if (loginInputs[0].value.trim() == u.email)
        if (loginInputs[1].value.trim() == u.password) {
          found = true;
        }
    });
    return found;
  }
};

// Add and remove "passed", "error" classes
function addRemoveClass(e, add, remove) {
  e.parentElement.classList.add(add);
  e.parentElement.classList.remove(remove);
}

// Logout Button
import { createLogoutBox } from "./common.js";
logoutButton.onclick = () => {
  createLogoutBox(cancelConfirmation, proceedConfirmation);

  function cancelConfirmation() {
    document.body.classList.remove("backdrop-bg");
    document.body.children[0].remove();
  }
  function proceedConfirmation() {
    window.localStorage.currentUser = "";
    signupForm.classList.remove("signed-in");
    signedUser(false);
    cancelConfirmation();
    profileButton.classList.add("open-close-login");
    signupForm.classList.add("open-close");
    repeatingPopup();
    clearCart();
  }
};

// After signing in or logging out
let signupFormData = document.querySelectorAll(
  ".signup-form h2, .signup-form form"
);
function signedUser(status) {
  if (status) {
    // Remove the signup page
    signupForm.innerHTML = "";

    // <HTML>
    let icon = document.createElement("i");
    icon.className = "fa-regular fa-circle-check";
    signupForm.appendChild(icon);

    let p = document.createElement("p");
    p.appendChild(document.createTextNode("You are signed in"));
    signupForm.appendChild(p);
    // </HTML>
    signupForm.classList.add("signed-in");

    logoutButton.style.display = "block";

    favFilter.style.display = "flex";
  } else {
    // Back to the signup page
    signupForm.innerHTML = "";
    signupForm.classList.remove("signed-in");
    signupForm.appendChild(signupFormData[0]); // h2
    signupForm.appendChild(signupFormData[1]); // form

    logoutButton.style.display = "none";

    favFilter.style.display = "none";
  }
  foodFilters[0].click();
  userProfile();
}

// Setting the user profile
function userProfile() {
  let dataFields = document.querySelectorAll(".user-name");
  if (window.localStorage.currentUser) {
    dataFields.forEach((d) => {
      d.innerHTML = JSON.parse(window.localStorage.currentUser).firstName;
      profileImage.src = currentUser.profileImage;
    });
    dashboardLinks[1].classList.remove("guest");
    dashboardLinks[2].classList.remove("guest");
  } else {
    dataFields.forEach((d) => {
      d.innerHTML = "Guest";
    });
    profileImage.src = "images/guest-pic.svg";
    dashboardLinks[2].classList.add("guest");
  }
}

// This will calculate the money by summing up the price of the foods
function calculatingMoneyCart() {
  let amount = 0;
  currentUser.orders.forEach((e) => (amount += e.price));
  amount = amount.toFixed(2);
  cartMoney.innerHTML = amount;
}

// This will create the orders and display it in the cart
function createOrderItem() {
  ordersContainer.innerHTML = "";
  let array = currentUser.orders;
  //<HTML>
  for (let i = 0; i < array.length; i++) {
    let order = document.createElement("div");
    order.className = "order";
    order.setAttribute("data-code", array[i].foodCode);

    let foodDescription = document.createElement("div");
    foodDescription.className = "food-description";

    let foodImage = document.createElement("div");
    foodImage.className = "food-image";
    let img = document.createElement("img");
    img.src = array[i].img;
    foodImage.appendChild(img);
    foodDescription.appendChild(foodImage);

    let foodDetails = document.createElement("div");
    foodDetails.className = "details";

    let foodName = document.createElement("div");
    foodName.className = "food-name";
    let foodNameP = document.createElement("p");
    foodNameP.appendChild(document.createTextNode(array[i].foodName));
    foodName.appendChild(foodNameP);
    let foodCount = document.createElement("p");
    foodCount.className = "food-count";
    let foodCountIcon = document.createElement("i");
    foodCountIcon.className = "fa-solid fa-xmark";
    foodCount.appendChild(foodCountIcon);
    let count = document.createElement("span");
    count.appendChild(document.createTextNode(array[i].quantity));
    foodCount.appendChild(count);
    foodName.appendChild(foodCount);
    foodDetails.appendChild(foodName);

    let finalPrice = document.createElement("p");
    finalPrice.className = "final-price";
    let finalPriceIcon = document.createElement("i");
    finalPriceIcon.className = "fa-solid fa-dollar-sign";
    finalPrice.appendChild(finalPriceIcon);
    let price = document.createElement("span");
    price.appendChild(
      document.createTextNode(array[i].price.toFixed(2).toString())
    );
    finalPrice.appendChild(price);
    foodDetails.appendChild(finalPrice);
    foodDescription.appendChild(foodDetails);
    order.appendChild(foodDescription);

    let removeFoodButtons = document.createElement("div");
    removeFoodButtons.className = "remove-food";
    let decreamentButton = document.createElement("button");
    decreamentButton.className = "decrease-qty";
    decreamentButton.addEventListener("click", decreaseFoodQty);
    let decreamentButtonIcon = document.createElement("i");
    decreamentButtonIcon.className = "fa fa-minus";
    decreamentButton.appendChild(decreamentButtonIcon);
    removeFoodButtons.appendChild(decreamentButton);
    let removeFoodButton = document.createElement("button");
    removeFoodButton.className = "remove-item";
    removeFoodButton.addEventListener("click", removeFoodFromMenu);
    let removeFoodButtonIcon = document.createElement("i");
    removeFoodButtonIcon.className = "fa fa-trash";
    removeFoodButton.appendChild(removeFoodButtonIcon);
    removeFoodButtons.appendChild(removeFoodButton);
    order.appendChild(removeFoodButtons);
    ordersContainer.appendChild(order);
    //</HTML>
  }
}

// Onclicking on the minus icon its will decrease the quantity
function decreaseFoodQty(e) {
  let removeFoodButton = e.currentTarget.nextSibling;
  let foodCode =
    e.currentTarget.parentElement.parentElement.getAttribute("data-code");
  console.log(currentUser.orders);
  currentUser.orders.forEach((e) => {
    if (e.foodCode == foodCode) {
      if (e.quantity > 1) {
        e.quantity--;
        e.price -= e.pricePerOne;
      } else {
        removeFoodButton.click();
      }
    }
  });
  window.localStorage.currentUser = JSON.stringify(currentUser);

  saveToUsersArray();

  if (currentUser.orders.length == 0) {
    clearCart();
  } else {
    calculatingMoneyCart();
    createOrderItem();
  }
}

// Onclicking the trash icon it will remove the food
function removeFoodFromMenu(e) {
  let foodCode =
    e.currentTarget.parentElement.parentElement.getAttribute("data-code");

  currentUser.orders = currentUser.orders.filter((e) => {
    return e.foodCode != foodCode;
  });
  window.localStorage.currentUser = JSON.stringify(currentUser);

  saveToUsersArray();

  if (currentUser.orders.length == 0) {
    clearCart();
  } else {
    calculatingMoneyCart();
    createOrderItem();
  }
}

// Clear the foot cart
function clearCart() {
  ordersContainer.innerHTML = "";
  cartMoney.innerHTML = "0.00";
  //<HTML>
  let message = document.createElement("p");
  message.id = "message";
  message.appendChild(document.createTextNode("Empty"));
  ordersContainer.appendChild(message);
  //</HTML>
}

// Remove all food from the cart
removeAllFoodButton.onclick = () => {
  currentUser.orders = [];
  window.localStorage.currentUser = JSON.stringify(currentUser);
  saveToUsersArray();
  clearCart();
};

// Save the orders data of the current user to the array of users
function saveToUsersArray() {
  usersArray.forEach((e) => {
    if (e.email == currentUser.email) {
      e.orders = currentUser.orders;
    }
  });
  window.localStorage.users = JSON.stringify(usersArray);
}

// Onclicking the checkout button, it will create a cart list containing the foods selected
checkOutButton.onclick = () => {
  let cartList = document.createElement("div");
  cartList.className = "cart-list-orders";

  let menu = document.createElement("div");
  menu.className = "menu";
  menu.addEventListener("click", backToOrder);
  let arrowIcon = document.createElement("i");
  arrowIcon.className = "fa fa-arrow-left";
  menu.appendChild(arrowIcon);
  menu.appendChild(document.createTextNode("Continue Ordering"));
  cartList.appendChild(menu);

  let title = document.createElement("div");
  title.className = "title";
  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("Food Cart"));
  let p = document.createElement("p");
  p.appendChild(document.createTextNode("You have "));
  let pSpan = document.createElement("span");
  pSpan.appendChild(document.createTextNode(currentUser.orders.length));
  p.appendChild(pSpan);
  p.appendChild(document.createTextNode(" items in your cart"));
  title.appendChild(h2);
  title.appendChild(p);
  cartList.appendChild(title);

  let foodContainer = document.createElement("div");
  foodContainer.className = "food-container";

  for (let i = 0; i < currentUser.orders.length; i++) {
    let foodOrder = document.createElement("div");
    foodOrder.className = "food-order";

    let foodDescription = document.createElement("div");
    foodDescription.className = "food-description";

    let img = document.createElement("img");
    img.src = currentUser.orders[i].img;
    img.alt = "Food Image";
    foodDescription.appendChild(img);

    let text = document.createElement("div");
    text.className = "text";
    let pText = document.createElement("p");
    pText.appendChild(document.createTextNode(currentUser.orders[i].foodName));
    text.appendChild(pText);
    let pQty = document.createElement("p");
    let pQtyIcon = document.createElement("i");
    pQtyIcon.className = "fa fa-x";
    let pQtySpan = document.createElement("span");
    pQtySpan.appendChild(
      document.createTextNode(currentUser.orders[i].quantity)
    );
    pQty.appendChild(pQtyIcon);
    pQty.appendChild(pQtySpan);
    text.appendChild(pQty);
    foodDescription.appendChild(text);
    foodOrder.appendChild(foodDescription);

    let foodPrice = document.createElement("div");
    foodPrice.className = "food-price";
    let dollarIcon = document.createElement("i");
    dollarIcon.className = "fa fa-dollar";
    let foodPriceSpan = document.createElement("div");
    foodPriceSpan.appendChild(
      document.createTextNode(currentUser.orders[i].price.toFixed(2).toString())
    );
    foodPrice.appendChild(dollarIcon);
    foodPrice.appendChild(foodPriceSpan);
    foodOrder.appendChild(foodPrice);

    foodContainer.appendChild(foodOrder);
  }
  cartList.appendChild(foodContainer);

  let foot = document.createElement("div");
  foot.className = "foot";
  let total = document.createElement("div");
  total.className = "total";
  total.appendChild(document.createTextNode("Total: "));
  let dollarIcon = document.createElement("i");
  dollarIcon.className = "fa fa-dollar";
  total.appendChild(dollarIcon);
  let totalSpan = document.createElement("span");
  totalSpan.appendChild(document.createTextNode(cartMoney.innerHTML));
  total.appendChild(totalSpan);
  foot.appendChild(total);
  if (currentUser.orders.length != 0) {
    // If there is no food in the cart the button will not be displayed
    let orderButton = document.createElement("button");
    orderButton.className = "button-style";
    orderButton.addEventListener("click", addBill);
    orderButton.addEventListener("click", orderFood);
    orderButton.appendChild(document.createTextNode("Order Now"));
    foot.appendChild(orderButton);
  }
  cartList.appendChild(foot);

  document.body.prepend(cartList);
  document.body.classList.add("backdrop-bg");

  function backToOrder() {
    document.body.children[0].remove();
    document.body.classList.remove("backdrop-bg");
  }

  function orderFood() {
    // This for hiding all the elements inside the cart
    [...cartList.children].forEach((e) => {
      e.style.transition = "0.3s";
      e.style.opacity = "0";
    });
    cartList.classList.add("loader");

    // Progress bar
    let progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    cartList.appendChild(progressBar);

    // Filling the progress bar
    let width = 0;
    let handler = setInterval(() => {
      if (width == 100) {
        clearInterval(handler);
        removeAllFoodButton.click();
        backToOrder();
      }
      width += 50;
      progressBar.style.width = `${width}%`;
    }, 500);
  }

  function addBill() {
    let obj = {
      total: cartMoney.innerHTML,
      quantity: currentUser.orders.length,
      date: new Date(),
    };
    currentUser.bills.push(obj);
    window.localStorage.currentUser = JSON.stringify(currentUser);

    usersArray.forEach((e) => {
      if (e.email == currentUser.email) {
        e.bills = currentUser.bills;
      }
    });
    window.localStorage.users = JSON.stringify(usersArray);
  }
};

// Scroll Button
onscroll = () => {
  if (scrollY > 400) {
    scrollButton.style.display = "flex";
  } else {
    scrollButton.style.display = "none";
  }
};
scrollButton.onclick = () => {
  scrollTo(top);
};
