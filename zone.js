let titleEl = document.getElementById("title");
let descEl = document.getElementById("description");
let sidebar = document.getElementById("sidebar");
let statusBadge = document.getElementById("statusBadge");
let closeBtn = document.getElementById("closeBtn");
let directionsBtn = document.getElementById("directionsBtn");
let reserveBtn = document.getElementById("reserveBtn");

function setupZoneClickListener(zone, title, status) {
    zone.addListener("click", () => {
        titleEl.textContent = title;
        statusBadge.textContent = status;
        
        statusBadge.className = 'popup-badge';
        if (status.toLowerCase() === 'deschis') {
            statusBadge.classList.add('deschis');
        } else if (status.toLowerCase() === 'complet') {
            statusBadge.classList.add('complet');
        }
        
        descEl.innerHTML = `<span class="status ${status.toLowerCase().replace(' ', '-')}">${status}</span>`;
        
        sidebar.classList.add("show");
        document.getElementById('map').classList.add('shrink');
        
        setTimeout(() => {
            google.maps.event.trigger(map, 'resize');
        }, 400);
    });
}

function closePanel() {
    sidebar.classList.remove("show");
    document.getElementById('map').classList.remove('shrink');
    
    setTimeout(() => {
        google.maps.event.trigger(map, 'resize');
    }, 400);
}

closeBtn.onclick = closePanel;

