var User = require('../app/models/user');
var config = require('./auth');

var localOptions = {
	usernameField: 'email'
};

var localLogin = new LocalStrategy(localOptions, function(email, password, done){

	User.findOne({
		email: email
	}, function(err, user){

		if(err){
			return done(err);
		}

		if(!user){
			return done(null, false, {error: 'Login failed. Please try again.'});
		}

		user.comparePassword(password, function(err, isMatch){

			if(err){
				return done(err);
			}

			if(!isMatch){
				return done(null, false, {error: 'Login failed. Please try again.'});
			}

			return done(null, user);

		});

	});

});

var jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

	User.findById(payload._id, function(err, user){

		if(err){
			return done(err, false);
		}

		if(user){
			done(null, user);
		} else {
			done(null, false);
		}

	});

});



