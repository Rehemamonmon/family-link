
// ============================
//  DATA
// ============================
let children = [
  { name: "Alex",  status: "Offline", location: "Nairobi", lat: -1.2921, lng: 36.8219, locked: false, avatar: "https://i.pravatar.cc/48?img=1" },
  { name: "Brian", status: "Offline", location: "Nairobi", lat: -1.3000, lng: 36.8000, locked: false, avatar: "https://i.pravatar.cc/48?img=3" },
  { name: "Mary",  status: "Offline", location: "Nairobi", lat: -1.3100, lng: 36.8100, locked: false, avatar: "https://i.pravatar.cc/48?img=5" },
  { name: "Sarah", status: "Offline", location: "Nairobi", lat: -1.2800, lng: 36.8300, locked: false, avatar: "https://i.pravatar.cc/48?img=9" }
];

let map;
let markers = [];

// ============================
//  GOOGLE MAPS INIT
// ============================
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -1.2921, lng: 36.8219 },
    zoom: 12,
    styles: [
      { elementType: "geometry",        stylers: [{ color: "#1a1d27" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#1a1d27" }] },
      { elementType: "labels.text.fill",   stylers: [{ color: "#8892b0" }] },
      { featureType: "road",            elementType: "geometry", stylers: [{ color: "#2e3250" }] },
      { featureType: "water",           elementType: "geometry", stylers: [{ color: "#0f1117" }] },
      { featureType: "poi",             stylers: [{ visibility: "off" }] },
      { featureType: "transit",         stylers: [{ visibility: "off" }] }
    ]
  });
  placeMarkers();
}

function placeMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];

  children.forEach((child, i) => {
    const color = child.locked ? "#facc15" : child.status === "Online" ? "#4ade80" : "#f87171";

    const marker = new google.maps.Marker({
      position: { lat: child.lat, lng: child.lng },
      map: map,
      title: child.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2
      }
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="font-family:Sora,sans-serif;padding:8px;color:#111;">
          <strong>${child.name}</strong><br/>
          Status: ${child.status}<br/>
          Location: ${child.location}
        </div>`
    });

    marker.addListener("click", () => infoWindow.open(map, marker));
    markers.push(marker);
  });
}

// Fallback if no Maps API key — show a styled placeholder
window.initMap = window.initMap || function() {
  const mapEl = document.getElementById("map");
  mapEl.innerHTML = `
    <div style="text-align:center;padding:40px;color:#8892b0;">
      <i class="fa-solid fa-map" style="font-size:3rem;margin-bottom:12px;display:block;"></i>
      <p style="font-size:0.9rem;">Add your Google Maps API key<br/>in index.html to enable the live map.</p>
    </div>`;
};

// ============================
//  RENDER CHILDREN
// ============================
function renderChildren(list) {
  const container = document.getElementById("childrenContainer");
  const noResults = document.getElementById("noResults");

  if (!list || list.length === 0) {
    container.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");
  container.innerHTML = "";

  list.forEach((child, i) => {
    const realIndex = children.indexOf(child);
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card-${realIndex}`;

    const statusClass = child.locked ? "locked" : child.status.toLowerCase();
    const statusIcon  = child.locked ? "🔒" : child.status === "Online" ? "🟢" : "🔴";
    const locationText = child.location || "Unknown";

    card.innerHTML = `
      <div class="card-top">
        <img src="${child.avatar}" class="child-avatar" alt="${child.name}"/>
        <div class="child-info">
          <p class="child-name">${child.name}</p>
          <span class="status-badge ${statusClass}">${statusIcon} ${child.locked ? "Locked" : child.status}</span>
        </div>
        <button class="btn-remove" onclick="removeChild(${realIndex})" title="Remove child">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <div class="child-location">
        <i class="fa-solid fa-location-dot" style="color:#6c63ff;"></i>
        ${locationText}
      </div>
      <div class="card-actions">
        <button class="btn-action btn-location" onclick="getLocation(${realIndex})">
          <i class="fa-solid fa-crosshairs"></i> Get Location
        </button>
        <button class="btn-action btn-lock" onclick="lockPhone(${realIndex})">
          <i class="fa-solid ${child.locked ? 'fa-lock-open' : 'fa-lock'}"></i>
          ${child.locked ? 'Unlock' : 'Lock Phone'}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  updateStats();
}

// ============================
//  SEARCH
// ============================
function searchChildren() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = query ? children.filter(c => c.name.toLowerCase().includes(query)) : children;
  renderChildren(filtered);
}

// ============================
//  GET LOCATION
// ============================
function getLocation(index) {
  const child = children[index];
  children[index].status = "Online";

  showModal(
    `📍 Location Found`,
    `${child.name} is currently at:\n${child.location}\n(Lat: ${child.lat}, Lng: ${child.lng})`
  );

  if (map) {
    map.panTo({ lat: child.lat, lng: child.lng });
    map.setZoom(14);
    placeMarkers();
  }

  renderChildren(children);
}

// ============================
//  LOCK PHONE
// ============================
function lockPhone(index) {
  const child = children[index];
  child.locked = !child.locked;

  if (child.locked) {
    child.status = "Locked";
    showModal("🔒 Phone Locked", `${child.name}'s phone has been locked successfully.`);
  } else {
    child.status = "Offline";
    showModal("🔓 Phone Unlocked", `${child.name}'s phone has been unlocked.`);
  }

  if (map) placeMarkers();
  renderChildren(children);
}

// ============================
//  ADD CHILD
// ============================
function addChild() {
  const name = prompt("Enter child's name:");
  if (!name || name.trim() === "") return;

  const avatarId = Math.floor(Math.random() * 70) + 1;
  children.push({
    name: name.trim(),
    status: "Offline",
    location: "Nairobi",
    lat: -1.2921 + (Math.random() - 0.5) * 0.05,
    lng: 36.8219 + (Math.random() - 0.5) * 0.05,
    locked: false,
    avatar: `https://i.pravatar.cc/48?img=${avatarId}`
  });

  renderChildren(children);
  if (map) placeMarkers();
  showModal("✅ Child Added", `${name.trim()} has been added to your dashboard.`);
}

// ============================
//  REMOVE CHILD
// ============================
function removeChild(index) {
  const name = children[index].name;
  if (!confirm(`Remove ${name} from the dashboard?`)) return;
  children.splice(index, 1);
  renderChildren(children);
  if (map) placeMarkers();
}

// ============================
//  STATS
// ============================
function updateStats() {
  document.getElementById("totalCount").textContent  = children.length;
  document.getElementById("onlineCount").textContent = children.filter(c => c.status === "Online").length;
  document.getElementById("lockedCount").textContent = children.filter(c => c.locked).length;
}

// ============================
//  MODAL
// ============================
function showModal(title, message) {
  document.getElementById("modalTitle").textContent   = title;
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// ============================
//  INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
  renderChildren(children);

  // Enter key triggers search
  document.getElementById("searchInput").addEventListener("keyup", e => {
    if (e.key === "Enter") searchChildren();
  });
});
