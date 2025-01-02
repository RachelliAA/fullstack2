// Elements
const profileButton = document.getElementById("profile-button");
const profileModal = document.getElementById("profile-modal");
const closeButton = document.querySelector(".close");
const saveButton = document.getElementById("save-profile");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Open profile modal
profileButton.addEventListener("click", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  nameInput.value = currentUser.name;
  emailInput.value = currentUser.email;
  passwordInput.value = currentUser.password;

  profileModal.style.display = "block";
});

// Close profile modal
closeButton.addEventListener("click", () => {
  profileModal.style.display = "none";
});

// Save profile changes
saveButton.addEventListener("click", () => {
  const updatedUser = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  // Update currentUser in localStorage
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));

  // Update the users list
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex(user => user.email === updatedUser.email);

  if (userIndex > -1) {
    users[userIndex] = updatedUser; // Update existing user
  } else {
    users.push(updatedUser); // Add new user if not found
  }

  localStorage.setItem("users", JSON.stringify(users));

  alert("Profile updated successfully!");
  profileModal.style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === profileModal) {
    profileModal.style.display = "none";
  }
});


saveButton.addEventListener("click", () => {
    const updatedUser = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(
      user => user.email === updatedUser.email && user.email !== JSON.parse(localStorage.getItem("currentUser")).email
    );
  
    if (emailExists) {
      alert("Email is already in use!");
      return;
    }
  
    // Update logic as before
  });
  