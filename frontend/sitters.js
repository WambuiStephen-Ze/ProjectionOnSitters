const BASE_URL = "http://localhost:3000";


console.log("sitters.js loaded ✅");

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Fetching sitters...");
  // container to display the sitter
  const container = document.getElementById('sitters-list');
  if (!container) {
    console.error('Container with id "sitters-list" not found.');
    return;
  }


  try {
    const res = await fetch('/api/sitters/data');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const sitters = await res.json();
    console.log('Sitters', sitters);

    if (!Array.isArray(sitters)) throw new Error("Sitters is not an array");


    //looping through the data
    sitters.forEach(sitter => {
      const card = document.createElement('div');
      card.classList.add('item1');
      // card.className = "item1";
      const fullName = `${sitter.firstname} ${sitter.lastname}`;
      const location = sitter.location || 'Unknown location';
      const experience = sitter.experience ? `${sitter.experience} years exp` : 'Experience not set';
      const availability = (sitter.availability || 'Not available').replace(/"/g, '');
      const phone = sitter.phone || 'Not provided';
      const profilePic = sitter.profilePic && sitter.profilePic !== "null"
        ? sitter.profilePic
        : '/images/default-avatar.png';

      // const profilePic = sitter.profilePic || '/uploads/sitters_profilePics/1750666087506-AWG1.jpg';
      // {`/uploads/sitters_profilePic/${imageFilename}`}
      // <img src="${profilePic}" alt="${fullName}">
      // <img class="symbol" src="/images/1750666087506-AWG1.jpg" alt="">
      console.log(profilePic);

      card.innerHTML = `
          
          
          <div class="box">
            
            <img src="${profilePic}" alt="${fullName}" width="150" height="150" 
           onerror="this.onerror=null; this.src='/images/default-avatar.png';">

            <div class="content">
              <h3>${fullName}</h3>
              <p class="city"> <img src="/images/location.png" alt="">${location}</p>
              <p class="years">${experience}</p>
            </div>
          </div>
          <div class="sub-content">
            <p class="avail"><img src="/images/babyh.png" alt="">${availability}</p>
            <p class="phone"> <img src="/images/call-2.png" alt="">${phone}</p>
          </div>
          <div class="book">
            <button class="bookme" data-sitter-id="${sitter.id}">Book Me</button>
          </div>
      `;
      container.appendChild(card);

      // Attach fallback if image fails to load
      const imgElement = card.querySelector('img[alt="' + fullName + '"]');
      if (!imgElement) {
        imgElement.onerror = function () {
          this.src = '/uploads/sitters_profilePic/default.jpg';
        };
      }
  });

      const bookButtons = document.querySelectorAll(".bookme");
      bookButtons.forEach((button) => {
        button.addEventListener("click", async function () {
          const name = this.closest(".item1").querySelector("h3")?.textContent;
          const sitterId = this.dataset.sitterId;

          const token = getCookie("token");
          console.log(`Login token: ${token}`);

          //check if user is loged in 
          if (!token) {
            alert("You must be logged in to book a sitter.");
            window.location.href = "/api/users/login";
            return;
          }




          // Decode user ID from token
          let userId;
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            // const parsePayLoad = JSON.parse(tokenPayload);
            // userId = tokenPayload.userId;
            const now = Date.now() / 1000;
            if (tokenPayload.exp < now) {
              alert("token expired. Please log in again");
              window.location.href = "/login.html";
              return;
            }

            userId = tokenPayload.userId;


          } catch (error) {
            alert("Invalid session or token expired. Please log in again.");
            // localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
          }
          ///proced with booking if token is valid 
          try {
            const res = await fetch(`/api/bookings`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                sitterId,
                userId,
                date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
                duration: 2
              }),
            });

            const data = await res.json();
            if (res.ok) {
              alert(`You have successfully booked ${name}!`);
              this.textContent = "Booked";
              this.disabled = true;
              this.style.backgroundColor = "gray";
              this.style.cursor = "not-allowed";
            } else {
              alert(data.message || "Booking failed.");
            }
          } catch (err) {
            console.error("Booking error:", err);
            alert("Something went wrong.");
          }
        });
      });
  }catch (error) {
    console.log('Could not fetch', error);

  }
});
  



      // function extractor from cookies 
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}    

const nodemailer = require('nodemailer');

const sendSitterBookingEmail = (sitter, booking) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'stephengathwe@gmail.com',
    to: sitter.email,
    subject: `Booking request from ${booking.userName}`,
    html: `
      <p>You have received a booking request from ${booking.userName}.</p>
      <p>Booking Details:</p>
      <p>Date: ${booking.date}</p>
      <p>Duration: ${booking.duration} hours</p>
      <p><a href="http://yourdomain.com/booking/accept/${booking._id}">Click here to accept the booking</a></p>
      <p><a href="http://yourdomain.com/booking/decline/${booking._id}">Click here to decline the booking</a></p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error sending email:', err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
const sendConfirmationEmail = (sitter, user, booking) => {
  const zoomLink = generateZoomMeetingLink(); // Function to create Zoom meeting link

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  // Email to the sitter
  const sitterMailOptions = {
    from: 'your-email@gmail.com',
    to: sitter.email,
    subject: 'Booking Confirmation: Sitter Accepted',
    html: `
      <p>Your booking request has been accepted by ${user.name}.</p>
      <p>Meeting Link: ${zoomLink}</p>
      <p>Booking Details:</p>
      <p>Date: ${booking.date}</p>
      <p>Duration: ${booking.duration} hours</p>
    `,
  };

  // Email to the user
  const userMailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Booking Confirmation: Sitter Accepted',
    html: `
      <p>Your booking has been confirmed by ${sitter.name}.</p>
      <p>Meeting Link: ${zoomLink}</p>
      <p>Booking Details:</p>
      <p>Date: ${booking.date}</p>
      <p>Duration: ${booking.duration} hours</p>
    `,
  };

  transporter.sendMail(sitterMailOptions, (err, info) => {
    if (err) {
      console.log('Error sending email to sitter:', err);
    } else {
      console.log('Email sent to sitter: ' + info.response);
    }
  });

  transporter.sendMail(userMailOptions, (err, info) => {
    if (err) {
      console.log('Error sending email to user:', err);
    } else {
      console.log('Email sent to user: ' + info.response);
    }
  });
};

const sendDeclineEmail = (user, booking) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Booking Declined',
    html: `
      <p>Your booking request was declined by the sitter.</p>
      <p>Please consider booking another sitter.</p>
      <p>Booking Details:</p>
      <p>Date: ${booking.date}</p>
      <p>Duration: ${booking.duration} hours</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error sending decline email:', err);
    } else {
      console.log('Decline email sent to user: ' + info.response);
    }
  });
};
