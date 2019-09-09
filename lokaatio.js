
//asetetaan kartan oletusnäkymä käyttäjän lokaation mukaan
var mymap = L.map('mapdiv').locate({setView: true, maxZoom:15});

//alla oleva koodi hakee ja määrittää käytettävän karttapohjan OpenStreetMapista
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'sk.eyJ1IjoiYW5zb2xhaSIsImEiOiJjanhkZXY1cGQwNHhsM3RvY240aHh4OGR2In0.1c4hX9PMV-_8we-49YpU6g'
}).addTo(mymap);


//Oma ikonimuotoilu käyttäjön ikonille
var myIcon = L.Icon.extend({
    options: {
        iconSize: [45, 45],
        iconAnchor: [23, 23],
        popupAnchor: [0,-20],
    }
});
var omaIkoni = new myIcon({iconUrl: 'skull.png'});

//kun lokaatio löytyy, ilmoitetaan käyttäjälle ja merkataan sijainti kartalle
function onLocationFound(e) {
    var radius = e.accuracy;
    // L.marker(e.latlng).addTo(mymap)
    L.marker([e.latitude, e.longitude], {icon:omaIkoni}).addTo(mymap)
    // L.marker([e.latlng], {icon: myIcon}).addTo(mymap)
        .bindPopup("Olet " + radius + "m säteellä <br>tästä pisteestä").openPopup();
    L.circle(e.latlng, radius).addTo(mymap);
}
mymap.on('locationfound', onLocationFound);

//mikäli käyttäjää ei löydetä, annetaan virheilmoitus
function onLocationError(e) {
    alert(e.message);
}
mymap.on('locationerror', onLocationError);

//Juna-asemien datan haku sijainnin esittämistä varten
var asemat;
var asemapyynto;
asemapyynto = new XMLHttpRequest();
asemapyynto.onreadystatechange = statechange;
asemapyynto.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/stations");
asemapyynto.send();

function statechange(){
    if (asemapyynto.readyState===4) {
        asemat = JSON.parse(asemapyynto.responseText);
        kayLapi(asemat);
    }
}

//lisätään asemille siniset merkit ja asemanimet PopUppeihin
function kayLapi(asemat) {
    for (var i=0; i< asemat.length; ++i) {
         var asema = asemat[i];
        console.log(asema);
        L.marker( [asema.latitude, asema.longitude] )
            .bindPopup( '<a href=" https://fi.wikipedia.org/wiki/' + asema.stationName + '" target="_blank">' + asema.stationName + '</a>' )
            .addTo( mymap );
    }
}

//Pääkalloikoni: Icon made by DinosoftLabs from www.flaticon.com