let map;
let geocode;
let marker = null;

function initMap() {
            const Timisoara = { lat: 45.756177, lng: 21.228237 };
            map = new google.maps.Map(document.getElementById("map"), {
                zoom: 13,
                center: Timisoara,
            });

            geocoder = new google.maps.Geocoder();

            document.getElementById("showBtn").addEventListener("click", () => {
                const address = document.getElementById("address").value;
                if(address.trim() !== "") {
                    geocodeAddress(address);
                } else {
                    alert("Introdu o adresă validă!");
                }
            });
            initZone(map);
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
                        position: new google.maps.LatLng(location.lat(), location.lng()),
                        title: address,
                        animation: google.maps.Animation.DROP
                    });
            } 
            else {
                alert("Nu am găsit adresa: " + status);
            }
        });
}

const apiScript = document.createElement("script");
    apiScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap`;
    apiScript.async = true;
    document.head.appendChild(apiScript);