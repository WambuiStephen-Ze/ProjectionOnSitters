// // public/register.js
// // document.addEventListener('DOMContentLoaded', () => {
// //   document.getElementById('registerForm').addEventListener('submit', async (e) => {
// //     e.preventDefault(); // Prevent default form submission

// //     const form = e.target;
// //     const formData = new FormData(form); // Create FormData from the form

// //     try {
// //       const response = await fetch('/api/register', {
// //         method: 'POST',
// //         body: formData // Send FormData directly
// //       });

// //       const result = await response.json();

// //       if (response.ok) {
// //         alert('Registration successful!');
// //         console.log('User registered:', result);
// //         window.location.href = '/login.html';
// //       } else {
// //         alert('Registration failed: ' + result.message);
// //       }
// //     } catch (error) {
// //       console.error('Registration error:', error);
// //       alert('Something went wrong.');
// //     }
// //   });
// // });
// // public/register.js
// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('registerForm').addEventListener('submit', async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     const form = e.target;
//     const formData = new FormData(form); // Create FormData from the form

//     try {
//       const response = await fetch('/api/register', {
//         method: 'POST',
//         body: formData // Send FormData directly
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert('Registration successful!');
//         console.log('User registered:', result);
//         window.location.href = '/login.html'; // Redirect to login page
//       } else {
//         alert(result.message || 'Registration failed!'); // Fallback message
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       alert('Something went wrong.');
//     }
//   });
// });