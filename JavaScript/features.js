// Declaring variables
const loader = document.getElementById("loader");
const dashboardLinks = document.querySelectorAll(".links li a");
const logoutButton = document.getElementById("logout");
const featuresContainer = document.querySelector(
  ".content.features .features-container"
);
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
    cancelConfirmation();

    logoutButton.style.display = "none";
    dashboardLinks[2].classList.add("guest");
  }
};
// Features
const features = [
  "The guest can view all pages expect the profile page.",
  "The guest can change the theme of the website dark/light.",
  "While the guest is viewing the website a popup will start appearing reminding the guest to signup/login.",
  "The guest can signup/login to be a user.",
  "The website contains a food filters.",
  "The user can access all pages including ordering food.",
  "The data of the user name, email, orders... will be saved in the local storage.",
  "The user can make another account without losing the first account.",
  "While the user is ordering food the total price will be displayed in the debit card.",
  "After revising the orders the user can press on checkout then a checkout list will appear.",
  "When the user press on buy button a bill of the order will be saved and add to the bill history.",
  "The user can add list of his/her favourite foods by pressing the heart button.",
  "The user can update his/her personal info.",
  "The user can upload a photo.",
  "The user can clear the bill history.",
  "The user can logout.",
];

function createFeatures() {
  featuresContainer.innerHTML = "";
  let animationTime = 100;
  for (let i = 0; i < features.length; i++) {
    let feature = document.createElement("div");
    feature.className = "feature";
    feature.style.animationDelay = `${animationTime}ms`;
    animationTime += 100;

    let top = document.createElement("div");
    top.className = "top";
    for (let j = 0; j < 3; j++) {
      let span = document.createElement("span");
      top.appendChild(span);
    }
    feature.appendChild(top);

    let pText = document.createElement("p");
    pText.className = "text";
    pText.appendChild(document.createTextNode(features[i]));
    feature.appendChild(pText);

    let spanNumber = document.createElement("span");
    spanNumber.className = "number";
    spanNumber.appendChild(document.createTextNode(i + 1));
    feature.appendChild(spanNumber);

    featuresContainer.appendChild(feature);
  }
}

window.onload = () => {
  document.body.classList.remove("backdrop-bg");
  loader.style.display = "none";

  createFeatures();

  if (window.localStorage.currentUser) {
    logoutButton.style.display = "block";
    dashboardLinks[2].classList.remove("guest");
  } else {
    logoutButton.style.display = "none";
    dashboardLinks[2].classList.add("guest");
  }
};
