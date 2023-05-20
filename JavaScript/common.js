// Declaring variables
const themeSwitcherButton = document.getElementById("themeSwitcher");
const scrollButton = document.getElementById("scrollButton");

// dark mode
if (window.localStorage.theme == "dark") {
  themeSwitcherButton.classList.add("active");
  document.body.classList.add("dark-mode");
} else {
  themeSwitcherButton.classList.remove("active");
  document.body.classList.remove("dark-mode");
}

themeSwitcherButton.onclick = () => {
  if (themeSwitcherButton.classList.contains("active")) {
    themeSwitcherButton.classList.remove("active");
    document.body.classList.remove("dark-mode");
    window.localStorage.theme = "light";
  } else {
    themeSwitcherButton.classList.add("active");
    document.body.classList.add("dark-mode");
    window.localStorage.theme = "dark";
  }
};

// Creating the logoutBox
export function createLogoutBox(cancelConfirmation, proceedConfirmation) {
  let confirmationBox = document.createElement("div");
  confirmationBox.className = "logout-confirmation-box";

  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("Logout"));
  confirmationBox.appendChild(h2);

  let p = document.createElement("p");
  p.appendChild(document.createTextNode("Are you sure you want to logout?"));
  confirmationBox.appendChild(p);

  let buttons = document.createElement("div");
  buttons.className = "buttons";

  let cancelButton = document.createElement("button");
  cancelButton.className = "cancel-confirmation button-style";
  cancelButton.appendChild(document.createTextNode("Cancel"));
  cancelButton.addEventListener("click", cancelConfirmation);
  buttons.appendChild(cancelButton);

  let confirmButton = document.createElement("button");
  confirmButton.className = "proceed-confirmation button-style";
  confirmButton.appendChild(document.createTextNode("Confirm"));
  confirmButton.addEventListener("click", proceedConfirmation);
  buttons.appendChild(confirmButton);

  confirmationBox.appendChild(buttons);
  document.body.prepend(confirmationBox);

  document.body.classList.add("backdrop-bg");
  document.body.onclick = (e) => {
    // If the user pressed on outside the box it will cancel it
    if (e.target.classList.contains("backdrop-bg")) {
      cancelConfirmation();
    }
  };
}

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