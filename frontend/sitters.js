const BASE_URL = "https://localhost:3000";


console.log("sitters.js loaded ✅");



document.addEventListener('DOMContentLoaded', async() => {
  console.log("Fetching sitters...");
  // container to display the sitter
    const container = document.getElementById('sitters-list');
  try {
    const res = await fetch('api/sitters/data');
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
      const availability = JSON.parse(sitter.availability || '"Not available"');
      const phone = sitter.phone || 'Not provided';
      const profilePic = sitter.profilePic || '/images/default-avatar.png';

      card.innerHTML = `
          <img class="symbol" src="/images/mark-up.png" alt="">
          <div class="box">
            <img src="${profilePic}" alt="${fullName}">
            <div class="content">
              <h3>${fullName}</h3>
              <p class="city"> <img src="/images/location.png" alt="">${location}</p>
              <p class="years">${experience}</p>
            </div>
          </div>
          <div class="sub-content">
            <p class="avail"><img src="/images/clock2.png" alt="">${availability}</p>
            <p class="phone"> <img src="/images/call-2.png" alt="">${phone}</p>
          </div>
          <div class="book">
            <button class="bookme" data-sitter-id="${sitter.id}">Book Me</button>
          </div>
      `;
      container.appendChild(card);
    })

  } catch (error) {
  console.error('Failed to fetch sitters:', error);
}
});

document.addEventListener("DOMContentLoaded", () => {
  const bookButtons = document.querySelectorAll(".bookme");

  bookButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const name = this.closest(".item1").querySelector("h3")?.textContent;
      const sitterId = this.dataset.sitterId; // NOTE: use camelCase

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book a sitter.");
        window.location.href = "/login.html?redirect=/sitters.html";
        return;
      }

      // OPTIONAL: decode user ID from token (or fetch it from backend if needed)
      let userId;
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        userId = tokenPayload.userId;
      } catch {
        alert("Invalid session. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login.html";
        return;
      }

      try {
        const res = await fetch(`/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            sitterId,
            userId,
            date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // optional: 1 hour later
            duration: 2 // fixed value or input-based
          })
        });

        const data = await res.json();
        if (res.ok) {
          alert(`You have successfully booked ${name}!`);
          this.textContent = "Booked";
          this.disabled = true;
          this.classList.add("disabled");
        } else {
          alert(data.message || "Booking failed.");
        }
      } catch (err) {
        console.error("Booking error:", err);
        alert("Something went wrong during booking.");
      }
    });
  });
});
