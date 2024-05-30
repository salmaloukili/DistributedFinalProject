import { onCall } from "firebase-functions/v2/https";

// Mock event data
const events = [
  {
    id: 1,
    name: "Coldplay Concert",
    date: "15-09-2024",
    location: "Forest National Brussels",
    price: "150 EUR",
    image:
      "https://www.fnactickets.be/static/0/visuel/600/529/COLDPLAY_5295911052599460735.jpg",
    description:
      "Les fans de Coldplay sont en effervescence car le groupe assurera une 3ème tournée estivale des stades en Europe qui battra tous les records, y compris les premières dates de l’histoire du groupe à Athènes, Bucharest et Helsinki.\nLes fans Français vont se régaler : le groupe a annoncé 2 nouvelles dates à Lyon au Groupama Stadium les 22 & 23 juin 2024 !\nDepuis leur formation en 1996, Coldplay a conquis le cœur de millions de fans à travers le monde avec leurs mélodies emblématiques et leurs performances enflammées.\nDécouvrez tout ce qu’il faut savoir pour vous préparer à la prévente!",
  },
  {
    id: 2,
    name: "Hans Zimmer",
    date: "20-07-2024",
    location: "Sportpaleis Antwerp",
    priceRange: "120 EUR",
    image:
      "https://soundtrackfest.com/wp-content/uploads/2022/04/HansZimmerLiveEuropeTour2022-FinalConcerts-Main-Web-705x470.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget sit amet tellus cras adipiscing enim eu turpis. Lacinia quis vel eros donec ac. Volutpat blandit aliquam etiam erat velit scelerisque in dictum. Nunc non blandit massa enim nec dui nunc. Neque convallis a cras semper auctor neque vitae tempus. Mauris ultrices eros in cursus turpis massa tincidunt dui. Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. Sed cras ornare arcu dui vivamus arcu. Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit. Sapien et ligula ullamcorper malesuada. Vitae auctor eu augue ut lectus. Rhoncus urna neque viverra justo nec ultrices dui. Nascetur ridiculus mus mauris vitae. Odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. Sit amet est placerat in egestas erat imperdiet sed euismod.",
  },
];

exports.testfunc1 = onCall((request) => {
  return "Hello, world!";
});

exports.testfunc2 = onCall((request) => {
  return "Hello, world!";
});

exports.testfunc3 = onCall((request) => {
  return "Hello, world!";
});

exports.getEvents = onCall((request) => {
  return { events };
});
