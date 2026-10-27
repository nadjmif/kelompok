import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Vector as VectorSource } from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { fromLonLat } from 'ol/proj.js';
import { Icon, Style } from 'ol/style.js';
import Overlay from 'ol/Overlay.js';

// Untuk menampilkan polygon Riau dengan data .json
const riau = new VectorLayer({
source: new VectorSource({
format: new GeoJSON(),
url: 'data/polygon_riau.json'
})
});

// Untuk menampilkan titik kesehatan dan icon
const hospital = new VectorLayer({
source: new VectorSource({
format: new GeoJSON(),
url: 'data/fasilitas_kesehatan.geojson'
}),
style: new Style({
image: new Icon(({
anchor: [0.5, 46],
  anchorXUnits: 'fraction',
anchorYUnits: 'pixels',
src: 'icon/hospital.png',
width: 32,
height: 32
}))
})
});

const container = document.getElementById('popup');
const content_element = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
//Create overlay popup
const overlay = new Overlay({
element: container,
autoPan: {
animation: {
duration: 250,
},
},
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }), riau, hospital  // memanggil variabel data
  ],
  overlays: [overlay],
  target: document.getElementById('map'),
  view: new View({
    center: fromLonLat([101.438309, 0.510440]),
    zoom: 12,
  }),
});


map.addOverlay(overlay); // untuk menambah overlay

// JS for click popup
map.on('singleclick', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (!feature) {
        overlay.setPosition(undefined);
        return;
    }

    const coordinate = evt.coordinate;

    const nama = feature.get('Nama_Pemetaan') || '-';
    const jenis = feature.get('Jenis_Fasilitas') || '-';
    const kapasitas = feature.get('Kapasitas_Pelayanan') || '-';
    const jam = feature.get('Jam_Operasional') || '-';
    const kelengkapan = feature.get('Kelengkapan_Layanan') || '-';
    const jarak = feature.get('Jarak_Jalan_Utama_m') ?? '-';

    const content =
        '<h3>Nama Fasilitas: ' + nama + '</h3>' +
        '<p><b>Jenis Fasilitas:</b> ' + jenis + '</p>' +
        '<p><b>Kapasitas Pelayanan:</b> ' + kapasitas + '</p>' +
        '<p><b>Jam Operasional:</b> ' + jam + '</p>' +
        '<p><b>Kelengkapan Layanan:</b> ' + kelengkapan + '</p>' +
        '<p><b>Jarak ke Jalan Utama:</b> ' + jarak + ' meter</p>';

    content_element.innerHTML = content;
    overlay.setPosition(coordinate);
});

//Click handler to hide popup
closer.onclick = function () {
overlay.setPosition(undefined);
closer.blur();
return false;
};