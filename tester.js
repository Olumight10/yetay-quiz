// function checkScore() {
//   fetch('data.json')
//     .then(res => res.json())
//     .then(data => {
//       if (data.score > 90) {
//         console.log(`${data.username} passed with flying colors!`);
//       } else {
//         console.log(`${data.username} needs improvement.`);
//       }
//     })
//     .catch(err => console.error("Failed to load JSON:", err));
// }
// checkScore();



const fs = require('fs');

function checkScore() {
  fs.readFile('./data.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.error("Failed to load JSON:", err);
      return;
    }
    try {
      const data = JSON.parse(jsonString);
      if (data.score > 90) {
        console.log(`${data.username} passed with flying colors!`);
      } else {
        console.log(`${data.username} needs improvement.`);
      }
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  });
}

checkScore();
