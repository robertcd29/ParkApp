let map;
let geocoder;
let marker = null;

function initMap() {
    const Timisoara = { lat: 45.756177, lng: 21.228237 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: Timisoara,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Încarcă datele inițiale
    loadParkingData();

    // Actualizează datele la fiecare 10 secunde
    setInterval(loadParkingData, 10000);

    geocoder = new google.maps.Geocoder();
    enableEnterSearch();
    
    google.maps.event.addListenerOnce(map, "idle", () => {
        if (typeof initZone === "function") {
            initZone(map);
        }
    });

    // Adaugă buton de reîmprospătare manuală
    addRefreshButton();
}

function loadParkingData() {
    fetch('http://localhost:3000/parking_lot')
    .then(response => response.json())
    .then(data => {
        updateParkingList(data);
        updateStats(data);
    })
    .catch(err => {
        console.error('Eroare la fetch:', err);
        showNotification('Eroare la încărcarea datelor', 'error');
    });
}

function updateParkingList(data) {
    const lista = document.getElementById('lista-produse');
    if (!lista) return;
    
    lista.innerHTML = ''; // Curăță lista
    
    data.forEach(p => {
        const li = document.createElement('li');
        const percentage = (p.empty_spots / (p.empty_spots + p.occupied_spots) * 100).toFixed(0);
        
        let statusClass = 'status-full';
        if (percentage > 50) statusClass = 'status-available';
        else if (percentage > 20) statusClass = 'status-limited';
        
        li.innerHTML = `
            <span class="parking-name">${p.parking_name}</span>
            <span class="parking-number">Nr. ${p.parking_number}</span>
            <span class="parking-spots ${statusClass}">
                ${p.empty_spots} / ${p.empty_spots + p.occupied_spots} disponibile
            </span>
        `;
        li.className = 'parking-list-item';
        lista.appendChild(li);
    });
}

function updateStats(data) {
    const totalEmpty = data.reduce((sum, p) => sum + p.empty_spots, 0);
    const totalOccupied = data.reduce((sum, p) => sum + p.occupied_spots, 0);
    const totalSpots = totalEmpty + totalOccupied;
    
    // Actualizează elementele de statistici dacă există
    const statsEl = document.getElementById('stats-container');
    if (statsEl) {
        statsEl.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${totalEmpty}</div>
                <div class="stat-label">Locuri Libere</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${totalOccupied}</div>
                <div class="stat-label">Locuri Ocupate</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${totalSpots}</div>
                <div class="stat-label">Total Locuri</div>
            </div>
        `;
    }
    
    console.log(`📊 Statistici: ${totalEmpty} libere / ${totalSpots} total`);
}

function geocodeAddress(address) {
    geocoder.geocode({ address: address + ', Timișoara' }, (results, status) => {
        if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;

            map.setCenter(location);
            map.setZoom(17);

            if (marker) marker.setMap(null);
            marker = new google.maps.Marker({
                map: map,
                position: location,
                title: address,
                animation: google.maps.Animation.DROP
            });

            // Verifică dacă există parcări în apropiere
            checkNearbyParking(location);
        } else {
            showNotification("Nu am găsit adresa: " + address, 'error');
        }
    });
}

function checkNearbyParking(location) {
    // Aici poți adăuga logică pentru a găsi cele mai apropiate parcări
    showNotification("Căutare parcări în apropiere...", 'info');
}

function enableEnterSearch() {
    const input = document.getElementById("address");
    if (!input) return;

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const adresa = input.value.trim();
            if (adresa) {
                geocodeAddress(adresa);
                input.value = ""; 
                input.focus();   
            }
        }
    });
}

function addRefreshButton() {
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '🔄 Actualizează';
    refreshBtn.className = 'refresh-button';
    refreshBtn.onclick = () => {
        loadParkingData();
        showNotification('Date actualizate!', 'success');
    };
    
    const navbar = document.querySelector('.navbar .container-fluid');
    if (navbar) {
        navbar.appendChild(refreshBtn);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Încarcă API-ul Google Maps
const apiScript = document.createElement("script");
apiScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap`;
apiScript.async = true;
apiScript.onerror = () => {
    showNotification('Eroare la încărcarea hărții Google Maps', 'error');
};
document.head.appendChild(apiScript);