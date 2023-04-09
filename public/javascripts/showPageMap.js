const goodCampground = JSON.parse(campground);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: goodCampground.geometry.coordinates,
    zoom: 9
});
map.addControl(new mapboxgl.NavigationControl());
const marker = new mapboxgl.Marker()
    .setLngLat(goodCampground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<center><h6>${goodCampground.title}</h6><p>${goodCampground.location}</p></center>`
            )
    )
    .addTo(map);







