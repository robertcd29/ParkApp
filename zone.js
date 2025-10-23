let titleEl = document.getElementById("title");
let descEl = document.getElementById("description");
let sidebar = document.getElementById("sidebar");
let statusBadge = document.getElementById("statusBadge");
let closeBtn = document.getElementById("closeBtn");
let directionsBtn = document.getElementById("directionsBtn");
let reserveBtn = document.getElementById("reserveBtn");

let zonesData = [];
let polygons = {}; // Stochează toate poligoanele pentru actualizare

// Funcție pentru a determina culoarea în funcție de disponibilitate
function getZoneColor(emptySpots, totalSpots) {
    if (emptySpots === 0) {
        return { stroke: "#D32F2F", fill: "#D32F2F" }; // Roșu - Complet
    }
    
    const percentage = (emptySpots / totalSpots) * 100;
    
    if (percentage > 50) {
        return { stroke: "#388E3C", fill: "#388E3C" }; // Verde - Multe locuri
    } else if (percentage > 20) {
        return { stroke: "#F57C00", fill: "#F57C00" }; // Portocaliu - Medie
    } else {
        return { stroke: "#FBC02D", fill: "#FBC02D" }; // Galben - Puține locuri
    }
}

// Funcție pentru a actualiza culorile tuturor zonelor
function updateZoneColors() {
    zonesData.forEach(zone => {
        const zoneName = zone.parking_name;
        const polygon = polygons[zoneName];
        
        if (polygon) {
            const totalSpots = zone.empty_spots + zone.occupied_spots;
            const colors = getZoneColor(zone.empty_spots, totalSpots);
            
            polygon.setOptions({
                strokeColor: colors.stroke,
                fillColor: colors.fill
            });
        }
    });
}

// Funcție pentru a încărca datele din baza de date
function fetchParkingData() {
    fetch('http://localhost:3000/parking_lot')
        .then(res => res.json())
        .then(data => {
            zonesData = data;
            console.log("Date actualizate:", new Date().toLocaleTimeString(), zonesData);
            
            // Actualizează culorile zonelor
            updateZoneColors();
            
            // Dacă sidebar-ul este deschis, actualizează informațiile
            if (sidebar.classList.contains('show')) {
                const currentZoneName = titleEl.textContent;
                const updatedZone = zonesData.find(z => z.parking_name === currentZoneName);
                if (updatedZone) {
                    updateSidebarInfo(updatedZone);
                }
            }
        })
        .catch(err => console.error('Eroare la fetch:', err));
}

// Funcție pentru actualizarea informațiilor din sidebar
function updateSidebarInfo(zoneInfo) {
    titleEl.textContent = zoneInfo.parking_name;
    descEl.innerHTML = `
        <strong>Număr parcare:</strong> ${zoneInfo.parking_number}<br>
        <strong>Locuri disponibile:</strong> ${zoneInfo.empty_spots}<br>
        <strong>Locuri ocupate:</strong> ${zoneInfo.occupied_spots}<br>
        <strong>Total locuri:</strong> ${zoneInfo.empty_spots + zoneInfo.occupied_spots}
    `;

    const percentage = (zoneInfo.empty_spots / (zoneInfo.empty_spots + zoneInfo.occupied_spots) * 100).toFixed(0);
    
    // Actualizează badge-ul
    if (zoneInfo.empty_spots === 0) {
        statusBadge.textContent = 'COMPLET';
        statusBadge.className = 'popup-badge complet';
    } else if (percentage > 50) {
        statusBadge.textContent = `DISPONIBIL (${percentage}%)`;
        statusBadge.className = 'popup-badge deschis';
    } else if (percentage > 20) {
        statusBadge.textContent = `LIMITAT (${percentage}%)`;
        statusBadge.className = 'popup-badge';
        statusBadge.style.background = '#FFE0B2';
        statusBadge.style.color = '#E65100';
    } else {
        statusBadge.textContent = `PUȚINE LOCURI (${percentage}%)`;
        statusBadge.className = 'popup-badge';
        statusBadge.style.background = '#FFF9C4';
        statusBadge.style.color = '#F57F17';
    }
}

