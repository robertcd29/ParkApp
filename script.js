let map;
let geocoder;
let marker = null;

function initMap() {
    const Timisoara = { lat: 45.756177, lng: 21.228237 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: Timisoara,
    });

    geocoder = new google.maps.Geocoder();
    enableEnterSearch();
    google.maps.event.addListenerOnce(map, "idle", () => {
        if (typeof initZone === "function") {
            initZone(map);
        }
    });
}

function geocodeAddress(address) {
    geocoder.geocode({ address: address }, (results, status) => {
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
        } else {
            alert("Nu am găsit adresa: " + status);
        }
    });
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

const apiScript = document.createElement("script");
apiScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap`;
apiScript.async = true;
document.head.appendChild(apiScript);
