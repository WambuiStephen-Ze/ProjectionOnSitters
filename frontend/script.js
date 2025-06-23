const BASE_URL = "http://localhost:3000";

function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("open");
}

const handleHomeTextAnimation = () => {
  const words = ['Parents', 'Moms', 'Dads', 'Guardians'];
  const parentText = document.getElementById('parents-text');
  if (!parentText) return;

  let currentIndex = 0;
  setInterval(() => {
    parentText.style.opacity = 0;
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      parentText.textContent = words[currentIndex];
      parentText.style.opacity = 1;
    }, 500);
  }, 3000);
};

const passwordValidation = () => {
  const form = document.querySelector("#register-form, #signup-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      e.preventDefault();
    } else if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      e.preventDefault();
    }
  });
};

const profilePictureReview = () => {
  const fileInput = document.getElementById("profilePic");
  const preview = document.getElementById("preview");

  if (fileInput && preview) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("File size exceeds 5MB limit.");
          this.value = "";
          preview.style.display = "none";
          return;
        }
        const reader = new FileReader();
        reader.addEventListener("load", function () {
          preview.setAttribute("src", this.result);
          preview.style.display = "block";
        });
        reader.readAsDataURL(file);
      } else {
        preview.style.display = "none";
      }
    });
  }
};

// const registerUser = () => {
//   const form = document.querySelector("#register-form, #signup-form");
//   if (!form) return;

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const formData = new FormData(form);
//     const role = form.id === "signup-form" ? "sitter" : "parent";
//     const endpoint = role === "sitter" ? "/sitters/signup" : "/auth/register";

//     try {
//       const res = await fetch(`${BASE_URL}${endpoint}`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("Registration successful! Please log in.");
//         window.location.href = `/login?role=${role}`;
//       } else {
//         alert(data.message || "Registration failed.");
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       alert("Something went wrong during registration.");
//     }
//   });
// };

const registerUser = () => {
  const form = document.querySelector("#register-form") || document.querySelector("#signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Decide user role based on form ID
    const role = form.id === "signup-form" ? "sitter" : "parent";
    const endpoint = role === "sitter" ? "/api/sitters/register" : "/api/users/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Please log in.");
        window.location.href = `/login?role=${role}`;
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong during registration.");
    }
  });
};

// Run this after DOM loads
document.addEventListener("DOMContentLoaded", registerUser);


const loginUser = () => {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get("role") || "parent";
    const endpoint = role === "sitter" ? "/sitters/login" : "/auth/login";

    const formData = new FormData(form);
    const data = {
      email: formData.get("email").trim(),
      password: formData.get("password"),
    };

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        alert("Login successful!");
        window.location.href = role === "sitter" ? "/sitters.html" : "/sitters.html";
      } else {
        alert(result.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    }
  });
};

const setupRegisterLink = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role") || "parent";
  const registerLink = document.getElementById("registerLink");

  if (registerLink) {
    // registerLink.href = role === "sitter" ? "/sitter/register" : "/parent/register";
    registerLink.href = role === "sitters" ? "signup.html" : "register.html";

  }
};

const highlightActiveNavLink = () => {
  const navlinks = document.querySelectorAll('.navbar a');
  const currentPage = window.location.pathname.split("/").pop();

  navlinks.forEach(link => {
    const linkPage = link.getAttribute('href').split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNavLink();
  handleHomeTextAnimation();
  passwordValidation();
  profilePictureReview();
  setupRegisterLink();

  const path = window.location.pathname;
  if (path.includes("register") || path.includes("signup")) {
    registerUser();
  } else if (path.includes("login")) {
    loginUser();
  }
});