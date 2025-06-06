
// --- IndexedDB Setup ---
let db;
const request = indexedDB.open('FoodMapDB', 1);
request.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore('images', { keyPath: 'key' });
};
request.onsuccess = (e) => {
    db = e.target.result;
    renderAllPoints();  // now render after DB ready
};
request.onerror = () => alert('IndexedDB failed. Image saving may not work.');

// Save image to IndexedDB
function saveImageToIndexedDB(key, imageData) {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    store.put({ key, imageData });
}

// Load image from IndexedDB
function loadImageFromIndexedDB(key, callback) {
    const tx = db.transaction('images', 'readonly');
    const store = tx.objectStore('images');
    const req = store.get(key);
    req.onsuccess = () => callback(req.result?.imageData || null);
    req.onerror = () => callback(null);
}

function createPopupContent(key, name, food, desc, tips, mapsUrl) {
    const stored = JSON.parse(localStorage.getItem('foodRatings') || '{}');
    const data = stored[key] || {};
    const rating = data.rating ?? '';
    const note = data.note ?? '';
    const container = document.createElement('div');
    container.className = 'popup-container';
    container.innerHTML = `
        <div style="font-weight: bold; font-size: 1.1em;">${name}</div>
        <div style="margin-bottom: 4px; font-size: 0.9em; color: #555;">
            ${food ? `<strong>${food}</strong> - ${desc}` : desc}
        </div>
        ${tips && tips !== 'nan' ? `<div style="margin-bottom: 4px; font-size: 0.85em;">📝 ${tips}</div>` : ''}
        <a href="${mapsUrl}" target="_blank">📍 Open in Google Maps</a>
        <div class="rating-section">
            <label>Rating:</label>
            <input type="number" min="0" max="10" step="0.1" value="${rating}" onchange="updateRating('${key}', this.value)" />
        </div>
        <div class="note-section">
            <label>Note:</label><br/>
            <textarea onchange="updateNote('${key}', this.value)">${note}</textarea>
        </div>
        <div class="photo-section" style="margin-top: 5px;">
            <label>Photo:</label><br/>
            <input type="file" accept="image/*" onchange="handleImageUpload(event, '${key}')"/>
            <div id="img-${key}" class="popup-image-preview"></div>
        </div>
    `;
    loadImageFromIndexedDB(key, (imageData) => {
        if (imageData) {
            document.getElementById(`img-${key}`).innerHTML = `<img src="${imageData}" style="width: 100%; border-radius: 8px; margin-top: 5px;">`;
        }
    });
    return container;
}

function handleImageUpload(e, key) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        const imgData = reader.result;
        saveImageToIndexedDB(key, imgData);
        const imgDiv = document.getElementById(`img-${key}`);
        imgDiv.innerHTML = `<img src="${imgData}" style="width: 100%; border-radius: 8px; margin-top: 5px;">`;
    };
    reader.readAsDataURL(file);
}

function renderAllPoints() {
    const stored = JSON.parse(localStorage.getItem('foodRatings') || '{}');
    const extra = JSON.parse(localStorage.getItem('addedPlaces') || '[]');
    const allData = data.concat(extra);
    allData.forEach(row => {
        const { Name, Food, Description, Tips, Latitude, Longitude, GoogleMapsURL } = row;
        const lat = parseFloat(Latitude), lng = parseFloat(Longitude);
        const key = `${Name}_${lat}_${lng}`;
        const rating = stored[key]?.rating ?? null;
        const marker = L.circleMarker([lat, lng], {
            radius: 8,
            color: getColor(rating),
            fillOpacity: 0.9
        });
        const popup = createPopupContent(key, Name, Food, Description, Tips, GoogleMapsURL);
        marker.bindPopup(popup);
        marker.foodType = Food;
        marker.addTo(map);
        markers.push(marker);
    });
}
renderAllPoints();

// Ratings + Notes handling remains the same
