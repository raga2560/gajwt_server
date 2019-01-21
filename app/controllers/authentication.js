var jwt = require('jsonwebtoken');  
var crypto = require('crypto');
var User = require('../models/user');
var authConfig = require('../../config/auth');

function generateToken(user){
	return jwt.sign(user, authConfig.secret, {
		expiresIn: 10080,
		algorithm: 'HS256'
	});
}


function setUserInfo(request){
	return {
		_id: request._id,
		role: request.role
	};
}

function verifyJWTToken(token ) {

    var onlytoken = token.split(' ')[1];

    return new Promise ((resolve, reject) => {
      jwt.verify(onlytoken, authConfig.secret, (err, decodedToken) => {
      if (err || !decodedToken)
      {
        return reject(err)
      }
       resolve(decodedToken);
    });
  });
}

exports.authenticate = function(req, res, next) {

   if(req.headers.authorization) {
  var  token = req.headers.authorization
   } else {
      return res.status(400)
        .json({message: "no token provided."})
   }
  console.log("token="+ token);
  verifyJWTToken(token)
    .then((decodedToken) =>
    {
      req.user = decodedToken;
      next()
    })
    .catch((err) =>
    {
      res.status(400)
        .json({message: "Invalid auth token provided."})
    })

};

exports.login = function(req, res, next){

        var email = req.body.email;
        var password = req.body.password;



        if(!email){
                return res.status(422).send({error: 'You must enter an email address'});
        }

        if(!password){
                return res.status(422).send({error: 'You must enter a password'});
        }



          User.findOne({
                email: email
        }, function(err, user){

                if(err){
                //       res.status(422).json({error: 'No user found.'});
                                return next(err);
                }

                if(!user){
                       res.status(422).json({error: 'No user found.'});
                                return next(err);
                }

                user.comparePassword(password, function(err, isMatch){

                        if(err){
                                return done(err);
                        }

                        if(!isMatch){
                                res.status(422).json({error: 'Password not matching.'});
                                return next(err);
                        }

	                var userInfo = setUserInfo(user);

	                res.status(200).json({
		                token: "JWT "+ generateToken(userInfo),
		                user: userInfo
	                });


                });

        });


}

exports.register = function(req, res, next){

	var email = req.body.email;
	var password = req.body.password;
	var role = req.body.role;



	if(!email){
		return res.status(422).send({error: 'You must enter an email address'});
	}

	if(!password){
		return res.status(422).send({error: 'You must enter a password'});
	}

	User.findOne({email: email}, function(err, existingUser){

		if(err){
			return next(err);
		}

		if(existingUser){
			return res.status(422).send({error: 'That email address is already in use'});
		}

		var user = new User({
			email: email,
			password: password,
			role: role
		});

		user.save(function(err, user){

			if(err){
				return next(err);
			}

			var userInfo = setUserInfo(user);

			res.status(201).json({
				token: "JWT "+ generateToken(userInfo),
				user: userInfo
			})

		});

	});

}



exports.roleAuthorization = function(roles){

	return function(req, res, next){

		var user = req.user;

		User.findById(user._id, function(err, foundUser){

			if(err){
				res.status(422).json({error: 'No user found.'});
				return next(err);
			}

			if(roles.indexOf(foundUser.role) > -1){
				return next();
			}

			res.status(401).json({error: 'You are not authorized to view this content'});
			return next('Unauthorized');

		});

	}

}
