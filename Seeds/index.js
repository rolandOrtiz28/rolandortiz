if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./Seeds/cities')
const { places, descriptors } = require('./Seeds/seedHelpers');
const Campground = require('./models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    // useNewUrlParser: true,
    // // useCreateIndex: true,
    // useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, " connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const sample = (Array) => Array[Math.floor(Math.random() * Array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        // const location = `${cities[random1000].city}, ${cities[random1000].state}`
        // const geoData = await geocoder.forwardGeocode({
        //     query: location,
        //     limit: 1
        // }).send()

        const camp = new Campground({
            owner: '6427dd8db990ef9bc5617299',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'gwapohe junjo hin uraura',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [

                {
                    url: 'https://res.cloudinary.com/dbzuuuvue/image/upload/v1680779561/YelpCamp/mn81frx58lseyr8n3vtk.jpg',
                    filename: 'YelpCamp/mn81frx58lseyr8n3vtk',

                },
                {
                    url: 'https://res.cloudinary.com/dbzuuuvue/image/upload/v1680777925/YelpCamp/nr6jhuxvwhlwqkvs5cqr.jpg',
                    filename: 'YelpCamp/nr6jhuxvwhlwqkvs5cqr',

                },
                {
                    url: 'https://res.cloudinary.com/dbzuuuvue/image/upload/v1680777926/YelpCamp/phit6filyyn25hb6mogx.jpg',
                    filename: 'YelpCamp/phit6filyyn25hb6mogx',

                }


            ]


        })
        await camp.save();
    }
}




seedDB();