directionsBtn.onclick = () => {
    const zoneName = titleEl.textContent;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(zoneName + ', Timișoara')}`, '_blank');
};

reserveBtn.onclick = () => {
    alert(`Rezervare în lucru pentru: ${titleEl.textContent}`);
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('show')) {
        closePanel();
    }
});

function initZone(mapInstance){
    map = mapInstance; 
    
    const coord_zona_Hidrotehnica1 = [
        { lat: 45.749114, lng: 21.226676 },
        { lat: 45.749185, lng: 21.226690 },
        { lat: 45.749154, lng: 21.227360 },
        { lat: 45.749091, lng: 21.227373 }
    ];

    const zona_Hidrotehnica1 = new google.maps.Polygon({
        paths: coord_zona_Hidrotehnica1,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    zona_Hidrotehnica1.setMap(map);
    setupZoneClickListener(zona_Hidrotehnica1, "Zona Hidrotehnica", "In lucru");


    const coord_zona_Primarie1 = [
        { lat: 45.751206, lng: 21.227346 },
        { lat: 45.751222, lng: 21.227222 },
        { lat: 45.751418, lng: 21.227318 },
        { lat: 45.751424, lng: 21.227482 },
        { lat: 45.751433, lng: 21.227632 },
        { lat: 45.751439, lng: 21.227809 },
        { lat: 45.751212, lng: 21.227817 }
    ];

    const zona_Primarie1 = new google.maps.Polygon({
        paths: coord_zona_Primarie1,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    zona_Primarie1.setMap(map);
    setupZoneClickListener(zona_Primarie1, "Zona Primarie", "In lucru");

    const coord_zona_Primarie2 = [
        { lat: 45.751605, lng: 21.226457 },
        { lat: 45.751526, lng: 21.226809 },
        { lat: 45.751251, lng: 21.226634 },
        { lat: 45.751297, lng: 21.226287 }
    ];

    const zona_Primarie2 = new google.maps.Polygon({
        paths: coord_zona_Primarie2,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    zona_Primarie2.setMap(map);
    setupZoneClickListener(zona_Primarie2, "Zona Primarie", "In lucru");

    const coord_zona_PiataVictoriei1 = [
        { lat: 45.752182, lng: 21.227423 },
        { lat: 45.752564, lng: 21.226005 },
        { lat: 45.752689, lng: 21.226094 },
        { lat: 45.752344, lng: 21.227499 }
    ];

    const zona_PiataVictoriei1 = new google.maps.Polygon({
        paths: coord_zona_PiataVictoriei1,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    zona_PiataVictoriei1.setMap(map);
    setupZoneClickListener(zona_PiataVictoriei1, "Zona Piata Victoriei", "In lucru");

    const coord_zona_PiataVictoriei2 = [
        { lat: 45.753562, lng: 21.227398 },
        { lat: 45.753684, lng: 21.226346 },
        { lat: 45.753920, lng: 21.226399 },
        { lat: 45.753831, lng: 21.227184 },
        { lat: 45.753768, lng: 21.227248 },
        { lat: 45.753748, lng: 21.227424 }
    ];

    const zona_PiataVictoriei2 = new google.maps.Polygon({
        paths: coord_zona_PiataVictoriei2,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    zona_PiataVictoriei2.setMap(map);
    setupZoneClickListener(zona_PiataVictoriei2, "Zona Piata Victoriei", "In lucru");

    const coord_BegaCentral = [
        { lat: 45.755127, lng: 21.229633 },
        { lat: 45.755070, lng: 21.230507 },
        { lat: 45.755257, lng: 21.230524 },
        { lat: 45.755283, lng: 21.230179 },
        { lat: 45.755372, lng: 21.230192 },
        { lat: 45.755296, lng: 21.229662 }
    ];

    const BegaCentral = new google.maps.Polygon ({
        paths: coord_BegaCentral,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    BegaCentral.setMap(map);
    setupZoneClickListener(BegaCentral, "Bega Central", "In lucru");

    const coord_zona_Judecatorie = [
        { lat: 45.757417, lng: 21.231775 },
        { lat: 45.757486, lng: 21.230864 },
        { lat: 45.757414, lng: 21.230867 },
        { lat: 45.757364, lng: 21.231772 }
    ];

    const zona_Judecatorie = new google.maps.Polygon ({
        paths: coord_zona_Judecatorie,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    zona_Judecatorie.setMap(map);
    setupZoneClickListener(zona_Judecatorie, "Zona Judecatorie", "In lucru");

    const coord_zona_ConventionCenter1 = [
        { lat: 45.755275, lng: 21.224814 },
        { lat: 45.755246, lng: 21.224357 },
        { lat: 45.755130, lng: 21.224412 },
        { lat: 45.754999, lng: 21.224340 },
        { lat: 45.754687, lng: 21.224397 },
        { lat: 45.754687, lng: 21.224397 },
        { lat: 45.754331, lng: 21.224404 },
        { lat: 45.754276, lng: 21.224604 },
        { lat: 45.754377, lng: 21.224992 }
    ];

    const zona_ConventionCenter1 = new google.maps.Polygon ({
        paths: coord_zona_ConventionCenter1,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    zona_ConventionCenter1.setMap(map);
    setupZoneClickListener(zona_ConventionCenter1, "Zona Convention Center", "In lucru");

    const coord_zona_ConventionCenter2 = [
        { lat: 45.754424, lng: 21.223647 },
        { lat: 45.754221, lng: 21.223762 },
        { lat: 45.754358, lng: 21.224314 },
        { lat: 45.754679, lng: 21.224162 },
        { lat: 45.754700, lng: 21.224284 },
        { lat: 45.754849, lng: 21.224239 },
        { lat: 45.754784, lng: 21.223774 },
        { lat: 45.754451, lng: 21.223790 }
    ];

    const zona_ConventionCenter2 = new google.maps.Polygon ({
        paths: coord_zona_ConventionCenter2,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    zona_ConventionCenter2.setMap(map);
    setupZoneClickListener(zona_ConventionCenter2, "Zona Convention Center", "In lucru");

    const coord_BdMihaiEminescu1 = [
        { lat: 45.751502, lng: 21.229047 },
        { lat: 45.751573, lng: 21.229395 },
        { lat: 45.751783, lng: 21.230315 },
        { lat: 45.752060, lng: 21.231275 },
        { lat: 45.752559, lng: 21.232598 },

        { lat: 45.752616, lng: 21.232542 },
        { lat: 45.752140, lng: 21.231259 },
        { lat: 45.751837, lng: 21.230285 },
        { lat: 45.751639, lng: 21.229370 },
        { lat: 45.751579, lng: 21.229046 }
    ];

    const BdMihaiEminescu1 = new google.maps.Polygon ({
        paths: coord_BdMihaiEminescu1,
        strokeColor: "#fcd703",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#fcd703",
        fillOpacity: 0.35
    });

    BdMihaiEminescu1.setMap(map);
    setupZoneClickListener(BdMihaiEminescu1, "Bulevardul Mihai Eminescu", "In lucru");

    const coord_StrGheorgheAndrasiu = [
        { lat: 45.752042, lng: 21.231272 },
        { lat: 45.751274, lng: 21.231758 }
    ];

    const StrGheorgheAndrasiu = new google.maps.Polygon ({
        paths: coord_StrGheorgheAndrasiu,
        strokeColor: "#fcd703",
        strokeOpacity: 0.65,
        strokeWeight: 5,
        fillColor: "#fcd703",
        fillOpacity: 0.35
    });

    StrGheorgheAndrasiu.setMap(map);
    setupZoneClickListener(StrGheorgheAndrasiu, "Strada Gheorghe Andrasiu", "In lucru");

    const coord_StrPatriarhMironCristea = [
        { lat: 45.751563, lng: 21.228979 },
        { lat: 45.753320, lng: 21.228665 }
    ];

    const StrPatriarhMironCristea = new google.maps.Polygon ({
        paths: coord_StrPatriarhMironCristea,
        strokeColor: "#fcd703",
        strokeOpacity: 0.65,
        strokeWeight: 5,
        fillColor: "#fcd703",
        fillOpacity: 0.35
    });

    StrPatriarhMironCristea.setMap(map);
    setupZoneClickListener(StrPatriarhMironCristea, "Strada Patriarh Miron Cristea", "In lucru");

    const coord_StrMaximilianRobespierre= [
        { lat: 45.752335, lng: 21.228876 },
        { lat: 45.752427, lng: 21.229435 }
    ];

    const StrMaximilianRobespierre = new google.maps.Polygon ({
        paths: coord_StrMaximilianRobespierre,
        strokeColor: "#fcd703",
        strokeOpacity: 0.65,
        strokeWeight: 5,
        fillColor: "#fcd703",
        fillOpacity: 0.35
    });

   StrMaximilianRobespierre.setMap(map);
    setupZoneClickListener(StrMaximilianRobespierre, "Strada Maximilian Robespierre", "In lucru");
}