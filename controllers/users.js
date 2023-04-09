const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}



module.exports.createAnewUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}



module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}




module.exports.logInUser = (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.gobackTo || '/';
    delete req.session.gobackTo;
    res.redirect(redirectUrl);
}



module.exports.logOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}