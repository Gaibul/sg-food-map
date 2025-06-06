let map = L.map('map').setView([1.3521, 103.8198], 12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

let markers = [];
let storedData = JSON.parse(localStorage.getItem('foodRatings') || '{}');
const data = [{"Name": "Le Cheng", "Food": "Chicken rice", "Description": "Hainanese chicken rice is a dish of poached chicken and seasoned rice, served with chilli sauce and usually with cucumber garnishes.", "Tips": "Kampung half chicken", "Latitude": 1.318877588, "Longitude": 103.910394, "GoogleMapsURL": "https://maps.app.goo.gl/iLcmbRY6ECU2x6ir8"}, {"Name": "Tian Tian", "Food": "Chicken rice", "Description": "Hainanese chicken rice is a dish of poached chicken and seasoned rice, served with chilli sauce and usually with cucumber garnishes.", "Tips": "Maxwell Food centre", "Latitude": 1.280441278, "Longitude": 103.8447981, "GoogleMapsURL": "https://maps.app.goo.gl/X212S1g9xeutE7hp7"}, {"Name": "Hup Hong", "Food": "Chicken rice", "Description": "Hainanese chicken rice is a dish of poached chicken and seasoned rice, served with chilli sauce and usually with cucumber garnishes.", "Tips": "nan", "Latitude": 1.343397139, "Longitude": 103.7376224, "GoogleMapsURL": "https://maps.app.goo.gl/CRXtg9Ubgu8FzAHQ9"}, {"Name": "Boon Tong Kee", "Food": "Chicken rice", "Description": "Hainanese chicken rice is a dish of poached chicken and seasoned rice, served with chilli sauce and usually with cucumber garnishes.", "Tips": "It\u2019s a chain, so multiple", "Latitude": 1.325509156, "Longitude": 103.8495484, "GoogleMapsURL": "https://maps.app.goo.gl/9xyC1mcbTRwR3VAu9"}, {"Name": "545 Whampoa Prawn Noodles", "Food": "Prawn Noodles", "Description": "Prawn noodles, known as &quot;prawn mee&quot; in Singapore, are a popular noodle dish featuring succulent prawns and a flavorful broth, often served with yellow noodles (Hokkien mee) or vermicelli.", "Tips": "Tekka Centre", "Latitude": 1.305810469, "Longitude": 103.8504295, "GoogleMapsURL": "https://maps.app.goo.gl/4XC9kk8LtEEhymfv9"}, {"Name": "Sin Hoi Sai Eating House", "Food": "Chilli crab", "Description": "Chilli crab is a popular seafood dish among locals and foreigners in Singapore, and consists of mud crabs deep-fried in a sweet, savoury and spicy gravy. It has been referred to in various food publications as Singapore&#x27;s national dish.", "Tips": "Some other dishes to try here - moonlight hor fun, prawn paste chicken, stir fry flat noodles raw egg dish", "Latitude": 1.307103715, "Longitude": 103.9062675, "GoogleMapsURL": "https://maps.app.goo.gl/RSBcJLDr5SViPJ4C8"}, {"Name": "Waker Chicken", "Food": "Fried chicken", "Description": "Its fried Chicken- what do you expect", "Tips": "It\u2019s a chain, so multiple", "Latitude": 1.30706508, "Longitude": 103.7933963, "GoogleMapsURL": "https://maps.app.goo.gl/84qR4RCRV88s7PgH8"}, {"Name": "Bak Kee Teochew", "Food": "Satay Bee Hoon", "Description": "Satay bee hoon is a Singaporean dish. It was created due to cultural fusion of the Malays or Javanese with the Teochew people who immigrated to Singapore. Satay bee hoon sauce is a chilli-based peanut sauce very similar to the one served with satay. The satay sauce is spread on top of rice vermicelli.", "Tips": "Get the Satay Bee Hoon Regular", "Latitude": 1.287477477, "Longitude": 103.8183008, "GoogleMapsURL": "https://maps.app.goo.gl/BJANkTN16ibTZUD48"}, {"Name": "Alhambra Satay", "Food": "Satay", "Description": "Satay is a Southeast Asian dish featuring marinated, skewered, and grilled meat, typically served with a rich peanut sauce.", "Tips": "nan", "Latitude": 1.316651087, "Longitude": 103.8981819, "GoogleMapsURL": "https://maps.app.goo.gl/Yd32GMciEXSkSLXF9"}, {"Name": "168 CMY Satay", "Food": "Satay", "Description": "Satay is a Southeast Asian dish featuring marinated, skewered, and grilled meat, typically served with a rich peanut sauce.", "Tips": "nan", "Latitude": 1.282304641, "Longitude": 103.8429245, "GoogleMapsURL": "https://maps.app.goo.gl/yDZ94jMJAJ7pE59X8"}, {"Name": "Jing Hua Sliced Fish Bee Hoon", "Food": "Fish Bee Hoon", "Description": "Fish Bee Hoon (also known as Fish Soup Bee Hoon or Fish Head Bee Hoon) is a popular Singaporean dish consisting of a flavorful fish soup served with rice vermicelli (bee hoon).", "Tips": "Maxwell Food centre", "Latitude": 1.280334884, "Longitude": 103.8447632, "GoogleMapsURL": "https://maps.app.goo.gl/ddHvYYqfVQT1Cnm57"}, {"Name": "Swee Guan Hokkien Mee", "Food": "Hokkien Mee", "Description": "Fried Hokkien prawn noodles, known locally as Hokkien mee, is a dish comprising thick yellow noodles fried in a rich prawn and pork stock and served with chilli and lime on the side.", "Tips": "nan", "Latitude": 1.313922758, "Longitude": 103.8854711, "GoogleMapsURL": "https://maps.app.goo.gl/zZRKL286doXrnXhn9"}, {"Name": "Come Daily Fried Hokkien Prawn Mee", "Food": "Hokkien Mee", "Description": "Fried Hokkien prawn noodles, known locally as Hokkien mee, is a dish comprising thick yellow noodles fried in a rich prawn and pork stock and served with chilli and lime on the side.", "Tips": "nan", "Latitude": 1.338024189, "Longitude": 103.8446984, "GoogleMapsURL": "https://maps.app.goo.gl/vMSdVfm2D5oYKHQF6"}, {"Name": "Nam Sing Hokkien Fried Mee", "Food": "Hokkien Mee", "Description": "Fried Hokkien prawn noodles, known locally as Hokkien mee, is a dish comprising thick yellow noodles fried in a rich prawn and pork stock and served with chilli and lime on the side.", "Tips": "nan", "Latitude": 1.308212014, "Longitude": 103.8855936, "GoogleMapsURL": "https://maps.app.goo.gl/UjFggct4i2qiqQbT9"}, {"Name": "Hill Stree Fried Kway Teow", "Food": "Char Kway Teow", "Description": "In the Hokkien vernacular, char means \u201cstir-fried\u201d and kway teow refers to flat rice noodles. To prepare the dish, rice sheets are cut into thin noodle strips. The flat noodles are then combined with thick yellow wheat noodles and stir-fried in dark, sweet soya sauce, garlic and lard.", "Tips": "nan", "Latitude": 1.282835842, "Longitude": 103.8429404, "GoogleMapsURL": "https://maps.app.goo.gl/z9NnqEH9yVLh1PbQ7"}, {"Name": "Outram Park Fried Kway Teow Mee", "Food": "Char Kway Teow", "Description": "In the Hokkien vernacular, char means \u201cstir-fried\u201d and kway teow refers to flat rice noodles. To prepare the dish, rice sheets are cut into thin noodle strips. The flat noodles are then combined with thick yellow wheat noodles and stir-fried in dark, sweet soya sauce, garlic and lard.", "Tips": "nan", "Latitude": 1.28537432, "Longitude": 103.845918, "GoogleMapsURL": "https://maps.app.goo.gl/CgXHWxQdmMATrkYz9"}, {"Name": "Song Zhou Luo Bo Gao", "Food": "Chai Tow Kway", "Description": "Fried carrot cake, or chai tow kway in the Teochew dialect, consists of cubes of radish cake stir-fried with garlic, eggs and preserved radish. The dish has two common versions: the white version, which is seasoned with light soya sauce, and the black version, where dark soya sauce is added instead.", "Tips": "Carrot Cake", "Latitude": 1.325130139, "Longitude": 103.9306524, "GoogleMapsURL": "https://maps.app.goo.gl/2PSwmf1PrAmxmqX69"}, {"Name": "Guangzhou Mian Shi Wanton Noodle", "Food": "Wanton mee", "Description": "Wanton mee is a popular noodle dish in Singapore and Malaysia, known for its thin, chewy egg noodles and savory wonton dumplings. It can be served either dry or in a broth, and is often garnished with barbecued pork (char siu) and leafy greens.", "Tips": "nan", "Latitude": 1.300333942, "Longitude": 103.7975698, "GoogleMapsURL": "https://maps.app.goo.gl/jvJegyCHH2UxcKJi6"}, {"Name": "DengWenJi", "Food": "Wanton mee", "Description": "Wanton mee is a popular noodle dish in Singapore and Malaysia, known for its thin, chewy egg noodles and savory wonton dumplings. It can be served either dry or in a broth, and is often garnished with barbecued pork (char siu) and leafy greens.", "Tips": "Bonus - Clay pot is nice", "Latitude": 1.331868697, "Longitude": 103.9465583, "GoogleMapsURL": "https://maps.app.goo.gl/uMLAH9D1S7KpVTkS7"}, {"Name": "Ji Ji Wanton Noodle Specialist", "Food": "Wanton mee", "Description": "Wanton mee is a popular noodle dish in Singapore and Malaysia, known for its thin, chewy egg noodles and savory wonton dumplings. It can be served either dry or in a broth, and is often garnished with barbecued pork (char siu) and leafy greens.", "Tips": "nan", "Latitude": 1.28531429, "Longitude": 103.8458376, "GoogleMapsURL": "https://maps.app.goo.gl/fE1isZphcwJY8Bdt7"}, {"Name": "Taste of Jiang Nan", "Food": "Xiao Long Bao", "Description": "Xiao Long Bao, often called &quot;little basket buns&quot; or &quot;soup dumplings,&quot; are delicate steamed buns filled with a savory filling and rich broth. They are a classic dish from the Jiangnan region of China, particularly associated with Shanghai and Wuxi.", "Tips": "Bonus - Amazing pork dumplings in chilli oil", "Latitude": 1.2802102, "Longitude": 103.8449297, "GoogleMapsURL": "https://maps.app.goo.gl/YqKUkmVzGfkDTgVN6"}, {"Name": "High Street Tai Wah Pork Noodle", "Food": "Bak Chor Mee", "Description": "Bak Chor Mee (literally translated to &#x27;minced meat noodles&#x27; in Hokkien) features a delectable combination of springy egg noodles and tender minced pork. Like many Singaporean dishes, it is available either with soup or dry.", "Tips": "Number 3 on the menu is the most famous", "Latitude": 1.285387389, "Longitude": 103.8459495, "GoogleMapsURL": "https://maps.app.goo.gl/yMgNc7jB8MBZCPVBA"}, {"Name": "Yong Xiang Xing Dou Fu", "Food": "Yong Tao Foo", "Description": "The name itself, pronounced \u201cnyiong tiew foo\u201d in Hakka, literally translates as \u201cstuffed tofu.\u201d The dish refers to a collection of tofu or vegetable morsels stuffed with fish paste, ground pork, or a mixture of both. The versatility of yong tau foo sees the dish being served fried, in soups, or braised.", "Tips": "nan", "Latitude": 1.285231795, "Longitude": 103.8428428, "GoogleMapsURL": "https://maps.app.goo.gl/1j11X1brfjbeaASa8"}, {"Name": "Brothers Ramen", "Food": "Ramen", "Description": "Ramen is a type of Japanese noodle soup.", "Tips": "Jiro style ramen", "Latitude": 1.275955214, "Longitude": 103.8462157, "GoogleMapsURL": "https://maps.app.goo.gl/HKQrDVfWDscnomVZ6"}, {"Name": "Ramen-ya", "Food": "Ramen", "Description": "Ramen is a type of Japanese noodle soup.", "Tips": "Specialist Shio Ramen", "Latitude": 1.331815991, "Longitude": 103.9467382, "GoogleMapsURL": "https://maps.app.goo.gl/qLuCjtaFBnURAsc7A"}, {"Name": "The Coconut Club Beach Road", "Food": "Nasi Lamek", "Description": "Nasi lemak is a rice dish commonly served with roasted nuts, egg, ikan bilis (anchovies), and slices of cucumber. Literally meaning \u201cfatty rice\u201d in Malay, nasi lemak&#x27;s distinctive taste comes from cooking the rice in coconut milk and pandan leaves which gives the dish its rich flavour and fragrant aroma.", "Tips": "$$$ Signature Ayam Nasi Lemak", "Latitude": 1.300631787, "Longitude": 103.8601795, "GoogleMapsURL": "https://maps.app.goo.gl/LZmHzKw8iRju2LtH8"}, {"Name": "Sungei Road Laksa", "Food": "Laksa", "Description": "Laksa is a spicy noodle soup originating from Peranakan cuisine, a fusion of Chinese and Malay culinary traditions. It&#x27;s a popular dish in Southeast Asia, particularly in Singapore, Malaysia, and Indonesia.", "Tips": "Apparently this is the best", "Latitude": 1.306750217, "Longitude": 103.8578715, "GoogleMapsURL": "https://maps.app.goo.gl/3NT3djnec7hdn8dm8"}, {"Name": "Janggut Laksa, The Original Katong Laksa Since 1950s", "Food": "Laksa", "Description": "Laksa is a spicy noodle soup originating from Peranakan cuisine, a fusion of Chinese and Malay culinary traditions. It&#x27;s a popular dish in Southeast Asia, particularly in Singapore, Malaysia, and Indonesia.", "Tips": "Katong  Laksa", "Latitude": 1.28520611, "Longitude": 103.8447235, "GoogleMapsURL": "https://maps.app.goo.gl/eKxV3RQ2eqUjyWz7A"}, {"Name": "Ba Shu Sichuan Restaurant", "Food": "Mala", "Description": "The dish features a variety of vegetables, meat and seafood stir-fried together in a rich spicy sauce. Typically, it is served in a large bowl and shared family style with steamed rice.", "Tips": "$$$ Schichuan spicy popcorn chicken", "Latitude": 1.32523476, "Longitude": 103.9327578, "GoogleMapsURL": "https://maps.app.goo.gl/Cvy9XBZYbkBYCt2JA"}, {"Name": "Sichuan Tianfu Restaurant", "Food": "Mala", "Description": "The dish features a variety of vegetables, meat and seafood stir-fried together in a rich spicy sauce. Typically, it is served in a large bowl and shared family style with steamed rice.", "Tips": "$$$ Shichuan fish with pickled mustard greens", "Latitude": 1.314280876, "Longitude": 103.7650867, "GoogleMapsURL": "https://maps.app.goo.gl/bQnj4Aj7CeYSa7Cp9"}, {"Name": "Kok Sen Restaurant", "Food": "Zi char meal", "Description": "A Zi Char meal in Singapore is a communal dining experience featuring a wide variety of home-style Chinese dishes cooked to order and meant for sharing. It&#x27;s a popular choice for groups of people to enjoy a hearty and affordable meal. Zi Char meals are typically served with rice or noodles, alongside a spread of side dishes.", "Tips": "Bring more people", "Latitude": 1.279431958, "Longitude": 103.8415668, "GoogleMapsURL": "https://maps.app.goo.gl/6mTF6kT7rGfKWAVR8"}, {"Name": "Two Chefs Eating Place", "Food": "Zi char meal", "Description": "A Zi Char meal in Singapore is a communal dining experience featuring a wide variety of home-style Chinese dishes cooked to order and meant for sharing. It&#x27;s a popular choice for groups of people to enjoy a hearty and affordable meal. Zi Char meals are typically served with rice or noodles, alongside a spread of side dishes.", "Tips": "nan", "Latitude": 1.307099464, "Longitude": 103.8001182, "GoogleMapsURL": "https://maps.app.goo.gl/bEr488HbJb336R9c6"}, {"Name": "BurgerLabo", "Food": "Burger", "Description": "A burger is a patty of ground beef grilled and placed between two halves of a bun.", "Tips": "nan", "Latitude": 1.280826927, "Longitude": 103.8184741, "GoogleMapsURL": "https://maps.app.goo.gl/BzzFt4weWo5QUHxF8"}, {"Name": "One Flattened Calf Burgers", "Food": "Burger", "Description": "A burger is a patty of ground beef grilled and placed between two halves of a bun.", "Tips": "nan", "Latitude": 1.292247902, "Longitude": 103.8389335, "GoogleMapsURL": "https://maps.app.goo.gl/ViCkr7sW6omWWu277"}, {"Name": "NBCB Orchard Central", "Food": "Burger", "Description": "A burger is a patty of ground beef grilled and placed between two halves of a bun.", "Tips": "nan", "Latitude": 1.300616599, "Longitude": 103.8398627, "GoogleMapsURL": "https://maps.app.goo.gl/M6jEtt4CfMWgDLpU6"}, {"Name": "Kim Heng HK Roasted Delights", "Food": "Roast meat", "Description": "In Singapore, &quot;roast meat&quot; typically refers to Cantonese-style roasted meats, collectively known as &quot;siu mei&quot; (\u70e7\u5473) or &quot;siu laap&quot; (\u70e7\u814a). This cooking method involves roasting meats, usually pork, over an open fire or in a rotisserie oven to achieve a deep, barbecue flavor. Popular dishes include char siu (\u53c9\u70e7), which is fork-roasted pork, and siu yuk (\u70e7\u8089), which is roast pork belly.", "Tips": "nan", "Latitude": 1.356991745, "Longitude": 103.8735488, "GoogleMapsURL": "https://maps.app.goo.gl/qWE12sF1JM9qxS3XA"}, {"Name": "Rubicon Steak House", "Food": "Steak", "Description": "A steak dish typically features a cut of meat, usually beef, sliced across the muscle fibers, often grilled or pan-fried.", "Tips": "$ Hokkaido wagyu", "Latitude": 1.351943467, "Longitude": 103.8359553, "GoogleMapsURL": "https://maps.app.goo.gl/DDgdvk55NSDR7pyr8"}, {"Name": "iSteaks", "Food": "Steak", "Description": "A steak dish typically features a cut of meat, usually beef, sliced across the muscle fibers, often grilled or pan-fried.", "Tips": "It\u2019s a chain, so multiple", "Latitude": 1.306619798, "Longitude": 103.787748, "GoogleMapsURL": "https://maps.app.goo.gl/JnTNFqvGPN59ar6p7"}, {"Name": "Keef The Beef Bungalow", "Food": "Steak", "Description": "A steak dish typically features a cut of meat, usually beef, sliced across the muscle fibers, often grilled or pan-fried.", "Tips": "$$$", "Latitude": 1.30457442, "Longitude": 103.787518, "GoogleMapsURL": "https://maps.app.goo.gl/EswtpogKGnywCuwM8"}, {"Name": "Keng Wah Sung Caf\u00e9", "Food": "Kaya toast and Coffee", "Description": "Sandwiched between the toasted slices is a thick layer of kaya jam, rich in coconut flavor. It&#x27;s often served with soft-boiled eggs that are silky smooth, paired with a cup of traditional coffee. In the past, kaya toast was grilled over a charcoal stove.", "Tips": "nan", "Latitude": 1.315066724, "Longitude": 103.8915509, "GoogleMapsURL": "https://maps.app.goo.gl/54Nkd6mB6aiKziDj7"}, {"Name": "Toast Box", "Food": "Kaya toast and Coffee", "Description": "Sandwiched between the toasted slices is a thick layer of kaya jam, rich in coconut flavor. It&#x27;s often served with soft-boiled eggs that are silky smooth, paired with a cup of traditional coffee. In the past, kaya toast was grilled over a charcoal stove.", "Tips": "It\u2019s a chain, so multiple", "Latitude": 1.285617929, "Longitude": 103.8449628, "GoogleMapsURL": "https://maps.app.goo.gl/41hytjURTfocuy8C7"}, {"Name": "1950\u2019s Coffee", "Food": "Kaya toast and Coffee", "Description": "Sandwiched between the toasted slices is a thick layer of kaya jam, rich in coconut flavor. It&#x27;s often served with soft-boiled eggs that are silky smooth, paired with a cup of traditional coffee. In the past, kaya toast was grilled over a charcoal stove.", "Tips": "nan", "Latitude": 1.280447073, "Longitude": 103.8445258, "GoogleMapsURL": "https://maps.app.goo.gl/vmk9wYhuRv2oY5yHA"}];

navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    L.circleMarker([latitude, longitude], { radius: 6, color: 'blue' }).addTo(map).bindPopup("You are here");
});

