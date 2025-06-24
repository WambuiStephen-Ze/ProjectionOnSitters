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
    const res = await fetch('sitters/data');
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
      if (imgElement) {
        imgElement.onerror = function () {
          this.src = '/uploads/sitters_profilePic/default.jpg';
        };
      }
  });

    //  Add click listeners AFTER rendering
    document.addEventListener('DOMContentLoaded', () => {
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
            if (parsedPayLoad.exp < now) {
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
                // "Authorization": `Bearer ${token}`,
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