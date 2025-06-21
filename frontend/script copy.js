// const BASE_URL = "https://localhost:3000/api";

// function toggleMenu() {
//     const navLinks = document.getElementById("nav-links");
//     navLinks.classList.toggle("open");
// }


// const handleHomeTextAnimation = () => {
//     // Parent text animation
//     const words = ['Parents', 'Moms', 'Dads', 'Guardians'];
//     const parentText = document.getElementById('parents-text');
//     if (!parentText) return;

//     let currentIndex = 0;
//     setInterval(() => {
//         parentText.style.opacity = 0;
//         setTimeout(() => {
//             currentIndex = (currentIndex + 1) % words.length;
//             parentText.textContent = words[currentIndex];
//             parentText.style.opacity = 1;
//         }, 500);
//     }, 3000);
// }

// const passwordValidation = () => {
//     // Password validation
//     const form = document.querySelector("form");
//     if (form) {
//         form.addEventListener("submit", function (e) {
//             const password = document.getElementById("password")?.value;
//             const confirmPassword = document.getElementById("confirmPassword")?.value;

//             if (password !== confirmPassword) {
//                 alert("Passwords do not match!");
//                 e.preventDefault(); // Stop form submission
//             }
//         });
//     }
// }

// const profilePictureReview = () => {
//     // Profile picture preview
//     const fileInput = document.getElementById("profilePic");
//     const preview = document.getElementById("preview");

//     if (fileInput && preview) {
//         fileInput.addEventListener("change", function () {
//             const file = this.files[0];

//             if (file) {
//                 const reader = new FileReader();
//                 reader.addEventListener("load", function () {
//                     preview.setAttribute("src", this.result);
//                     preview.style.display = "block";
//                 });
//                 reader.readAsDataURL(file);
//             } else {
//                 preview.style.display = "none";
//             }
//         });
//     }
// }
// const registerUser = () => {
//   const form = document.querySelector("form");
//   if (!form) return;

//   form.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const fullName = document.getElementById("firstname").value + " " + document.getElementById("lastname").value;
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     const role = window.location.href.includes("signup") ? "sitter" : "parent";
//     const location = document.getElementById("location")?.value;
//     const numberOfChildren = document.getElementById("numKids")?.value;

//     const userData = {
//       name: fullName,
//       email,
//       password,
//       role,
//       location,
//       numberOfChildren
//     };

//     try {
//       const res = await fetch(`${BASE_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData)
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("Registration successful!");
//         window.location.href = "login.html";
//       } else {
//         alert(data.message || "Registration failed.");
//       }
//     } catch (err) {
//       console.error("Registration error:", err);
//     }
//   });
// };

// const loginUser = () => {
//   const form = document.querySelector("form");
//   if (!form) return;

//   form.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const email = document.getElementById("email")?.value;
//     const password = document.getElementById("password")?.value;
//     const role = window.location.search.includes("sitter") ? "sitter" : "parent";
//     const endpoint = role === "sitter" ? "/sitters/login" : "/auth/login";

//     try {
//       const res = await fetch(`${BASE_URL}${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();
//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         alert("Login successful!");
//         window.location.href = "dashboard.html"; // Change to your actual dashboard
//       } else {
//         alert(data.message || "Login failed.");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//     }
//   });
// };


// // Role-based redirect for register link
// window.addEventListener("DOMContentLoaded", () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const role = urlParams.get("role");
//     const registerLink = document.querySelector(".register-link a");

//     if (registerLink && role) {
//         if (role === "parent") {
//             registerLink.href = "register.html";
//         } else if (role === "sitter") {
//             registerLink.href = "signup.html";
//         }
//     }
// });

// document.addEventListener("DOMContentLoaded", function () {
//     //highlight active navbar link
//     const navlinks = document.querySelectorAll('.navbar a');
//     const currentPage = window.location.pathname.split("/").pop(); // e.g., "about.html"

//     navlinks.forEach(link => {
//         const linkPage = link.getAttribute('href');
//         if (linkPage === currentPage) {
//             link.classList.add('active');
//         }
//     });

//     handleHomeTextAnimation();
//     passwordValidation();
//     profilePictureReview()
// });



// //endpoint
// document.addEventListener("DOMContentLoaded", function () {
//   const isRegisterPage = window.location.pathname.includes("register") || 
//   window.location.pathname.includes("signup");
//   const isLoginPage = window.location.pathname.includes("login");

//   if (isRegisterPage) registerUser();
//   if (isLoginPage) loginUser();
// });



// // document.addEventListener('DOMContentLoaded', function() {
// //   const toggle = document.getElementById('nav.toggle');
// //   const navLinks = document.getElementById('nav-links');

// //   toggle.addEventListener('click', () => {
// //     navLinks.classList.toggle('show');
// //   });
// // });

// // document.addEventListener('DOMContentLoaded', function () {
// //   const links = document.querySelectorAll('.navbar a');
// //   const currentPage = window.location.pathname.split("/").pop(); // e.g., "about.html"

// //   links.forEach(link => {
// //     const linkPage = link.getAttribute('href');
// //     if (linkPage === currentPage) {
// //       link.classList.add('active');
// //     }
// //   });
// // });

// // /*document.addEventListener('DOMContentLoaded', function() {
    
// //     const navToggle = document.createElement('button');
// //     navToggle.className = 'nav-toggle';
// //     navToggle.innerHTML = '☰';
// //     document.querySelector('header').prepend(navToggle);
    
