//maps and location tracking functionality
let map;    
let marker= [];
const childrenLocations = [
  { name: "Alex", lat: -1.2921, lng: 36.8219 },
  { name: "Brian", lat: -1.3000, lng: 36.8000 },
  { name: "Sarah", lat: -1.3100, lng: 36.8100 }
];


function initMap() {
  map = new 
  google.maps.Map(document.getElementById("map"), {
    center : { lat: -1.2921, lng: 36.8219 },
    zoom: 12
  });

  new google.maps.Marker({
    position: { lat: -1.2921, lng: 36.8219 },
    map: map,
    title: "Parent Location (demo)"
  });

  childrenLocations.forEach((child) => {
    const marker = new google.maps.Marker({
      position: { lat: child.lat, lng: child.lng },
      map: map,
      title: child.name,
    });
    marker.push(marker);
  });
}

//add mutiple children
//each child has independent buttons to get location and lock phone



function showLocation() {
  document.getElementById("status").innerText =
    "Status: Nairobi (demo location)";
}

function lockPhone() {
  document.getElementById("status").innerText =
    "Status: Phone Locked (demo)";
}
const children = [
  { name: "Alex", status: "Offline" },
  { name: "Brian", status: "Offline" },
  { name: "Mary", status: "Offline" },
  { name: "Sarah", status: "Offline" }
];

const container = document.getElementById("childrenContainer");

function renderChildren() {
  container.innerHTML = "";

  children.forEach((child, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>Child: ${child.name}</h2>
      <p id="status-${index}">Status: ${child.status}</p>
      <p> Location: ${child.location}</p>



      <button onclick="getLocation(${index})">Get Location</button>
      <button onclick="lockPhone(${index})">Lock Phone</button>
    `;

    container.appendChild(card);
  });
}

function getLocation(i) {
  document.getElementById(`status-${i}`).innerText =
    "Status: Nairobi (demo location)";
}

function lockPhone(i) {
  document.getElementById(`status-${i}`).innerText =
    "Status: Phone Locked (demo)";
}

renderChildren();

