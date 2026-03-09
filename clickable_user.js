function loadParticipants(participants) {
  const partBox = document.getElementById("participant"); // adjust ID if needed
  partBox.innerHTML = ""; // clear previous

  participants.forEach((p) => {
    const div = document.createElement("div");
    div.className = "f-box";
    div.textContent = p;

    // Highlight currentParticipant if matched
    if (p === currentParticipant) {
      div.classList.add("current-participant");
    }

    // Click event to update currentParticipant
    div.addEventListener("click", () => {
      currentParticipant = p;

      // Remove current style from all
      const allBoxes = partBox.querySelectorAll(".f-box");
      allBoxes.forEach(box => box.classList.remove("current-participant"));

      // Add style to clicked one
      div.classList.add("current-participant");
    });

    partBox.appendChild(div);
  });
}

.f-box:hover {
  background-color: #e0e0e0;
  transform: scale(1.03);
}