// //     navToggle.addEventListener('click', () => {
// //         document.querySelector('nav').style.display = 
// //             document.querySelector('nav').style.display === 'block' ? 'none' : 'block';
// //     });*/

    
// //     const words = ['Parents', 'Moms', 'Dads', 'Guardians'];
// //     let currentIndex = 0;
// //     setInterval(() => {
// //         const parentText = document.getElementById('parents-text');
// //         parentText.style.opacity = 0;
// //         setTimeout(() => {
// //             parentText.textContent = words[currentIndex = (currentIndex + 1) % words.length];
// //             parentText.style.opacity = 1;
// //         }, 500);
// //     }, 3000);

    
// //    document.querySelectorAll('.sitter-box a').forEach(box => {
// //     box.addEventListener('click', () => {
// //         window.location.href = 'sitters.html';
// //     });
// // });


// //     document.querySelector('.filter-buttons').addEventListener('click', (e) => {
// //         if (e.target.classList.contains('filter-btn')) {
// //             document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
// //             e.target.classList.add('active');
// //             const location = e.target.dataset.location;
// //             document.querySelectorAll('.sitter').forEach(sitter => {
// //                 sitter.style.display = (location === 'all' || sitter.dataset.location === location) ? 'block' : 'none';
// //             });
// //         }
// //     });

    
// //     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
// //         anchor.addEventListener('click', (e) => {
// //             e.preventDefault();
// //             const target = document.querySelector(anchor.getAttribute('href'));
// //             if (target) target.scrollIntoView({ behavior: 'smooth' });
// //         });
// //     });

    
                          
// //     document.querySelector('form[action="subscribe"]')?.addEventListener('submit', (e) => {
// //         e.preventDefault();
// //         const email = e.target.querySelector('input[type="email"]').value;
// //         alert(email.includes('@') ? `Thanks for subscribing with ${email}!` : 'Please enter a valid email');
// //         e.target.reset();
// //     });
const BASE_URL =" http://localhost:3000";

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
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
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
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // You can either send formData if file upload is involved, else JSON
    // Here assuming JSON payload for consistency:
    const fullName = document.getElementById("firstname")?.value.trim() + " " + document.getElementById("lastname")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    const location = document.getElementById("location")?.value || "";
    const numberOfChildren = document.getElementById("numKids")?.value || "";
    // Role logic - adjust depending on page
    const role = window.location.href.includes("signup") ? "sitter" : "parent";

    const userData = {
      name: fullName,
      email,
      password,
      role,
      location,
      numberOfChildren,
    };

    try {
      const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong during registration.");
    }
  });
};
//login document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    // try {
    //   const response = await fetch('http://localhost:3000/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    //   });
    //   if (response.ok) {
    //     const result = await response.json();
    //     alert('Login successful!');
    //     window.location.href = '/dashboard';
    //   } else {
    //     const errorText = await response.text();
    //     console.error('Login failed:', errorText);
    //     alert('Login failed: ' + (errorText || 'Unknown error'));
    //   }
    // } catch (error) {
    //   console.error('Login error:', error);
    //   alert('Something went wrong.');
    // }
  });
 const loginUser = () => {
   const form = document.querySelector("form");
   if (!form) return;

   form.addEventListener("submit", async (e) => {
     e.preventDefault();

     const email = document.getElementById("email")?.value.trim();
     const password = document.getElementById("password")?.value;
     const role = window.location.search.includes("sitter") ? "sitter" : "parent";
     const endpoint = role === "sitter" ? "/sitters/login" : "/auth/login";

     try {
       const res = await fetch(`${BASE_URL}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, password }),
       });

       const data = await res.json();
       if (res.ok) {
         localStorage.setItem("token", data.token);
         alert("Login successful!");
         window.location.href = "index.html"; // Redirect after login
       } else {
         alert(data.message || "Login failed.");
       }
     } catch (err) {
       console.error("Login error:", err);
       alert("Something went wrong during login.");
     }
   });
 };

// Role-based redirect for register link (adjust the links on page load)
const setupRegisterLink = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role");
  const registerLink = document.querySelector(".register-link a");

  if (registerLink && role) {
    if (role === "parent") {
      registerLink.href = "register.html";
    } else if (role === "sitter") {
      registerLink.href = "signup.html";
    }
  }
};

// Highlight active navbar link
const highlightActiveNavLink = () => {
  const navlinks = document.querySelectorAll('.navbar a');
  const currentPage = window.location.pathname.split("/").pop();

  navlinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
};

// Initialize all event listeners on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNavLink();
  handleHomeTextAnimation();
  passwordValidation();
  profilePictureReview();
  setupRegisterLink();

  const path = window.location.pathname;

  if (path.includes("register") || path.includes("signup")) {
    registerUser();
  } else if (path.includes("login.html")) {
    loginUser();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const bookButtons = document.querySelectorAll(".bookme");

  bookButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const sitterId = button.getAttribute("data-sitter-id");

      // Dummy parent ID for now; in practice, get this from login/session
      const parentId = 1;

      const bookingData = {
        sitterId: sitterId,
        parentId: parentId,
        date: new Date().toISOString(), // you may use a datepicker instead
        status: "pending"
      };

      try {
        const response = await fetch("http://localhost:3000/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
          alert("Booking request sent successfully!");
        } else {
          alert("Booking failed: " + result.message);
        }
      } catch (err) {
        console.error("Error booking sitter:", err);
        alert("An error occurred while booking.");
      }
    });
  });
});
