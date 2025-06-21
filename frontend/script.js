// document.addEventListener('DOMContentLoaded', function() {
//   const toggle = document.getElementById('nav.toggle');
//   const navLinks = document.getElementById('nav-links');

//   toggle.addEventListener('click', () => {
//     navLinks.classList.toggle('show');
//   });
// });

// document.addEventListener('DOMContentLoaded', function () {
//   const links = document.querySelectorAll('.navbar a');
//   const currentPage = window.location.pathname.split("/").pop(); // e.g., "about.html"

//   links.forEach(link => {
//     const linkPage = link.getAttribute('href');
//     if (linkPage === currentPage) {
//       link.classList.add('active');
//     }
//   });
// });

// /*document.addEventListener('DOMContentLoaded', function() {
    
//     const navToggle = document.createElement('button');
//     navToggle.className = 'nav-toggle';
//     navToggle.innerHTML = '☰';
//     document.querySelector('header').prepend(navToggle);
    
//     navToggle.addEventListener('click', () => {
//         document.querySelector('nav').style.display = 
//             document.querySelector('nav').style.display === 'block' ? 'none' : 'block';
//     });*/

    
//     const words = ['Parents', 'Moms', 'Dads', 'Guardians'];
//     let currentIndex = 0;
//     setInterval(() => {
//         const parentText = document.getElementById('parents-text');
//         parentText.style.opacity = 0;
//         setTimeout(() => {
//             parentText.textContent = words[currentIndex = (currentIndex + 1) % words.length];
//             parentText.style.opacity = 1;
//         }, 500);
//     }, 3000);

    
//    document.querySelectorAll('.sitter-box a').forEach(box => {
//     box.addEventListener('click', () => {
//         window.location.href = 'sitters.html';
//     });
// });


//     document.querySelector('.filter-buttons').addEventListener('click', (e) => {
//         if (e.target.classList.contains('filter-btn')) {
//             document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             const location = e.target.dataset.location;
//             document.querySelectorAll('.sitter').forEach(sitter => {
//                 sitter.style.display = (location === 'all' || sitter.dataset.location === location) ? 'block' : 'none';
//             });
//         }
//     });

    
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', (e) => {
//             e.preventDefault();
//             const target = document.querySelector(anchor.getAttribute('href'));
//             if (target) target.scrollIntoView({ behavior: 'smooth' });
//         });
//     });

    
                          
//     document.querySelector('form[action="subscribe"]')?.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const email = e.target.querySelector('input[type="email"]').value;
//         alert(email.includes('@') ? `Thanks for subscribing with ${email}!` : 'Please enter a valid email');
//         e.target.reset();
//     });


const BASE_URL = "http://localhost:3000/api";

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

const registerUser = () => {
  const form = document.querySelector("#register-form, #signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const role = form.id === "signup-form" ? "sitter" : "parent";
    const endpoint = role === "sitter" ? "/sitters/signup" : "/auth/register";

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
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
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong during registration.");
    }
  });
};

const loginUser = () => {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get("role") || "parent";
    const endpoint = role === "sitter" ? "/sitters/loginSitter" : "/auth/login";

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
    registerLink.href = role === "sitter"
  ? "signup.html?role=sitter"
  : "register.html?role=parent";

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