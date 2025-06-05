
let map = L.map('map').setView([1.3521, 103.8198], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

let foodTypeSet = new Set();
let markers = [];
let storedData = JSON.parse(localStorage.getItem('foodRatings') || '{}');

navigator.geolocation.getCurrentPosition(
    pos => {
        const { latitude, longitude } = pos.coords;
        L.circleMarker([latitude, longitude], { radius: 6, color: 'blue' })
            .addTo(map)
            .bindPopup("You are here");
    },
    () => {},
    { enableHighAccuracy: true }
);

function createPopupContent(dataKey, name, food, description, tips, mapLink) {
    const stored = storedData[dataKey] || {};
    let rating = stored.rating || '';
    let notes = stored.notes || '';
    let photo = stored.photo || '';

    return `
        <b>${name}</b><br/>
        <small><i>${food} – ${description || ''}</i></small><br/>
        ${tips ? `<b>Tip:</b> ${tips}<br/>` : ''}
        <a href="${mapLink}" target="_blank">Open in Google Maps</a><br/><br/>
        <label>Rating (0–10):</label>
        <input type="number" min="0" max="10" step="0.1" value="${rating}" 
            onchange="saveRating('${dataKey}', this.value)" /><br/>
        ${rating ? `
            <label>Notes:</label><br/>
            <textarea rows="2" onchange="saveNotes('${dataKey}', this.value)">${notes}</textarea><br/>
            <label>Upload Photo:</label>
            <input type="file" accept="image/*" onchange="savePhoto(event, '${dataKey}')" /><br/>
            ${photo ? `<img src="${photo}" width="100" />` : ''}
        ` : ''}
    `;
}

function saveRating(key, value) {
    storedData[key] = storedData[key] || {};
    storedData[key].rating = parseFloat(value);
    localStorage.setItem('foodRatings', JSON.stringify(storedData));
    location.reload(); // reload to update marker color
}

function saveNotes(key, value) {
    storedData[key] = storedData[key] || {};
    storedData[key].notes = value;
    localStorage.setItem('foodRatings', JSON.stringify(storedData));
}

function savePhoto(event, key) {
    const reader = new FileReader();
    reader.onload = function () {
        storedData[key] = storedData[key] || {};
        storedData[key].photo = reader.result;
        localStorage.setItem('foodRatings', JSON.stringify(storedData));
        location.reload();
    };
    reader.readAsDataURL(event.target.files[0]);
}

function getColor(rating) {
    if (rating >= 9) return 'green';
    if (rating >= 7) return 'yellow';
    if (rating >= 0) return 'red';
    return 'gray';
}

fetch('cleaned_sg_food_data.csv')
    .then(res => res.text())
    .then(csv => {
        const rows = csv.split('\n').slice(1);
        const foodOptions = new Set();
        rows.forEach((row, idx) => {
            const cols = row.split(',');
            if (cols.length < 7) return;

            const [name, food, description, tips, lat, lng, mapLink] = cols.map(c => c.trim());
            if (!lat || !lng) return;

            foodOptions.add(food);

            const key = `${name}_${lat}_${lng}`;
            const rating = storedData[key]?.rating ?? null;
            const marker = L.circleMarker([parseFloat(lat), parseFloat(lng)], {
                radius: 8,
                color: getColor(rating),
                fillOpacity: 0.9
            });

            const popup = createPopupContent(key, name, food, description, tips, mapLink);
            marker.bindPopup(popup);
            marker.foodType = food;
            marker.addTo(map);
            markers.push(marker);
        });

        const select = document.createElement('select');
        select.innerHTML = `<option value="All">All Foods</option>` +
            Array.from(foodOptions).map(f => `<option value="${f}">${f}</option>`).join('');
        select.onchange = () => {
            const value = select.value;
            markers.forEach(m => {
                if (value === 'All' || m.foodType === value) {
                    m.addTo(map);
                } else {
                    map.removeLayer(m);
                }
            });
        };
        select.style.position = 'absolute';
        select.style.top = '10px';
        select.style.left = '10px';
        select.style.zIndex = 1000;
        document.body.appendChild(select);
    });

// Add new place
const addBtn = document.createElement('button');
addBtn.innerText = '+ Add Place';
addBtn.style.position = 'absolute';
addBtn.style.bottom = '20px';
addBtn.style.left = '10px';
addBtn.style.zIndex = 1000;
addBtn.onclick = () => {
    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const name = prompt("Enter place name:");
        const food = prompt("Enter food type:");
        const desc = prompt("Enter short description:");
        const tip = prompt("Any tip?");
        const link = prompt("Paste Google Maps link:");
        const key = `${name}_${lat}_${lng}`;
        storedData[key] = { rating: null, notes: '', photo: '', new: true };
        localStorage.setItem('foodRatings', JSON.stringify(storedData));
        location.reload();
    });
};
document.body.appendChild(addBtn);