// Încarcă datele inițial
fetchParkingData();

// Actualizează datele la fiecare 10 secunde
setInterval(fetchParkingData, 10000);

// Funcția care atașează click listener
function setupZoneClickListener(zone, zoneName) {
    zone.addListener("click", () => {
        console.log("Click pe zona:", zoneName);
        const zoneInfo = zonesData.find(z => z.parking_name.toLowerCase() === zoneName.toLowerCase());
        console.log("Zone info găsit:", zoneInfo);

        if (!zoneInfo) return alert(`Nu am găsit detalii pentru zona: ${zoneName}`);

        updateSidebarInfo(zoneInfo);
        
        sidebar.classList.add("show");
        document.getElementById('map').classList.add('shrink');
        setTimeout(() => google.maps.event.trigger(map, 'resize'), 400);
    });
}

// Funcțiile de control sidebar
function closePanel() {
    sidebar.classList.remove("show");
    document.getElementById('map').classList.remove('shrink');
    setTimeout(() => google.maps.event.trigger(map, 'resize'), 400);
}

closeBtn.onclick = closePanel;

directionsBtn.onclick = () => {
    const zoneName = titleEl.textContent;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(zoneName + ', Timișoara')}`, '_blank');
};

reserveBtn.onclick = () => {
    const zoneName = titleEl.textContent;
    const zoneInfo = zonesData.find(z => z.parking_name === zoneName);
    
    if (zoneInfo && zoneInfo.empty_spots > 0) {
        alert(`Rezervare în lucru pentru: ${zoneName}\nLocuri disponibile: ${zoneInfo.empty_spots}`);
    } else {
        alert(`Ne pare rău, nu mai sunt locuri disponibile în ${zoneName}`);
    }
};

document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && sidebar.classList.contains('show')) closePanel();
});

// Inițializare poligoane
function initZone(mapInstance) {
    map = mapInstance;

    // Definește toate zonele cu coordonatele lor
    const zones = [
        {
            name: "Bega_Central",
            coords: [
                { lat: 45.749114, lng: 21.226676 },
                { lat: 45.749185, lng: 21.226690 },
                { lat: 45.749154, lng: 21.227360 },
                { lat: 45.749091, lng: 21.227373 }
            ]
        },
        {
            name: "Zona_Primarie",
            coords: [
                { lat: 45.751206, lng: 21.227346 },
                { lat: 45.751222, lng: 21.227222 },
                { lat: 45.751418, lng: 21.227318 },
                { lat: 45.751424, lng: 21.227482 }
            ]
        },
        {
            name: "Zona_Piata_Victoriei",
            coords: [
                { lat: 45.752182, lng: 21.227423 },
                { lat: 45.752564, lng: 21.226005 },
                { lat: 45.752689, lng: 21.226094 },
                { lat: 45.752344, lng: 21.227499 }
            ]
        }
        // Adaugă aici toate celelalte zone din baza ta de date
    ];

    // Creează poligoanele pentru fiecare zonă
    zones.forEach(zoneData => {
        const zoneInfo = zonesData.find(z => z.parking_name === zoneData.name);
        const totalSpots = zoneInfo ? zoneInfo.empty_spots + zoneInfo.occupied_spots : 100;
        const emptySpots = zoneInfo ? zoneInfo.empty_spots : 50;
        const colors = getZoneColor(emptySpots, totalSpots);

        const polygon = new google.maps.Polygon({
            paths: zoneData.coords,
            strokeColor: colors.stroke,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colors.fill,
            fillOpacity: 0.35,
            map: map
        });

        // Stochează poligonul pentru actualizări ulterioare
        polygons[zoneData.name] = polygon;

        // Adaugă listener pentru click
        setupZoneClickListener(polygon, zoneData.name);

        // Efect hover
        polygon.addListener('mouseover', () => {
            polygon.setOptions({ fillOpacity: 0.6 });
        });

        polygon.addListener('mouseout', () => {
            polygon.setOptions({ fillOpacity: 0.35 });
        });
    });

    console.log(`✅ ${zones.length} zone inițializate cu succes`);
}