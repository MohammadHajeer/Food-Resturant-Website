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
  "The guest can effortlessly access all pages, except for the exclusive profile page.",
  "The guest has the freedom to seamlessly switch between the captivating dark and light themes of the website.",
  "While the guest is immersed in exploring the website, an attention-grabbing popup relentlessly reminds them to swiftly sign up or log in.",
  "The guest is warmly welcomed to elevate their experience by seamlessly signing up or logging in to become an esteemed user.",
  "The website boasts an exceptional range of food filters, enabling users to easily refine their culinary preferences.",
  "The user enjoys unrestricted access to all pages, including the delightful option to place food orders.",
  "The user's valuable personal information, such as their name, email, and orders, is securely stored in the local storage for their convenience.",
  "The user has the remarkable ability to create multiple accounts, ensuring utmost flexibility and convenience.",
  "While the user indulges in ordering delectable food, the total price is prominently displayed on the debit card, heightening the anticipation of a satisfying transaction.",
  "Upon meticulously reviewing their selections, the user can confidently proceed to the checkout process, where a comprehensive and visually appealing checkout list awaits.",
  "With a simple press of the buy button, an immaculate and detailed bill of the order is instantly generated and seamlessly added to the user's cherished bill history.",
  "The user is empowered to curate a personalized collection of favorite foods, effortlessly saving them by affectionately pressing the heart button.",
  "The user has the privilege to effortlessly update their personal information, ensuring their profile remains current and reflective of their individuality.",
  "The user can seamlessly upload a captivating photo, adding a personal touch and enhancing their unique presence within the platform.",
  "The user is graciously offered the option to effortlessly clear their bill history, maintaining a streamlined and organized account.",
  "The user can confidently and conveniently log out, knowing their privacy and security are respected and safeguarded.",
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
  document.body.classList.remove("prevent-scroll");
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
