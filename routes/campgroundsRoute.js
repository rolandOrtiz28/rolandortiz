const express = require('express');
const router = express.Router();
const campground = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isOwner, validateCampground } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })



router.get('/', catchAsync(campground.index));
router.get('/new', isLoggedIn, campground.renderNewForm);


router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground))
router.get("/:id", catchAsync(campground.showPage));


router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campground.requestEditCampGround));

router.put('/:id', isLoggedIn, isOwner, upload.array('image'), validateCampground, catchAsync(campground.updatingCampground));

router.delete('/:id', isLoggedIn, isOwner, catchAsync(campground.deleteCampground))

module.exports = router;