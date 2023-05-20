// Declaring variables
const generalInfoInputs = document.querySelectorAll(
  ".general-info-box .informations .info input"
);
const updateProfileButton = document.getElementById("updateButton");
const chooseImgInput = document.getElementById("choose-img");
const chooseImgButton = document.getElementById("choose-img-button");
const billsContainer = document.querySelector(".orders");
const profileImage = document.getElementById("profileImage");
const logoutButton = document.getElementById("logout");
const historyButton = document.getElementById("clear-history");
const emptyMessage = document.getElementById("message")
let bills;
let currentUser;
let users;

// Onloading the page
window.onload = () => {
  if (window.localStorage.currentUser) {
    bills = JSON.parse(window.localStorage.currentUser).bills;
    currentUser = JSON.parse(window.localStorage.currentUser);
    users = JSON.parse(window.localStorage.users);
    generalInfoInputs[0].value = currentUser.firstName;
    generalInfoInputs[1].value = currentUser.lastName;
    generalInfoInputs[2].value = currentUser.email;
    generalInfoInputs[3].value = currentUser.password;
    profileImage.src = currentUser.profileImage;

    if (bills.length != 0) {
      // if there bills exist
      createBills();
    }

    logoutButton.style.display = "block";
    chooseImgButton.style.pointerEvents = "all";
  } else {
    logoutButton.style.display = "none";
    chooseImgButton.style.pointerEvents = "none";
    // window.location.href = "index.html"
  }
};

// Create bills
function createBills() {
  billsContainer.innerHTML = "";
  for (let i = 0; i < bills.length; i++) {
    let bill = document.createElement("div");
    bill.className = "order";

    let item = document.createElement("div");
    item.className = "item";

    let countSpan = document.createElement("span");
    countSpan.className = "count";
    countSpan.appendChild(document.createTextNode(bills[i].quantity));
    countSpan.appendChild(document.createTextNode(" items"));
    item.appendChild(countSpan);

    let totalSpan = document.createElement("span");
    totalSpan.className = "total";
    let dollarIcon = document.createElement("i");
    dollarIcon.className = "fa fa-dollar";
    totalSpan.appendChild(dollarIcon);
    totalSpan.appendChild(document.createTextNode(" " + bills[i].total));
    item.appendChild(totalSpan);
    bill.appendChild(item);

    let dateSpan = document.createElement("span");
    dateSpan.className = "date";
    dateSpan.appendChild(document.createTextNode(bills[i].date));
    bill.appendChild(dateSpan);
    billsContainer.prepend(bill);
  }
}

// Reading the image that the user choosed as a profile pic
chooseImgInput.onchange = () => {
  let file = new FileReader();
  file.readAsDataURL(chooseImgInput.files[0]);
  file.onload = () => {
    profileImage.src = file.result;

    currentUser.profileImage = file.result;
    window.localStorage.currentUser = JSON.stringify(currentUser);

    users.forEach((u) => {
      if (u.email == currentUser.email) {
        u.profileImage = file.result;
      }
    });
    window.localStorage.users = JSON.stringify(users);
  };
};

// Logout Box
import { createLogoutBox } from "./common.js";
logoutButton.onclick = () => {
  createLogoutBox(cancelConfirmation, proceedConfirmation);

  function cancelConfirmation() {
    document.body.classList.remove("backdrop-bg");
    document.body.children[0].remove();
  }
  function proceedConfirmation() {
    window.localStorage.currentUser = "";
    window.location.href = "index.html";
  }
};

// History button
historyButton.onclick = () => {
  currentUser.bills = [];

  window.localStorage.currentUser = JSON.stringify(currentUser);

  users.forEach((u) => {
    if (u.email == currentUser.email) {
      u.bills = currentUser.bills;
    }
  });
  window.localStorage.users = JSON.stringify(users);

  billsContainer.innerHTML = "";
  billsContainer.appendChild(emptyMessage);
};

updateProfileButton.onclick = () => {
  if (updateProfileButton.innerHTML == "Update Profile") {
    generalInfoInputs.forEach((i) => {
      i.classList.add("access-input");
    });
    generalInfoInputs[0].focus();
    updateProfileButton.innerHTML = "Confirm";
  } else {
    // Confirm Changes
    generalInfoInputs.forEach((i) => {
      i.classList.remove("access-input");
    });
    updateProfileButton.innerHTML = "Update Profile";

    let saveEmail = false;
    users.forEach((u) => {
      console.log(u.email)
      if (u.email == currentUser.email) {
        u.firstName = generalInfoInputs[0].value;
        u.lastName = generalInfoInputs[1].value;
        if (checkEmail()) {
          u.email = generalInfoInputs[2].value;
          saveEmail = true;
        }
        u.password = generalInfoInputs[3].value;
      }
    });
    window.localStorage.users = JSON.stringify(users);

    currentUser.firstName = generalInfoInputs[0].value;
    currentUser.lastName = generalInfoInputs[1].value;
    if (saveEmail) currentUser.email = generalInfoInputs[2].value;
    currentUser.password = generalInfoInputs[3].value;
    window.localStorage.currentUser = JSON.stringify(currentUser);

    function checkEmail() {
      let bool = true;
      users.forEach((e) => {
        if (e.email == generalInfoInputs[2].value) {
          bool = false;
        }
      });
      return bool;
    }
  }
};