function getColor(rating) {
    if (rating === null || rating === undefined || isNaN(rating)) return 'gray';
    if (rating >= 9) return 'green';
    if (rating >= 7) return 'yellow';
    if (rating >= 0) return 'red';
    return 'gray';
}

function saveRating(key, value) {
    storedData[key] = storedData[key] || {};
    storedData[key].rating = parseFloat(value);
    localStorage.setItem('foodRatings', JSON.stringify(storedData));
    location.reload();
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

function createPopupContent(dataKey, name, food, description, tips, mapLink) {
    const stored = storedData[dataKey] || {};
    let rating = stored.rating || '';
    let notes = stored.notes || '';
    let photo = stored.photo || '';
    return `
        ${photo ? `<img src="${photo}" width="100%" style="margin-bottom:5px;" /><br/>` : ""}
        <b>${name}</b><br/>
        <small><i>${food} – ${description || ''}</i></small><br/>
        ${tips && tips.toLowerCase() !== 'nan' ? `<b>Tip:</b> ${tips}<br/>` : ''}
        <a href="${mapLink}" target="_blank">Open in Google Maps</a><br/><br/>
        <label>Rating (0–10):</label>
        <input type="number" min="0" max="10" step="0.1" value="${rating}" onchange="saveRating('${dataKey}', this.value)" /><br/>
        ${rating ? `
            <label>Notes:</label><br/>
            <textarea rows="2" onchange="saveNotes('${dataKey}', this.value)">${notes}</textarea><br/>
            <label>Upload Photo:</label>
            <input type="file" accept="image/*" onchange="savePhoto(event, '${dataKey}')" />
        ` : ''}
    `;
}

const foodOptions = new Set();
data.forEach(row => {
    const { Name, Food, Description, Tips, Latitude, Longitude, GoogleMapsURL } = row;
    if (!Latitude || !Longitude) return;
    foodOptions.add(Food);
    const key = `${Name}_${Latitude}_${Longitude}`;
    const rating = storedData[key]?.rating ?? null;
    const marker = L.circleMarker([parseFloat(Latitude), parseFloat(Longitude)], {
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

const select = document.createElement('select');
select.innerHTML = `<option value="All">All Foods</option>` +
    Array.from(foodOptions).map(f => `<option value="${f}">${f}</option>`).join('');
select.onchange = () => {
    const value = select.value;
    markers.forEach(m => {
        if (value === 'All' || m.foodType === value) m.addTo(map);
        else map.removeLayer(m);
    });
};
select.style.position = 'absolute';
select.style.top = '10px';
select.style.left = '10px';
select.style.zIndex = 1000;
document.body.appendChild(select);

const backupBtn = document.createElement('button');
backupBtn.innerText = '📤 Export Backup';
backupBtn.style.position = 'absolute';
backupBtn.style.bottom = '60px';
backupBtn.style.left = '10px';
backupBtn.style.zIndex = 1000;
backupBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(storedData)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'my_food_data.json';
    a.click();
};
document.body.appendChild(backupBtn);

const restoreBtn = document.createElement('button');
restoreBtn.innerText = '📥 Import Backup';
restoreBtn.style.position = 'absolute';
restoreBtn.style.bottom = '100px';
restoreBtn.style.left = '10px';
restoreBtn.style.zIndex = 1000;
restoreBtn.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const imported = JSON.parse(reader.result);
                localStorage.setItem('foodRatings', JSON.stringify(imported));
                alert('Backup restored!');
                location.reload();
            } catch {
                alert('Invalid JSON file.');
            }
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
};
document.body.appendChild(restoreBtn);

fetch('https://raw.githubusercontent.com/gaibul/sg-food-map/main/my_food_data.json')
    .then(res => res.ok ? res.json() : null)
    .then(json => {
        if (json) {
            localStorage.setItem('foodRatings', JSON.stringify(json));
            location.reload();
        }
    })
    .catch(() => {});

// Add Place Button
const addBtn = document.createElement('button');
addBtn.innerText = '➕ Add Place';
addBtn.style.position = 'absolute';
addBtn.style.bottom = '140px';
addBtn.style.left = '10px';
addBtn.style.zIndex = 1000;
addBtn.onclick = () => {
    alert("Click on the map where you want to add a new place.");
    map.once('click', function(e) {
        const formDiv = document.createElement('div');
        formDiv.innerHTML = `
            <label>Name:</label><br/><input id="addName" /><br/>
            <label>Food Type:</label><br/><input id="addFood" /><br/>
            <label>Description:</label><br/><input id="addDesc" /><br/>
            <label>Tips:</label><br/><input id="addTips" /><br/>
            <label>Google Maps URL:</label><br/><input id="addUrl" /><br/><br/>
            <button onclick="submitNewPlace()">Add</button>
        `;
        const popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(formDiv)
            .openOn(map);
        window.submitNewPlace = function() {
            const Name = document.getElementById('addName').value;
            const Food = document.getElementById('addFood').value;
            const Description = document.getElementById('addDesc').value;
            const Tips = document.getElementById('addTips').value;
            const GoogleMapsURL = document.getElementById('addUrl').value;
            const Latitude = e.latlng.lat.toFixed(6);
            const Longitude = e.latlng.lng.toFixed(6);
            const key = `${Name}_${Latitude}_${Longitude}`;
            const newData = { Name, Food, Description, Tips, Latitude, Longitude, GoogleMapsURL };
            data.push(newData);
            const marker = L.circleMarker([Latitude, Longitude], {
                radius: 8,
                color: getColor(null),
                fillOpacity: 0.9
            });
            const popupHtml = createPopupContent(key, Name, Food, Description, Tips, GoogleMapsURL);
            marker.bindPopup(popupHtml);
            marker.foodType = Food;
            marker.addTo(map);
            markers.push(marker);
            map.closePopup();
            alert("New place added! Don’t forget to export backup.");
        };
    });
};
document.body.appendChild(addBtn);
