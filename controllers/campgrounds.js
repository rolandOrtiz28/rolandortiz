const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { storage } = require('../cloudinary');
const { cloudinary } = require('../cloudinary');




module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}).populate('owner');
    res.render('campgrounds/index', { campgrounds })
}


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}


module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.owner = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground');
    res.redirect(`/campgrounds/${campground._id}`);


}



module.exports.showPage = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'owner'
            }
        }).populate('owner');
        if (!campground) {
            req.flash('error', 'Cannot find Campground');
            return res.redirect('/campgrounds');
        }
        res.render("campgrounds/show", { campground });
    } catch (err) {
        next(err);
    }
}


module.exports.requestEditCampGround = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that Campground');
        return res.redirect('campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updatingCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    campground.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted')
    res.redirect('/campgrounds');
}