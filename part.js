const participants = [
  {
    name: "John Doe",
    desc: "Youth leader from Grace Chapel",
    church: "Grace Chapel",
    img: "https://via.placeholder.com/150"
  },
  {
    name: "Jane Smith",
    desc: "Teen rep from Living Word",
    church: "Living Word",
    img: "https://via.placeholder.com/150"
  },
  {
    name: "Samuel Oke",
    desc: "Choir rep from Holy Flame",
    church: "Holy Flame",
    img: "https://via.placeholder.com/150"
  },
  {
    name: "Esther Joy",
    desc: "Bible study head at Grace Chapel",
    church: "Grace Chapel",
    img: "https://via.placeholder.com/150"
  }
];

function displayParticipants(list) {
  const container = document.getElementById("participantsGrid");
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

function filterParticipants() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("filterSelect").value;

  const filtered = participants.filter(p => {
    const matchText = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    const matchChurch = filter === "all" || p.church === filter;
    return matchText && matchChurch;
  });

  displayParticipants(filtered);
}

// Display on load
displayParticipants(participants);

// Set up filters
document.getElementById("searchInput").addEventListener("input", filterParticipants);
document.getElementById("filterSelect").addEventListener("change", filterParticipants);
