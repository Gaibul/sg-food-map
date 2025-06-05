
let map = L.map('map').setView([1.3521, 103.8198], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(
    (pos) => {
        const { latitude, longitude } = pos.coords;
        L.circleMarker([latitude, longitude], { radius: 6, color: 'blue' })
            .addTo(map)
            .bindPopup("You are here");
    },
    () => {},
    { enableHighAccuracy: true }
);

fetch('cleaned_sg_food_data.csv')
    .then(res => res.text())
    .then(csv => {
        const rows = csv.split('\n').slice(1);
        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 6) return;

            const name = cols[0];
            const food = cols[1];
            const description = cols[2];
            const tips = cols[3];
            const lat = parseFloat(cols[4]);
            const lng = parseFloat(cols[5]);
            const mapLink = cols[6];

            if (!lat || !lng) return;

            const marker = L.circleMarker([lat, lng], {
                radius: 8,
                color: 'gray',
                fillOpacity: 0.8
            });

            const popupContent = `
                <b>${name}</b><br/>
                ${food}<br/>
                ${description}<br/>
                <i>${tips}</i><br/>
                <a href="${mapLink}" target="_blank">Open in Google Maps</a>
            `;

            marker.bindPopup(popupContent).addTo(map);
        });
    });
