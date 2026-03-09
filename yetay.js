// // Countdown to Yetay 2.0
// const eventDate = new Date("August 17, 2025 10:00:00").getTime();

// const timer = setInterval(function () {
//   const now = new Date().getTime();
//   const distance = eventDate - now;

//   const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//   document.getElementById("timer").innerHTML =
//     `${days}d ${hours}h ${minutes}m ${seconds}s`;

//   if (distance < 0) {
//     clearInterval(timer);
//     document.getElementById("timer").innerHTML = "Started!";
//   }
// }, 1000);


// yetay.js

const galleryImages = [
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/Yetay_1.jpg?v=1748085269749',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_2.jpg?v=1748085293843',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_3.jpg?v=1748085300870',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_4.jpg?v=1748085314520',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_5.jpg?v=1748085343531',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_6.jpg?v=1748085358612',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_2.jpg?v=1748085293843',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_3.jpg?v=1748085300870',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_4.jpg?v=1748085314520',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_5.jpg?v=1748085343531',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_6.jpg?v=1748085358612',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_2.jpg?v=1748085293843',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_3.jpg?v=1748085300870',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_4.jpg?v=1748085314520',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_5.jpg?v=1748085343531',
  'https://cdn.glitch.global/75a24ea2-773d-456a-8abd-1c76671f333c/yetay_6.jpg?v=1748085358612',
];

let currentIndex = 0;

function rotateGallery() {
  const gallery = document.getElementById('gallery-carousel');
  const imgs = gallery.querySelectorAll('img');

  imgs.forEach((img, i) => {
    img.style.opacity = '0'; // fade out
    setTimeout(() => {
      img.src = galleryImages[(currentIndex + i) % galleryImages.length];
      img.style.opacity = '1'; // fade in
    }, 300); // delay fade-in slightly
  });

  currentIndex = (currentIndex + 1) % galleryImages.length;
}

// Change images every 4 seconds
setInterval(rotateGallery, 8000);




const imagesPerPage = 12;
let currentPage = 1;
const totalPages = Math.ceil(galleryImages.length / imagesPerPage);

const gallery = document.getElementById('gallery-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageCounter = document.getElementById('pageCounter');

function renderGallery() {
  // Clear previous images
  gallery.innerHTML = '';

  // Calculate start and end index for current page
  const start = (currentPage - 1) * imagesPerPage;
  const end = start + imagesPerPage;

  // Slice images for this page
  const imagesToShow = galleryImages.slice(start, end);

  // Add image elements to gallery
  imagesToShow.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = "Gallery Image";
    gallery.appendChild(img);
  });

  // Update buttons state
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Update page counter
  pageCounter.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event Listeners for buttons
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderGallery();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderGallery();
  }
});

// Initial render
renderGallery();


const participants = [
  { name: "John Doe", desc: "Youth leader from Grace Chapel", church: "Grace Chapel", img: "https://via.placeholder.com/150" },
  { name: "Jane Smith", desc: "Teen rep from Living Word", church: "Living Word", img: "https://via.placeholder.com/150" },
  { name: "Samuel Oke", desc: "Choir rep from Holy Flame", church: "Holy Flame", img: "https://via.placeholder.com/150" },
  { name: "Esther Joy", desc: "Bible study head at Grace Chapel", church: "Grace Chapel", img: "https://via.placeholder.com/150" },
];

function displayParticipants(list) {
  const container = document.getElementById("participantsGrid");
  if (!container) {
    console.error("participantsGrid not found in HTML.");
    return;
  }
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "participant-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
    `;
    container.appendChild(card);
  });
}

// Call this immediately — not in a window.onload or DOMContentLoaded
displayParticipants(participants);

// Attach search + filter listeners
document.getElementById("searchInput").addEventListener("input", filterParticipants);
document.getElementById("filterSelect").addEventListener("change", filterParticipants);

function filterParticipants() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("filterSelect").value;

  const filtered = participants.filter(p => {
    const matchesText = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    const matchesChurch = filter === "all" || p.church === filter;
    return matchesText && matchesChurch;
  });

  displayParticipants(filtered);
}


document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    // Mobile Menu Toggle
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle icon between bars and times (X)
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking a link (useful for one-page feel)
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    // Mobile Menu Toggle
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle icon between bars and times (X)
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking a link (useful for one-page feel)
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle the icon from bars to 'X'
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });
});