const BASE_URL = "https://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
// Book buttons (for multiple sitters)
    const bookme = document.querySelectorAll(".bookme");

    bookme.forEach((button) => {
        button.addEventListener("click", function () {
            const name = this.parentNode.parentNode.querySelector(".box > .content > h3")?.textContent
            if (name)
                alert(`You have booked ${name}!`);
        });
    });

    bookme.forEach((button) => {
        button.addEventListener("click", async function () {
            const name = this.parentNode.parentNode.querySelector(".box > .content > h3")?.textContent;
            const sitterId = this.dataset.sitterid;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to book a sitter.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/bookings/secure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sitterId,
          userId: "USER_ID_FROM_TOKEN_OR_API",
          date: new Date().toISOString()
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`You have successfully booked ${name}!`);
        this.textContent = "Unavailable";
        this.disabled = true;
        this.style.backgroundColor = "gray";
        this.style.cursor = "not-allowed";
      } else {
        alert(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
    }
  });
    });
});

document.addEventListener('DOMContentLoaded', async() => {
  // container to display the sitter
    const container = document.getElementById('sitters-list');
  try {
    const res = await fetch('api/sitters/data');
    const sitters = await res.json();
    console.log('Sitters', sitters);


    //looping through the data
    sitters.forEach(sitter => {
      const card = document.createElement('div');
      card.classList.add('item1');

      card.innerHTML = `
      <div class="item1">
          <img class="symbol" src="/images/mark-up.png" alt="">
          <div class="box">
            <img src="/uploads/sitters_profilePics/${sitter.profilePic}" alt="${sitter.name}">
            <div class="content">
              <h3>${sitter.name}</h3>
              <p class="city"> <img src="/images/location.png" alt="${sitter.location}"> Jos, Nigeria</p>
              <p class="years">${sitter.experience}</p>
            </div>
          </div>
          <div class="sub-content">
            <p class="avail"><img src="/images/clock2.png" alt="">${sitter.availability}</p>
            <p class="phone"> <img src="/images/call-2.png" alt="">${sitter.phone}</p>
          </div>
          <div class="book">
            <button class="bookme" data-sitter-id="${sitter.id}">Book Me</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    })

  } catch {
    console.error('Failed to fetch sitters', err);

  }
});